import { z } from "zod";
import {
  dateTimeStringSchema,
  emptyArrayToRecordSchema,
  jsonValueSchema,
  nullableStringSchema,
  paginatedResponseSchema,
} from "./common";

export const clientSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  key: z.string(),
  name: z.string(),
  description: nullableStringSchema.optional(),
  status: z.enum(["active", "disabled", "deleted"]),
  metadata: emptyArrayToRecordSchema(jsonValueSchema),
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
  deleted_at: nullableStringSchema.optional(),
});

export const clientListResponseSchema = paginatedResponseSchema(clientSchema);

export const createClientRequestSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: nullableStringSchema.optional(),
  metadata: z.record(z.string(), jsonValueSchema).optional(),
});

export const updateClientRequestSchema = z
  .object({
    key: z.string().optional(),
    name: z.string().optional(),
    description: nullableStringSchema.optional(),
    status: z.enum(["active", "disabled", "deleted"]).optional(),
    metadata: z.record(z.string(), jsonValueSchema).optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one client field must be provided.",
  );

export const overrideSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  flag_id: z.string(),
  client_id: z.string(),
  value: jsonValueSchema,
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
});

export const overrideListResponseSchema = z.object({
  items: z.array(overrideSchema),
});

export const putOverrideRequestSchema = z.object({
  value: jsonValueSchema,
});
