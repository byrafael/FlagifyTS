import { z } from "zod";
import { KeysClient } from "../resources/keys";
import { ProjectsClient } from "../resources/projects";
import { RuntimeClient } from "../resources/runtime";
import type { FetchLike, FlagifyClientOptions } from "../types/auth";
import { ProjectClient } from "./project-client";
import { FlagifyTransport } from "./transport";

const flagifyClientOptionsSchema = z.object({
  baseUrl: z.string().min(1),
  apiKey: z.string().min(1),
  projectId: z.string().min(1).optional(),
  fetch: z
    .custom<FetchLike>(
      (value) => value === undefined || typeof value === "function",
    )
    .optional(),
  validateResponses: z.boolean().optional(),
  userAgent: z.string().min(1).optional(),
});

export class FlagifyClient {
  readonly #transport: FlagifyTransport;
  readonly #projectId: string | undefined;

  readonly projects: ProjectsClient;
  readonly keys: KeysClient;
  readonly runtime: RuntimeClient;

  public constructor(options: FlagifyClientOptions) {
    const parsed = flagifyClientOptionsSchema.parse(options);
    this.#transport = new FlagifyTransport(options);
    this.#projectId = parsed.projectId ?? options.projectId;
    this.projects = new ProjectsClient(this.#transport);
    this.keys = new KeysClient(this.#transport);
    this.runtime = new RuntimeClient(this.#transport, this.#projectId);
  }

  public project(projectId?: string) {
    const resolvedProjectId = projectId ?? this.#projectId;
    if (!resolvedProjectId) {
      throw new Error(
        "A projectId is required. Pass one to client.project(projectId) or set projectId when constructing FlagifyClient.",
      );
    }

    return new ProjectClient(this.#transport, resolvedProjectId);
  }
}
