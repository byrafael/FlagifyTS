import type { FlagifyTransport } from "../client/transport";
import {
  createIdentityRequestSchema,
  identityListResponseSchema,
  identitySchema,
  identityTraitMapResponseSchema,
  identityTraitPutRequestSchema,
  identityTraitsPatchRequestSchema,
  identityTraitUpsertResponseSchema,
  updateIdentityRequestSchema,
} from "../schemas/identity";
import type { RequestOptions } from "../types/api";

export class IdentitiesClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public create(data: unknown, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/identities`,
      body: createIdentityRequestSchema.parse(data),
      schema: identitySchema,
      validateResponse: false,
      ...options,
    });
  }

  public list(
    params: {
      limit?: number;
      offset?: number;
      kind?: string;
      identifier?: string;
      status?: "active" | "disabled" | "deleted";
    } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/identities`,
      query: params,
      schema: identityListResponseSchema,
      ...options,
    });
  }

  public get(identityId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/identities/${identityId}`,
      schema: identitySchema,
      ...options,
    });
  }

  public update(
    args: { identityId: string; data: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PATCH",
      path: `/api/v1/projects/${this.projectId}/identities/${args.identityId}`,
      body: updateIdentityRequestSchema.parse(args.data),
      schema: identitySchema,
      ...options,
    });
  }

  public delete(identityId: string, options?: RequestOptions) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${this.projectId}/identities/${identityId}`,
      ...options,
    });
  }

  public listTraits(identityId: string, options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/identities/${identityId}/traits`,
      schema: identityTraitMapResponseSchema,
      ...options,
    });
  }

  public setTraits(
    args: {
      identityId: string;
      set?: Record<string, unknown>;
      unset?: string[];
    },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PATCH",
      path: `/api/v1/projects/${this.projectId}/identities/${args.identityId}/traits`,
      body: identityTraitsPatchRequestSchema.parse({
        set: args.set,
        unset: args.unset,
      }),
      schema: identityTraitMapResponseSchema,
      ...options,
    });
  }

  public putTrait(
    args: { identityId: string; traitKey: string; value: unknown },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "PUT",
      path: `/api/v1/projects/${this.projectId}/identities/${args.identityId}/traits/${args.traitKey}`,
      body: identityTraitPutRequestSchema.parse({ value: args.value }),
      schema: identityTraitUpsertResponseSchema,
      ...options,
    });
  }
}
