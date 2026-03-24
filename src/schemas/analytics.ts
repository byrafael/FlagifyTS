import { z } from "zod";
import {
  dateTimeStringSchema,
  emptyArrayToRecordSchema,
  jsonValueSchema,
  nullableStringSchema,
  paginatedResponseSchema,
} from "./common";

export const evaluationEventSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  environment_id: z.string(),
  flag_id: z.string(),
  client_id: nullableStringSchema.optional(),
  variant_key: nullableStringSchema.optional(),
  value: jsonValueSchema,
  reason: z.string(),
  matched_rule: nullableStringSchema.optional(),
  context: emptyArrayToRecordSchema(jsonValueSchema),
  created_at: dateTimeStringSchema,
});

export const evaluationEventListResponseSchema = paginatedResponseSchema(
  evaluationEventSchema,
);

export const auditLogSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  environment_id: nullableStringSchema.optional(),
  resource_type: z.string(),
  resource_id: z.string(),
  resource_key: nullableStringSchema.optional(),
  action: z.string(),
  actor_type: z.string(),
  actor_id: nullableStringSchema.optional(),
  actor_name: nullableStringSchema.optional(),
  request_id: nullableStringSchema.optional(),
  before_payload: jsonValueSchema.nullable().optional(),
  after_payload: jsonValueSchema.nullable().optional(),
  metadata: emptyArrayToRecordSchema(jsonValueSchema),
  created_at: dateTimeStringSchema,
});

export const auditLogListResponseSchema =
  paginatedResponseSchema(auditLogSchema);

export const analyticsItemSchema = z.record(z.string(), z.unknown());

export const analyticsListResponseSchema = z.object({
  items: z.array(analyticsItemSchema),
});
