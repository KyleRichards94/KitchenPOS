import { z } from "zod";

export const CreateTagTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code").optional(),
});

export const UpdateTagTypeSchema = z.object({
    name: z.string().min(1).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code").optional(),
});

export const CreateTagSchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code").optional(),
    tagTypeId: z.string().uuid("Invalid TagType ID"),
});

export const UpdateTagSchema = z.object({
    name: z.string().min(1).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code").optional(),
    tagTypeId: z.string().uuid("Invalid TagType ID").optional(),
});
