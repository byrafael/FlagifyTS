import type { FlagifyTransport } from "../client/transport";
import { analyticsListResponseSchema } from "../schemas/analytics";
import type { RequestOptions } from "../types/api";

type AnalyticsParams = {
  environment?: string;
  flag_id?: string;
  flag_key?: string;
  created_from?: string;
  created_to?: string;
  limit?: number;
};

export class AnalyticsClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public byFlag(params: AnalyticsParams = {}, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/analytics/evaluations/by-flag`,
      query: params,
      schema: analyticsListResponseSchema,
      ...options,
    });
  }

  public byVariant(params: AnalyticsParams = {}, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/analytics/evaluations/by-variant`,
      query: params,
      schema: analyticsListResponseSchema,
      ...options,
    });
  }

  public byEnvironment(params: AnalyticsParams = {}, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/analytics/evaluations/by-environment`,
      query: params,
      schema: analyticsListResponseSchema,
      ...options,
    });
  }

  public recentActivity(
    params: AnalyticsParams = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/analytics/recent-activity`,
      query: params,
      schema: analyticsListResponseSchema,
      ...options,
    });
  }
}
