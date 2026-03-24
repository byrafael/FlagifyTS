import { z } from "zod";
import {
  conditionSchema,
  dateTimeStringSchema,
  emptyArrayToRecordSchema,
  jsonValueSchema,
  nullableStringSchema,
  prerequisiteSchema,
  targetRuleSchema,
  variantSchema,
} from "./common";

export const resolvedFlagValueSchema = z.object({
  value: jsonValueSchema,
  variant_key: nullableStringSchema.optional(),
  payload: z.record(z.string(), jsonValueSchema).nullable().optional(),
  reason: z.string(),
  matched_rule: nullableStringSchema.optional(),
  stale_status: z.enum(["active", "stale"]),
});

export const resolvedFlagSchema = resolvedFlagValueSchema.extend({
  key: z.string(),
});

export const resolvedConfigSchema = z.object({
  project: z.object({
    id: z.string(),
    slug: z.string().nullable().optional(),
  }),
  client: z
    .object({
      id: z.string(),
      key: z.string(),
    })
    .optional(),
  environment: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }),
  flags: emptyArrayToRecordSchema(resolvedFlagValueSchema),
  meta: z
    .object({
      resolved_at: dateTimeStringSchema,
    })
    .passthrough(),
});

export const runtimeSnapshotSchema = z.object({
  project_id: z.string().optional(),
  project: z
    .object({
      id: z.string(),
      slug: z.string().nullable().optional(),
    })
    .optional(),
  environment: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }),
  segments: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      rules: z.array(conditionSchema),
    }),
  ),
  flags: z.array(
    z.object({
      key: z.string(),
      type: z.string(),
      flag_kind: z.string(),
      default_value: jsonValueSchema,
      default_variant_key: nullableStringSchema.optional(),
      options: z.array(z.string()).nullable().optional(),
      variants: z.array(variantSchema).nullable().optional(),
      prerequisites: z.array(prerequisiteSchema).nullable().optional(),
      rules: z.array(targetRuleSchema),
      stale_status: z.string(),
    }),
  ),
  meta: z
    .object({
      generated_at: dateTimeStringSchema.optional(),
      mode: z.string().optional(),
    })
    .passthrough(),
  schema_version: z.string().optional(),
});

export const evaluateIdentityRequestSchema = z.object({
  kind: z.string(),
  identifier: z.string(),
  flag_keys: z.array(z.string()).optional(),
  transient_traits: z.record(z.string(), jsonValueSchema).optional(),
});

export const getIdentityConfigRequestSchema = z
  .object({
    flag_keys: z.array(z.string()).optional(),
    transient_traits: z.record(z.string(), jsonValueSchema).optional(),
  })
  .optional();

export const getIdentityFlagRequestSchema = z
  .object({
    transient_traits: z.record(z.string(), jsonValueSchema).optional(),
  })
  .optional();

export const evaluationEventItemSchema = z.object({
  flag_key: z.string(),
  client_key: nullableStringSchema.optional(),
  identity_kind: nullableStringSchema.optional(),
  identity_identifier: nullableStringSchema.optional(),
  variant_key: nullableStringSchema.optional(),
  value: jsonValueSchema.optional(),
  reason: nullableStringSchema.optional(),
  matched_rule: nullableStringSchema.optional(),
  traits: z.record(z.string(), jsonValueSchema).nullable().optional(),
  transient_traits: z.record(z.string(), jsonValueSchema).nullable().optional(),
  occurred_at: nullableStringSchema.optional(),
});

export const evaluationEventBatchRequestSchema = z.object({
  environment_key: z.string(),
  batch_id: nullableStringSchema.optional(),
  snapshot_checksum: nullableStringSchema.optional(),
  events: z.array(evaluationEventItemSchema),
});

export const evaluationEventBatchAcceptedSchema = z.object({
  accepted: z.number(),
  batch_id: nullableStringSchema.optional(),
});
