import { z } from "zod";
import {
  dateTimeStringSchema,
  jsonValueSchema,
  nullableStringSchema,
  numericLikeSchema,
  paginatedResponseSchema,
  paginationMetaSchema,
  prerequisiteSchema,
  targetRuleSchema,
  variantSchema,
} from "./common";
import { environmentSchema } from "./environment";
import { flagSchema } from "./flag";
import { projectSchema } from "./project";
import { segmentSchema } from "./segment";

export const changeRequestSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  environment_id: z.string(),
  resource_type: z.string(),
  resource_id: z.string(),
  status: z.enum(["pending", "approved", "rejected", "applied"]),
  title: z.string(),
  description: nullableStringSchema.optional(),
  proposed_by_principal_id: nullableStringSchema.optional(),
  reviewed_by_principal_id: nullableStringSchema.optional(),
  applied_by_principal_id: nullableStringSchema.optional(),
  proposed_payload: z.record(z.string(), jsonValueSchema),
  approved_payload: z.record(z.string(), jsonValueSchema).nullable().optional(),
  base_snapshot_checksum: nullableStringSchema.optional(),
  applied_at: nullableStringSchema.optional(),
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
});

export const changeRequestListResponseSchema =
  paginatedResponseSchema(changeRequestSchema);

export const createChangeRequestRequestSchema = z.object({
  flag_id: z.string(),
  environment_key: z.string(),
  title: z.string(),
  description: nullableStringSchema.optional(),
  base_snapshot_checksum: nullableStringSchema.optional(),
  desired_config: z.object({
    default_value: jsonValueSchema.optional(),
    default_variant_key: nullableStringSchema.optional(),
    rules: z.array(targetRuleSchema).optional(),
  }),
});

export const reviewChangeRequestRequestSchema = z.object({
  decision: z.enum(["approve", "reject"]),
});

export const codeReferenceSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  flag_id: z.string(),
  source_type: z.string(),
  source_name: nullableStringSchema.optional(),
  reference_path: z.string(),
  reference_line: numericLikeSchema.nullable().optional(),
  reference_context: nullableStringSchema.optional(),
  observed_at: dateTimeStringSchema,
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
});

export const codeReferenceListResponseSchema = z.object({
  items: z.array(codeReferenceSchema),
  meta: paginationMetaSchema.optional(),
});

export const createCodeReferenceItemSchema = z.object({
  flag_key: z.string(),
  source_type: z.string(),
  source_name: nullableStringSchema.optional(),
  reference_path: z.string(),
  reference_line: z.number().int().nullable().optional(),
  reference_context: nullableStringSchema.optional(),
  observed_at: nullableStringSchema.optional(),
});

export const createCodeReferencesRequestSchema = z.object({
  references: z.array(createCodeReferenceItemSchema),
});

export const projectExportSchema = z.object({
  export_version: z.string().optional(),
  project: projectSchema.optional(),
  environments: z.array(environmentSchema).optional(),
  flags: z.array(flagSchema).optional(),
  segments: z.array(segmentSchema).optional(),
  flag_environment_configs: z
    .array(
      z.object({
        flag_key: z.string(),
        environment_key: z.string(),
        default_value: jsonValueSchema.optional(),
        default_variant_key: nullableStringSchema.optional(),
        rules: z.array(targetRuleSchema),
      }),
    )
    .optional(),
  prerequisites: z
    .array(
      z.object({
        flag_key: z.string(),
        prerequisites: z.array(prerequisiteSchema),
      }),
    )
    .optional(),
  variants: z
    .array(
      z.object({
        flag_key: z.string(),
        variants: z.array(variantSchema),
      }),
    )
    .optional(),
});

export const projectImportRequestSchema = z.object({
  environments: z.array(environmentSchema.partial()).optional(),
  segments: z.array(segmentSchema.partial()).optional(),
  flags: z.array(flagSchema.partial()).optional(),
  flag_environment_configs: z
    .array(
      z.object({
        flag_key: z.string(),
        environment_key: z.string(),
        default_value: jsonValueSchema.optional(),
        default_variant_key: nullableStringSchema.optional(),
        rules: z.array(targetRuleSchema),
      }),
    )
    .optional(),
});

export const projectImportResponseSchema = z.object({
  dry_run: z.boolean().optional(),
  plan: z.record(z.string(), z.unknown()).optional(),
});
