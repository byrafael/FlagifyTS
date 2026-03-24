import type { FlagifyTransport } from "../client/transport";
import {
  projectExportSchema,
  projectImportRequestSchema,
  projectImportResponseSchema,
} from "../schemas/operations";
import type { RequestOptions } from "../types/api";

export class ImportExportClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly projectId: string,
  ) {}

  public export(options?: RequestOptions) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/projects/${this.projectId}/export`,
      schema: projectExportSchema,
      ...options,
    });
  }

  public import(
    args: {
      data: unknown;
      dryRun?: boolean;
      replace?: boolean;
    },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/projects/${this.projectId}/import`,
      query: {
        dry_run: args.dryRun,
        replace: args.replace,
      },
      body: projectImportRequestSchema.parse(args.data),
      schema: projectImportResponseSchema,
      ...options,
    });
  }
}
