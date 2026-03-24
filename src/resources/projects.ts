import type { FlagifyTransport } from "../client/transport";
import {
  createProjectRequestSchema,
  projectListResponseSchema,
  projectSchema,
  updateProjectRequestSchema,
} from "../schemas/project";
import type { RequestOptions } from "../types/api";

export class ProjectsClient {
  public constructor(private readonly transport: FlagifyTransport) {}

  public create(data: unknown, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: "/api/v1/projects",
      body: createProjectRequestSchema.parse(data),
      schema: projectSchema,
      ...options,
    });
  }

  public list(
    params: { limit?: number; offset?: number } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: "/api/v1/projects",
      query: params,
      schema: projectListResponseSchema,
      ...options,
    });
  }

  public get(projectId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${projectId}`,
      schema: projectSchema,
      ...options,
    });
  }

  public update(
    args: { projectId: string; data: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PATCH",
      path: `/api/v1/projects/${args.projectId}`,
      body: updateProjectRequestSchema.parse(args.data),
      schema: projectSchema,
      ...options,
    });
  }

  public delete(projectId: string, options?: RequestOptions) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${projectId}`,
      ...options,
    });
  }
}
