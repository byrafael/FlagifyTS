import type { FlagifyTransport } from "../client/transport";
import { auditLogListResponseSchema } from "../schemas/analytics";
import type { RequestOptions } from "../types/api";

export class AuditClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public list(
    params: {
      environment?: string;
      resource_type?: string;
      resource_id?: string;
      resource_key?: string;
      actor_id?: string;
      action?: string;
      created_from?: string;
      created_to?: string;
      limit?: number;
      offset?: number;
    } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/audit-logs`,
      query: params,
      schema: auditLogListResponseSchema,
      ...options,
    });
  }
}
