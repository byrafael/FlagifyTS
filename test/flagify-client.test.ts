import { describe, expect, test } from "bun:test";
import { FlagifyClient } from "../src/client/flagify-client";
import { FlagifyError } from "../src/errors/flagify-error";
import { createdKeySchema, createKeyRequestSchema } from "../src/schemas/key";
import {
  resolvedConfigSchema,
  runtimeSnapshotSchema,
} from "../src/schemas/runtime";

const makeResponse = (body: string, init: ResponseInit = {}) =>
  new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/json",
      ...init.headers,
    },
    ...init,
  });

describe("FlagifyClient", () => {
  test("normalizes baseUrl and injects bearer auth", async () => {
    let seenUrl = "";
    let authHeader = "";
    const client = new FlagifyClient({
      baseUrl: "https://flagify.example.com",
      apiKey: "secret",
      fetch: async (input, init) => {
        seenUrl = String(input);
        authHeader = new Headers(init?.headers).get("authorization") ?? "";
        return makeResponse(
          JSON.stringify({
            items: [],
            meta: { total: 0, limit: 50, offset: 0 },
          }),
        );
      },
    });

    await client.projects.list();

    expect(seenUrl).toBe("https://flagify.example.com/api/v1/projects");
    expect(authHeader).toBe("Bearer secret");
  });

  test("supports 204 responses", async () => {
    const client = new FlagifyClient({
      baseUrl: "https://flagify.example.com/",
      apiKey: "secret",
      fetch: async () => new Response(null, { status: 204 }),
    });

    await expect(client.keys.revoke("key_123")).resolves.toBeUndefined();
  });

  test("wraps API failures in FlagifyError", async () => {
    const client = new FlagifyClient({
      baseUrl: "https://flagify.example.com/",
      apiKey: "secret",
      fetch: async () =>
        makeResponse(
          JSON.stringify({
            error: "forbidden",
            message: "Missing required scope",
          }),
          {
            status: 403,
          },
        ),
    });

    await expect(client.projects.list()).rejects.toBeInstanceOf(FlagifyError);
  });

  test("fails fast when projectId is missing", () => {
    const client = new FlagifyClient({
      baseUrl: "https://flagify.example.com/",
      apiKey: "secret",
      fetch: async () => makeResponse("{}"),
    });

    expect(() => client.project()).toThrow("A projectId is required");
    expect(() => client.runtime.getClientConfig({ clientKey: "web" })).toThrow(
      "requires a projectId",
    );
  });

  test("validates discriminated key creation input", () => {
    expect(() =>
      createKeyRequestSchema.parse({
        kind: "client_runtime",
        projectId: "project_123",
        name: "runtime key",
      }),
    ).toThrow();
  });

  test("chooses project runtime path variants correctly", async () => {
    const seen: string[] = [];
    const payload = {
      project: { id: "project_123", slug: "store" },
      client: { id: "client_123", key: "web" },
      environment: { id: "env_123", key: "production", name: "Production" },
      flags: {},
      meta: { resolved_at: "2026-03-23T00:00:00Z" },
    };
    const client = new FlagifyClient({
      baseUrl: "https://flagify.example.com/",
      apiKey: "secret",
      fetch: async (input) => {
        seen.push(String(input));
        return makeResponse(JSON.stringify(payload));
      },
    });

    await client.runtime.getClientConfig({
      projectId: "project_123",
      clientKey: "web",
      environment: "production",
    });
    await client.runtime.getClientConfig({
      projectId: "project_123",
      clientKey: "web",
      environmentKey: "production",
    });

    expect(seen[0]).toBe(
      "https://flagify.example.com/api/v1/runtime/projects/project_123/clients/web/config?environment=production",
    );
    expect(seen[1]).toBe(
      "https://flagify.example.com/api/v1/runtime/projects/project_123/environments/production/clients/web/config",
    );
  });

  test("handles ETag snapshot responses", async () => {
    const client = new FlagifyClient({
      baseUrl: "https://flagify.example.com/",
      apiKey: "secret",
      projectId: "project_123",
      fetch: async (_input, init) => {
        const headers = new Headers(init?.headers);
        if (headers.get("if-none-match") === '"snap-1"') {
          return new Response(null, {
            status: 304,
            headers: { etag: '"snap-1"' },
          });
        }

        return makeResponse(
          JSON.stringify({
            project_id: "project_123",
            environment: {
              id: "env_123",
              key: "production",
              name: "Production",
            },
            segments: [],
            flags: [],
            meta: { generated_at: "2026-03-23T00:00:00Z", mode: "snapshot" },
          }),
          {
            headers: { etag: '"snap-1"' },
          },
        );
      },
    });

    const fresh = await client.runtime.getEnvironmentSnapshot({
      environmentKey: "production",
    });
    const cached = await client.runtime.getEnvironmentSnapshot({
      environmentKey: "production",
      ifNoneMatch: '"snap-1"',
    });

    expect(fresh.notModified).toBe(false);
    expect(fresh.etag).toBe('"snap-1"');
    expect(cached.notModified).toBe(true);
  });

  test("schema exports parse contract fixtures", () => {
    expect(
      createdKeySchema.parse({
        id: "key_123",
        project_id: "project_123",
        client_id: null,
        name: "frontend read key",
        prefix: "fg_abc",
        kind: "project_read",
        scopes: ["projects:read"],
        last_used_at: null,
        expires_at: null,
        revoked_at: null,
        created_at: "2026-03-23T00:00:00Z",
        secret: "fg_abc.def",
      }).secret,
    ).toBe("fg_abc.def");

    expect(
      resolvedConfigSchema.parse({
        project: { id: "project_123", slug: "store" },
        client: { id: "client_123", key: "web" },
        environment: { id: "env_123", key: "production", name: "Production" },
        flags: {},
        meta: { resolved_at: "2026-03-23T00:00:00Z" },
      }).project.id,
    ).toBe("project_123");

    expect(
      runtimeSnapshotSchema.parse({
        project_id: "project_123",
        environment: { id: "env_123", key: "production", name: "Production" },
        segments: [],
        flags: [],
        meta: { generated_at: "2026-03-23T00:00:00Z", mode: "snapshot" },
      }).project_id,
    ).toBe("project_123");
  });
});
