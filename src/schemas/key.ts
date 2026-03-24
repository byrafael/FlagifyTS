import { z } from "zod";
import {
  dateTimeStringSchema,
  nullableStringSchema,
  paginatedResponseSchema,
} from "./common";

const apiKeyKindSchema = z.enum([
  "project_admin",
  "project_read",
  "client_runtime",
]);
const scopeSchema = z.string();

export const apiKeySchema = z.object({
  id: z.string(),
  project_id: z.string().nullable().optional(),
  client_id: z.string().nullable().optional(),
  name: z.string(),
  prefix: z.string(),
  kind: z.string(),
  scopes: z.array(scopeSchema),
  last_used_at: nullableStringSchema.optional(),
  expires_at: nullableStringSchema.optional(),
  revoked_at: nullableStringSchema.optional(),
  created_at: dateTimeStringSchema,
});

export const keyListResponseSchema = paginatedResponseSchema(apiKeySchema);

export const createdKeySchema = apiKeySchema.extend({
  secret: z.string(),
});

export const projectAdminKeyRequestSchema = z.object({
  kind: z.literal(apiKeyKindSchema.enum.project_admin),
  projectId: z.string(),
  name: z.string(),
  scopes: z.array(scopeSchema).optional(),
  expiresAt: nullableStringSchema.optional(),
});

export const projectReadKeyRequestSchema = z.object({
  kind: z.literal(apiKeyKindSchema.enum.project_read),
  projectId: z.string(),
  name: z.string(),
  scopes: z.array(scopeSchema).optional(),
  expiresAt: nullableStringSchema.optional(),
});

export const clientRuntimeKeyRequestSchema = z.object({
  kind: z.literal(apiKeyKindSchema.enum.client_runtime),
  projectId: z.string(),
  clientId: z.string(),
  name: z.string(),
  scopes: z.array(scopeSchema).optional(),
  expiresAt: nullableStringSchema.optional(),
});

export const createKeyRequestSchema = z.discriminatedUnion("kind", [
  projectAdminKeyRequestSchema,
  projectReadKeyRequestSchema,
  clientRuntimeKeyRequestSchema,
]);
