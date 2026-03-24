import { z } from "zod";
import {
  dateTimeStringSchema,
  jsonValueSchema,
  nullableStringSchema,
  paginatedResponseSchema,
  prerequisiteSchema,
  targetRuleSchema,
  variantSchema,
} from "./common";
import { environmentSchema } from "./environment";

export const flagSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  key: z.string(),
  name: z.string(),
  description: nullableStringSchema.optional(),
  flag_kind: z.enum(["release", "experiment", "ops", "permission"]),
  type: z.enum(["boolean", "select", "multi_select"]),
  default_value: jsonValueSchema,
  options: z.array(z.string()).nullable().optional(),
  variants: z.array(variantSchema).nullable().optional(),
  default_variant_key: nullableStringSchema.optional(),
  prerequisites: z.array(prerequisiteSchema).nullable().optional(),
  status: z.enum(["active", "archived"]),
  expires_at: nullableStringSchema.optional(),
  last_evaluated_at: nullableStringSchema.optional(),
  stale_status: z.enum(["active", "stale"]),
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
});

export const flagListResponseSchema = paginatedResponseSchema(flagSchema);

export const flagEnvironmentConfigSchema = z.object({
  id: nullableStringSchema.optional(),
  flag_id: z.string(),
  environment_id: z.string(),
  default_value: jsonValueSchema.optional(),
  default_variant_key: nullableStringSchema.optional(),
  rules: z.array(targetRuleSchema),
  environment: environmentSchema.optional(),
  created_at: nullableStringSchema.optional(),
  updated_at: nullableStringSchema.optional(),
});

export const createFlagRequestSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: nullableStringSchema.optional(),
  flag_kind: z.enum(["release", "experiment", "ops", "permission"]).optional(),
  type: z.enum(["boolean", "select", "multi_select"]),
  default_value: jsonValueSchema,
  options: z.array(z.string()).nullable().optional(),
  variants: z.array(variantSchema).nullable().optional(),
  default_variant_key: nullableStringSchema.optional(),
  prerequisites: z.array(prerequisiteSchema).nullable().optional(),
  expires_at: nullableStringSchema.optional(),
});

export const updateFlagRequestSchema = z
  .object({
    key: z.string().optional(),
    name: z.string().optional(),
    description: nullableStringSchema.optional(),
    flag_kind: z
      .enum(["release", "experiment", "ops", "permission"])
      .optional(),
    default_value: jsonValueSchema.optional(),
    options: z.array(z.string()).nullable().optional(),
    variants: z.array(variantSchema).nullable().optional(),
    default_variant_key: nullableStringSchema.optional(),
    prerequisites: z.array(prerequisiteSchema).nullable().optional(),
    expires_at: nullableStringSchema.optional(),
    status: z.enum(["active", "archived"]).optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one flag field must be provided.",
  );

export const putFlagEnvironmentConfigRequestSchema = z
  .object({
    default_value: jsonValueSchema.optional(),
    default_variant_key: nullableStringSchema.optional(),
    rules: z.array(targetRuleSchema).optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one environment config field must be provided.",
  );

export const staleFlagCandidateSchema = z.object({
  flag_id: z.string(),
  flag_key: z.string(),
  stale_status: z.enum(["active", "stale"]),
  last_evaluated_at: nullableStringSchema.optional(),
  code_reference_count: z.number(),
  latest_code_reference_observed_at: nullableStringSchema.optional(),
  likely_stale_reason: nullableStringSchema.optional(),
});

export const staleFlagReportResponseSchema = paginatedResponseSchema(
  staleFlagCandidateSchema,
);
