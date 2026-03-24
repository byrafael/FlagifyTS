import type { FlagifyTransport } from "../client/transport";
import {
  evaluateIdentityRequestSchema,
  evaluationEventBatchAcceptedSchema,
  evaluationEventBatchRequestSchema,
  getIdentityConfigRequestSchema,
  getIdentityFlagRequestSchema,
  resolvedConfigSchema,
  resolvedFlagSchema,
  runtimeSnapshotSchema,
} from "../schemas/runtime";
import type { RequestOptions, SnapshotRequestOptions } from "../types/api";

export class RuntimeClient {
  public constructor(
    private readonly transport: FlagifyTransport,
    private readonly defaultProjectId?: string,
  ) {}

  public getBoundConfig(
    args: { environment?: string } = {},
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: "/api/v1/runtime/config",
      query: {
        environment: args.environment,
      },
      schema: resolvedConfigSchema,
      ...options,
    });
  }

  public getBoundFlag(
    args: { flagKey: string; environment?: string },
    options?: RequestOptions,
  ) {
    return this.transport.request({
      method: "GET",
      path: `/api/v1/runtime/config/${args.flagKey}`,
      query: {
        environment: args.environment,
      },
      schema: resolvedFlagSchema,
      ...options,
    });
  }

  public getClientConfig(
    args: {
      projectId?: string;
      clientKey: string;
      environment?: string;
      environmentKey?: string;
    },
    options?: RequestOptions,
  ) {
    const projectId = this.requireProjectId(args.projectId);
    const path = args.environmentKey
      ? `/api/v1/runtime/projects/${projectId}/environments/${args.environmentKey}/clients/${args.clientKey}/config`
      : `/api/v1/runtime/projects/${projectId}/clients/${args.clientKey}/config`;

    return this.transport.request({
      method: "GET",
      path,
      ...(args.environmentKey
        ? {}
        : { query: { environment: args.environment } }),
      schema: resolvedConfigSchema,
      ...options,
    });
  }

  public getClientFlag(
    args: {
      projectId?: string;
      clientKey: string;
      flagKey: string;
      environment?: string;
      environmentKey?: string;
    },
    options?: RequestOptions,
  ) {
    const projectId = this.requireProjectId(args.projectId);
    const path = args.environmentKey
      ? `/api/v1/runtime/projects/${projectId}/environments/${args.environmentKey}/clients/${args.clientKey}/config/${args.flagKey}`
      : `/api/v1/runtime/projects/${projectId}/clients/${args.clientKey}/config/${args.flagKey}`;

    return this.transport.request({
      method: "GET",
      path,
      ...(args.environmentKey
        ? {}
        : { query: { environment: args.environment } }),
      schema: resolvedFlagSchema,
      ...options,
    });
  }

  public getEnvironmentSnapshot(
    args: { projectId?: string; environmentKey: string; ifNoneMatch?: string },
    options?: SnapshotRequestOptions,
  ) {
    const projectId = this.requireProjectId(args.projectId);

    return this.transport.requestSnapshot({
      method: "GET",
      path: `/api/v1/runtime/projects/${projectId}/environments/${args.environmentKey}/snapshot`,
      ...((options?.ifNoneMatch ?? args.ifNoneMatch)
        ? { ifNoneMatch: options?.ifNoneMatch ?? args.ifNoneMatch }
        : {}),
      schema: runtimeSnapshotSchema,
      ...options,
    });
  }

  public evaluateIdentity(
    args: { projectId?: string; environmentKey: string; data: unknown },
    options?: RequestOptions,
  ) {
    const projectId = this.requireProjectId(args.projectId);

    return this.transport.request({
      method: "POST",
      path: `/api/v1/runtime/projects/${projectId}/environments/${args.environmentKey}/identities/evaluate`,
      body: evaluateIdentityRequestSchema.parse(args.data),
      schema: resolvedConfigSchema,
      ...options,
    });
  }

  public getIdentityConfig(
    args: {
      projectId?: string;
      environmentKey: string;
      kind: string;
      identifier: string;
      data?: unknown;
    },
    options?: RequestOptions,
  ) {
    const projectId = this.requireProjectId(args.projectId);

    return this.transport.request({
      method: "POST",
      path: `/api/v1/runtime/projects/${projectId}/environments/${args.environmentKey}/identities/${args.kind}/${args.identifier}/config`,
      body: getIdentityConfigRequestSchema.parse(args.data),
      schema: resolvedConfigSchema,
      ...options,
    });
  }

  public getIdentityFlag(
    args: {
      projectId?: string;
      environmentKey: string;
      kind: string;
      identifier: string;
      flagKey: string;
      data?: unknown;
    },
    options?: RequestOptions,
  ) {
    const projectId = this.requireProjectId(args.projectId);

    return this.transport.request({
      method: "POST",
      path: `/api/v1/runtime/projects/${projectId}/environments/${args.environmentKey}/identities/${args.kind}/${args.identifier}/config/${args.flagKey}`,
      body: getIdentityFlagRequestSchema.parse(args.data),
      schema: resolvedFlagSchema,
      ...options,
    });
  }

  public batchEvaluationEvents(
    args: { projectId?: string; data: unknown },
    options?: RequestOptions,
  ) {
    const projectId = this.requireProjectId(args.projectId);

    return this.transport.request({
      method: "POST",
      path: `/api/v1/runtime/projects/${projectId}/evaluation-events:batch`,
      body: evaluationEventBatchRequestSchema.parse(args.data),
      schema: evaluationEventBatchAcceptedSchema,
      ...options,
    });
  }

  private requireProjectId(projectId?: string) {
    const resolved = projectId ?? this.defaultProjectId;
    if (!resolved) {
      throw new Error(
        "This operation requires a projectId. Pass one explicitly or configure a default projectId on FlagifyClient.",
      );
    }

    return resolved;
  }
}
