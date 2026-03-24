export { FlagifyClient } from "./client/flagify-client";
export { ProjectClient } from "./client/project-client";
export { FlagifyError } from "./errors/flagify-error";
export {
  analyticsItemSchema,
  analyticsListResponseSchema,
  auditLogListResponseSchema,
  auditLogSchema,
  evaluationEventListResponseSchema,
  evaluationEventSchema,
} from "./schemas/analytics";
export {
  clientListResponseSchema,
  clientSchema,
  createClientRequestSchema,
  overrideListResponseSchema,
  overrideSchema,
  putOverrideRequestSchema,
  updateClientRequestSchema,
} from "./schemas/client";
export {
  conditionSchema,
  jsonValueSchema,
  paginationMetaSchema,
  prerequisiteSchema,
  targetRuleSchema,
  variantSchema,
} from "./schemas/common";
export {
  createEnvironmentRequestSchema,
  environmentListResponseSchema,
  environmentSchema,
  updateEnvironmentRequestSchema,
} from "./schemas/environment";
export {
  createFlagRequestSchema,
  flagEnvironmentConfigSchema,
  flagListResponseSchema,
  flagSchema,
  putFlagEnvironmentConfigRequestSchema,
  staleFlagCandidateSchema,
  staleFlagReportResponseSchema,
  updateFlagRequestSchema,
} from "./schemas/flag";
export {
  createIdentityRequestSchema,
  identityListResponseSchema,
  identitySchema,
  identityTraitMapResponseSchema,
  identityTraitsPatchRequestSchema,
  identityTraitUpsertResponseSchema,
  updateIdentityRequestSchema,
} from "./schemas/identity";
export {
  apiKeySchema,
  clientRuntimeKeyRequestSchema,
  createdKeySchema,
  createKeyRequestSchema,
  keyListResponseSchema,
  projectAdminKeyRequestSchema,
  projectReadKeyRequestSchema,
} from "./schemas/key";
export {
  changeRequestListResponseSchema,
  changeRequestSchema,
  codeReferenceListResponseSchema,
  codeReferenceSchema,
  createChangeRequestRequestSchema,
  createCodeReferenceItemSchema,
  createCodeReferencesRequestSchema,
  projectExportSchema,
  projectImportRequestSchema,
  projectImportResponseSchema,
  reviewChangeRequestRequestSchema,
} from "./schemas/operations";
export {
  createProjectRequestSchema,
  projectListResponseSchema,
  projectSchema,
  updateProjectRequestSchema,
} from "./schemas/project";
export {
  evaluateIdentityRequestSchema,
  evaluationEventBatchAcceptedSchema,
  evaluationEventBatchRequestSchema,
  evaluationEventItemSchema,
  resolvedConfigSchema,
  resolvedFlagSchema,
  resolvedFlagValueSchema,
  runtimeSnapshotSchema,
} from "./schemas/runtime";
export {
  createSegmentRequestSchema,
  segmentListResponseSchema,
  segmentSchema,
  updateSegmentRequestSchema,
} from "./schemas/segment";
export type {
  JsonPrimitive,
  JsonValue,
  Nullable,
  PaginatedResponse,
  PaginationMeta,
  QueryParams,
  QueryValue,
  RequestOptions,
  SnapshotRequestOptions,
  SnapshotResponse,
} from "./types/api";
export type {
  ApiKeyKind,
  AuthContext,
  FlagifyClientOptions,
  FlagifyScope,
} from "./types/auth";
export type { FlagifyErrorData } from "./types/errors";

export type Project = import("zod").infer<
  typeof import("./schemas/project").projectSchema
>;
export type Environment = import("zod").infer<
  typeof import("./schemas/environment").environmentSchema
>;
export type Segment = import("zod").infer<
  typeof import("./schemas/segment").segmentSchema
>;
export type Condition = import("zod").infer<
  typeof import("./schemas/common").conditionSchema
>;
export type Variant = import("zod").infer<
  typeof import("./schemas/common").variantSchema
>;
export type Prerequisite = import("zod").infer<
  typeof import("./schemas/common").prerequisiteSchema
>;
export type TargetRule = import("zod").infer<
  typeof import("./schemas/common").targetRuleSchema
>;
export type Flag = import("zod").infer<
  typeof import("./schemas/flag").flagSchema
>;
export type FlagEnvironmentConfig = import("zod").infer<
  typeof import("./schemas/flag").flagEnvironmentConfigSchema
>;
export type StaleFlagCandidate = import("zod").infer<
  typeof import("./schemas/flag").staleFlagCandidateSchema
>;
export type Client = import("zod").infer<
  typeof import("./schemas/client").clientSchema
>;
export type Override = import("zod").infer<
  typeof import("./schemas/client").overrideSchema
>;
export type Identity = import("zod").infer<
  typeof import("./schemas/identity").identitySchema
>;
export type ApiKey = import("zod").infer<
  typeof import("./schemas/key").apiKeySchema
>;
export type CreatedKey = import("zod").infer<
  typeof import("./schemas/key").createdKeySchema
>;
export type ResolvedFlagValue = import("zod").infer<
  typeof import("./schemas/runtime").resolvedFlagValueSchema
>;
export type ResolvedFlag = import("zod").infer<
  typeof import("./schemas/runtime").resolvedFlagSchema
>;
export type ResolvedConfig = import("zod").infer<
  typeof import("./schemas/runtime").resolvedConfigSchema
>;
export type RuntimeSnapshot = import("zod").infer<
  typeof import("./schemas/runtime").runtimeSnapshotSchema
>;
export type EvaluationEvent = import("zod").infer<
  typeof import("./schemas/analytics").evaluationEventSchema
>;
export type AuditLog = import("zod").infer<
  typeof import("./schemas/analytics").auditLogSchema
>;
export type AnalyticsItem = import("zod").infer<
  typeof import("./schemas/analytics").analyticsItemSchema
>;
export type ChangeRequest = import("zod").infer<
  typeof import("./schemas/operations").changeRequestSchema
>;
export type CodeReference = import("zod").infer<
  typeof import("./schemas/operations").codeReferenceSchema
>;
export type ProjectExport = import("zod").infer<
  typeof import("./schemas/operations").projectExportSchema
>;
export type ProjectImportResponse = import("zod").infer<
  typeof import("./schemas/operations").projectImportResponseSchema
>;
export type EvaluationEventBatchAccepted = import("zod").infer<
  typeof import("./schemas/runtime").evaluationEventBatchAcceptedSchema
>;
