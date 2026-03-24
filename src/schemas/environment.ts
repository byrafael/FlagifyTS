import { z } from "zod";
import {
  dateTimeStringSchema,
  nullableStringSchema,
  numericLikeSchema,
  paginatedResponseSchema,
} from "./common";

export const environmentSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  key: z.string(),
  name: z.string(),
  description: nullableStringSchema.optional(),
  is_default: numericLikeSchema,
  requires_change_requests: numericLikeSchema,
  sort_order: numericLikeSchema,
  status: z.enum(["active", "deleted"]),
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
  deleted_at: nullableStringSchema.optional(),
});

export const environmentListResponseSchema =
  paginatedResponseSchema(environmentSchema);

export const createEnvironmentRequestSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: nullableStringSchema.optional(),
  is_default: z.boolean().optional(),
  requires_change_requests: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export const updateEnvironmentRequestSchema = z
  .object({
    key: z.string().optional(),
    name: z.string().optional(),
    description: nullableStringSchema.optional(),
    is_default: z.boolean().optional(),
    requires_change_requests: z.boolean().optional(),
    sort_order: z.number().int().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one environment field must be provided.",
  );
