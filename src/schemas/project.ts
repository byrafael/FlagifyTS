import { z } from "zod";
import {
  dateTimeStringSchema,
  nullableStringSchema,
  paginatedResponseSchema,
} from "./common";

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: nullableStringSchema.optional(),
  status: z.enum(["active", "deleted"]),
  created_at: dateTimeStringSchema,
  updated_at: dateTimeStringSchema,
  deleted_at: nullableStringSchema.optional(),
});

export const projectListResponseSchema = paginatedResponseSchema(projectSchema);

export const createProjectRequestSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: nullableStringSchema.optional(),
});

export const updateProjectRequestSchema = z
  .object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: nullableStringSchema.optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one project field must be provided.",
  );
