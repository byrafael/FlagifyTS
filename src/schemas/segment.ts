import { z } from "zod";
import {
  conditionSchema,
  dateTimeStringSchema,
  nullableStringSchema,
  paginatedResponseSchema,
} from "./common";

export const segmentSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  key: z.string(),
  name: z.string(),
  description: nullableStringSchema.optional(),
  rules: z.array(conditionSchema),
  status: z.enum(["active", "deleted"]),
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
  deleted_at: nullableStringSchema.optional(),
});

export const segmentListResponseSchema = paginatedResponseSchema(segmentSchema);

export const createSegmentRequestSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: nullableStringSchema.optional(),
  rules: z.array(conditionSchema),
});

export const updateSegmentRequestSchema = z
  .object({
    key: z.string().optional(),
    name: z.string().optional(),
    description: nullableStringSchema.optional(),
    rules: z.array(conditionSchema).optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one segment field must be provided.",
  );
