import type { FlagifyTransport } from "../client/transport";
import {
  clientListResponseSchema,
  clientSchema,
  createClientRequestSchema,
  overrideListResponseSchema,
  overrideSchema,
  putOverrideRequestSchema,
  updateClientRequestSchema,
} from "../schemas/client";
import type { RequestOptions } from "../types/api";

export class ClientsClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public create(data: unknown, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/clients`,
      body: createClientRequestSchema.parse(data),
      schema: clientSchema,
      ...options,
    });
  }

  public list(
    params: { limit?: number; offset?: number } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/clients`,
      query: params,
      schema: clientListResponseSchema,
      ...options,
    });
  }

  public get(clientId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/clients/${clientId}`,
      schema: clientSchema,
      ...options,
    });
  }

  public update(
    args: { clientId: string; data: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PATCH",
      path: `/api/v1/projects/${this.projectId}/clients/${args.clientId}`,
      body: updateClientRequestSchema.parse(args.data),
      schema: clientSchema,
      ...options,
    });
  }

  public delete(clientId: string, options?: RequestOptions) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${this.projectId}/clients/${clientId}`,
      ...options,
    });
  }

  public putOverride(
    args: { clientId: string; flagId: string; value: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PUT",
      path: `/api/v1/projects/${this.projectId}/clients/${args.clientId}/flags/${args.flagId}/override`,
      body: putOverrideRequestSchema.parse({ value: args.value }),
      schema: overrideSchema,
      ...options,
    });
  }

  public listOverrides(clientId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/clients/${clientId}/overrides`,
      schema: overrideListResponseSchema,
      ...options,
    });
  }

  public deleteOverride(
    args: { clientId: string; flagId: string },
    options?: RequestOptions,
  ) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${this.projectId}/clients/${args.clientId}/flags/${args.flagId}/override`,
      ...options,
    });
  }
}
