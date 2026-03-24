import type { FlagifyTransport } from "../client/transport";
import {
  createSegmentRequestSchema,
  segmentListResponseSchema,
  segmentSchema,
  updateSegmentRequestSchema,
} from "../schemas/segment";
import type { RequestOptions } from "../types/api";

export class SegmentsClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public create(data: unknown, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/segments`,
      body: createSegmentRequestSchema.parse(data),
      schema: segmentSchema,
      ...options,
    });
  }

  public list(
    params: { limit?: number; offset?: number } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/segments`,
      query: params,
      schema: segmentListResponseSchema,
      ...options,
    });
  }

  public get(segmentId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/segments/${segmentId}`,
      schema: segmentSchema,
      ...options,
    });
  }

  public update(
    args: { segmentId: string; data: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PATCH",
      path: `/api/v1/projects/${this.projectId}/segments/${args.segmentId}`,
      body: updateSegmentRequestSchema.parse(args.data),
      schema: segmentSchema,
      ...options,
    });
  }

  public delete(segmentId: string, options?: RequestOptions) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${this.projectId}/segments/${segmentId}`,
      ...options,
    });
  }
}
