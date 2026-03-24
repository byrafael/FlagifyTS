import type { FlagifyTransport } from "../client/transport";
import {
  createFlagRequestSchema,
  flagEnvironmentConfigSchema,
  flagListResponseSchema,
  flagSchema,
  putFlagEnvironmentConfigRequestSchema,
  staleFlagReportResponseSchema,
  updateFlagRequestSchema,
} from "../schemas/flag";
import type { RequestOptions } from "../types/api";

export class FlagsClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public create(data: unknown, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/flags`,
      body: createFlagRequestSchema.parse(data),
      schema: flagSchema,
      ...options,
    });
  }

  public list(
    params: { limit?: number; offset?: number; includeArchived?: boolean } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/flags`,
      query: {
        limit: params.limit,
        offset: params.offset,
        include_archived: params.includeArchived,
      },
      schema: flagListResponseSchema,
      ...options,
    });
  }

  public get(flagId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/flags/${flagId}`,
      schema: flagSchema,
      ...options,
    });
  }

  public update(
    args: { flagId: string; data: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PATCH",
      path: `/api/v1/projects/${this.projectId}/flags/${args.flagId}`,
      body: updateFlagRequestSchema.parse(args.data),
      schema: flagSchema,
      ...options,
    });
  }

  public delete(flagId: string, options?: RequestOptions) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${this.projectId}/flags/${flagId}`,
      ...options,
    });
  }

  public getEnvironmentConfig(
    args: { flagId: string; environmentKey: string },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/flags/${args.flagId}/environments/${args.environmentKey}`,
      schema: flagEnvironmentConfigSchema,
      ...options,
    });
  }

  public putEnvironmentConfig(
    args: { flagId: string; environmentKey: string; data: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PUT",
      path: `/api/v1/projects/${this.projectId}/flags/${args.flagId}/environments/${args.environmentKey}`,
      body: putFlagEnvironmentConfigRequestSchema.parse(args.data),
      schema: flagEnvironmentConfigSchema,
      ...options,
    });
  }

  public deleteEnvironmentConfig(
    args: { flagId: string; environmentKey: string },
    options?: RequestOptions,
  ) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${this.projectId}/flags/${args.flagId}/environments/${args.environmentKey}`,
      ...options,
    });
  }

  public staleReport(
    params: {
      evaluatedBefore?: string;
      staleStatus?: "active" | "stale";
      hasCodeReferences?: boolean;
      limit?: number;
      offset?: number;
    } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/flags/stale-report`,
      query: {
        evaluated_before: params.evaluatedBefore,
        stale_status: params.staleStatus,
        has_code_references: params.hasCodeReferences,
        limit: params.limit,
        offset: params.offset,
      },
      schema: staleFlagReportResponseSchema,
      ...options,
    });
  }
}
