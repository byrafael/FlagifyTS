import { z } from "zod";

export const jsonValueSchema: z.ZodType<import("../types/api").JsonValue> =
  z.lazy(() =>
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.null(),
      z.array(jsonValueSchema),
      z.record(z.string(), jsonValueSchema),
    ]),
  );

export const dateTimeStringSchema = z.string();

export const numericLikeSchema = z.coerce.number();

export const paginationMetaSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    items: z.array(itemSchema),
    meta: paginationMetaSchema,
  });

export const nullableStringSchema = z.string().nullable();

export const stringRecordSchema = z.record(z.string(), jsonValueSchema);

export const emptyArrayToRecordSchema = <T extends z.ZodTypeAny>(
  valueSchema: T,
) =>
  z
    .union([z.record(z.string(), valueSchema), z.tuple([])])
    .transform((value) =>
      Array.isArray(value) ? ({} as Record<string, z.infer<T>>) : value,
    );

export const passthroughObjectSchema = z.record(z.string(), z.unknown());

export const conditionSchema = z.object({
  attribute: z.string(),
  operator: z.string(),
  value: jsonValueSchema.optional(),
  values: z.array(jsonValueSchema).optional(),
});

export const variantSchema = z.object({
  key: z.string(),
  name: z.string(),
  value: jsonValueSchema,
  payload: z.record(z.string(), jsonValueSchema).nullable().optional(),
});

export const prerequisiteSchema = z.object({
  flag_key: z.string(),
  expected_variant_key: nullableStringSchema.optional(),
  expected_value: jsonValueSchema.optional(),
});

export const targetRuleSchema = z.object({
  name: z.string(),
  conditions: z.array(conditionSchema),
  segment_keys: z.array(z.string()),
  percentage: z.number().optional(),
  bucketing_key: z.string(),
  schedule: z
    .object({
      start_at: nullableStringSchema.optional(),
      end_at: nullableStringSchema.optional(),
    })
    .nullable()
    .optional(),
  serve: z.object({
    value: jsonValueSchema.optional(),
    variant_key: nullableStringSchema.optional(),
  }),
});
