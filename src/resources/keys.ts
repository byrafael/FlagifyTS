import type { FlagifyTransport } from "../client/transport";
import {
  apiKeySchema,
  createdKeySchema,
  createKeyRequestSchema,
  keyListResponseSchema,
} from "../schemas/key";
import type { RequestOptions } from "../types/api";

export class KeysClient {
  public constructor(private readonly transport: FlagifyTransport) {}

  public create(data: unknown, options?: RequestOptions) {
    const parsed = createKeyRequestSchema.parse(data);

    return this.transport.request({
      method: "POST",
      path: "/api/v1/keys",
      body: {
        kind: parsed.kind,
        project_id: parsed.projectId,
        client_id: "clientId" in parsed ? parsed.clientId : undefined,
        name: parsed.name,
        scopes: parsed.scopes,
        expires_at: parsed.expiresAt,
      },
      schema: createdKeySchema,
      ...options,
    });
  }

  public list(
    params: { projectId?: string; limit?: number; offset?: number } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: "/api/v1/keys",
      query: {
        project_id: params.projectId,
        limit: params.limit,
        offset: params.offset,
      },
      schema: keyListResponseSchema,
      ...options,
    });
  }

  public get(keyId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/keys/${keyId}`,
      schema: apiKeySchema,
      ...options,
    });
  }

  public revoke(keyId: string, options?: RequestOptions) {
    return this.transport.request<void>({
      method: "POST",
      path: `/api/v1/keys/${keyId}/revoke`,
      ...options,
    });
  }
}
