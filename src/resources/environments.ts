import type { FlagifyTransport } from "../client/transport";
import {
  createEnvironmentRequestSchema,
  environmentListResponseSchema,
  environmentSchema,
  updateEnvironmentRequestSchema,
} from "../schemas/environment";
import type { RequestOptions } from "../types/api";

export class EnvironmentsClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public create(data: unknown, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/environments`,
      body: createEnvironmentRequestSchema.parse(data),
      schema: environmentSchema,
      ...options,
    });
  }

  public list(
    params: { limit?: number; offset?: number } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/environments`,
      query: params,
      schema: environmentListResponseSchema,
      ...options,
    });
  }

  public get(environmentId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/environments/${environmentId}`,
      schema: environmentSchema,
      ...options,
    });
  }

  public update(
    args: { environmentId: string; data: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PATCH",
      path: `/api/v1/projects/${this.projectId}/environments/${args.environmentId}`,
      body: updateEnvironmentRequestSchema.parse(args.data),
      schema: environmentSchema,
      ...options,
    });
  }

  public delete(environmentId: string, options?: RequestOptions) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${this.projectId}/environments/${environmentId}`,
      ...options,
    });
  }
}
