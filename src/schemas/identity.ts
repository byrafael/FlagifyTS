import { z } from "zod";
import {
  dateTimeStringSchema,
  emptyArrayToRecordSchema,
  jsonValueSchema,
  nullableStringSchema,
  paginatedResponseSchema,
  passthroughObjectSchema,
} from "./common";

export const identitySchema = z.object({
  id: z.string(),
  project_id: z.string(),
  kind: z.string(),
  identifier: z.string(),
  display_name: nullableStringSchema.optional(),
  description: nullableStringSchema.optional(),
  status: z.enum(["active", "disabled", "deleted"]),
  client_id: nullableStringSchema.optional(),
  traits: emptyArrayToRecordSchema(jsonValueSchema),
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
  deleted_at: nullableStringSchema.optional(),
});

export const identityListResponseSchema =
  paginatedResponseSchema(identitySchema);

export const createIdentityRequestSchema = z.object({
  kind: z.string(),
  identifier: z.string(),
  display_name: nullableStringSchema.optional(),
  description: nullableStringSchema.optional(),
  traits: z.record(z.string(), jsonValueSchema).optional(),
});

export const updateIdentityRequestSchema = z
  .object({
    kind: z.string().optional(),
    identifier: z.string().optional(),
    display_name: nullableStringSchema.optional(),
    description: nullableStringSchema.optional(),
    status: z.enum(["active", "disabled", "deleted"]).optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one identity field must be provided.",
  );

export const identityTraitMapResponseSchema = z.object({
  identity_id: z.string(),
  traits: emptyArrayToRecordSchema(jsonValueSchema),
});

export const identityTraitUpsertResponseSchema = z.object({
  identity_id: z.string(),
  identity: z.object({
    id: z.string(),
    kind: z.string(),
    identifier: z.string(),
  }),
  trait: passthroughObjectSchema,
});

export const identityTraitsPatchRequestSchema = z
  .object({
    set: z.record(z.string(), jsonValueSchema).optional(),
    unset: z.array(z.string()).optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one trait mutation must be provided.",
  );

export const identityTraitPutRequestSchema = z.object({
  value: jsonValueSchema,
});
