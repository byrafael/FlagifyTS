import type { FlagifyTransport } from "../client/transport";
import {
  changeRequestListResponseSchema,
  changeRequestSchema,
  createChangeRequestRequestSchema,
  reviewChangeRequestRequestSchema,
} from "../schemas/operations";
import type { RequestOptions } from "../types/api";

export class ChangeRequestsClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public create(data: unknown, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/change-requests`,
      body: createChangeRequestRequestSchema.parse(data),
      schema: changeRequestSchema,
      ...options,
    });
  }

  public list(
    params: { limit?: number; offset?: number } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/change-requests`,
      query: params,
      schema: changeRequestListResponseSchema,
      ...options,
    });
  }

  public get(changeRequestId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/change-requests/${changeRequestId}`,
      schema: changeRequestSchema,
      ...options,
    });
  }

  public review(
    args: { changeRequestId: string; decision: "approve" | "reject" },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/change-requests/${args.changeRequestId}/review`,
      body: reviewChangeRequestRequestSchema.parse({ decision: args.decision }),
      schema: changeRequestSchema,
      ...options,
    });
  }

  public apply(changeRequestId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/change-requests/${changeRequestId}/apply`,
      schema: changeRequestSchema,
      ...options,
    });
  }
}
