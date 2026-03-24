import type { FlagifyTransport } from "../client/transport";
import { evaluationEventListResponseSchema } from "../schemas/analytics";
import type { RequestOptions } from "../types/api";

export class EventsClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public list(
    params: {
      environment?: string;
      flag_id?: string;
      client_id?: string;
      limit?: number;
      offset?: number;
    } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/evaluation-events`,
      query: params,
      schema: evaluationEventListResponseSchema,
      ...options,
    });
  }
}
