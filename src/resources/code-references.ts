import type { FlagifyTransport } from "../client/transport";
import {
  codeReferenceListResponseSchema,
  createCodeReferencesRequestSchema,
} from "../schemas/operations";
import type { RequestOptions } from "../types/api";

export class CodeReferencesClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public create(data: unknown, options?: RequestOptions) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/code-references`,
      body: createCodeReferencesRequestSchema.parse(data),
      schema: codeReferenceListResponseSchema,
      ...options,
    });
  }

  public list(
    params: { limit?: number; offset?: number } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/code-references`,
      query: params,
      schema: codeReferenceListResponseSchema,
      ...options,
    });
  }

  public delete(referenceId: string, options?: RequestOptions) {
    return this.transport.request<void>({
      method: "DELETE",
      path: `/api/v1/projects/${this.projectId}/code-references/${referenceId}`,
      ...options,
    });
  }
}
