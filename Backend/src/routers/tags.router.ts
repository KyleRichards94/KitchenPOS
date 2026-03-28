import { Router } from "express";
import { asyncHandler, paramString } from "../lib/express-utils.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { prisma } from "../prisma.js";
import {
    CreateTagTypeSchema,
    UpdateTagTypeSchema,
    CreateTagSchema,
    UpdateTagSchema,
} from "../domainSchemas/tags.schema.js";

export const tagTypesRouter = Router();
export const tagsRouter = Router();

// =============================================================================
// TAG TYPES
// =============================================================================

// Create TagType
tagTypesRouter.use(requireAuth).post(
    "/",
    asyncHandler(async (req, res) => {
        const parsed = CreateTagTypeSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        const { name } = parsed.data;

        const existing = await prisma.tagType.findUnique({ where: { name } });
        if (existing) {
            res.status(409).json({ error: "A tag type with that name already exists" });
            return;
        }

        const tagType = await prisma.tagType.create({
            data: { name, color: parsed.data.color ?? null },
        });

        res.status(201).json(tagType);
    }),
);

// Get TagTypes
tagTypesRouter.use(requireAuth).get(
    "/",
    asyncHandler(async (_req, res) => {
        const tagTypes = await prisma.tagType.findMany({
            orderBy: { createdAt: "desc" },
            include: { tags: true },
        });

        res.json(tagTypes);
    }),
);

// Get TagType / Param {id}
tagTypesRouter.use(requireAuth).get(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const tagType = await prisma.tagType.findUnique({
            where: { id },
            include: { tags: true },
        });

        if (!tagType) {
            res.status(404).json({ error: "Tag type not found" });
            return;
        }

        res.json(tagType);
    }),
);

// Update TagType / Param {id}
tagTypesRouter.use(requireAuth).put(
    "/:id",
    asyncHandler(async (req, res) => {
        const parsed = UpdateTagTypeSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const existing = await prisma.tagType.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Tag type not found" });
            return;
        }

        // Check name uniqueness if it's being changed
        if (parsed.data.name && parsed.data.name !== existing.name) {
            const nameTaken = await prisma.tagType.findUnique({
                where: { name: parsed.data.name },
            });
            if (nameTaken) {
                res.status(409).json({ error: "A tag type with that name already exists" });
                return;
            }
        }

        const tagType = await prisma.tagType.update({
            where: { id },
            data: { name: parsed.data.name ?? "", color: parsed.data.color ?? null },
        });

        res.json(tagType);
    }),
);

// Delete TagType / Param {id}
tagTypesRouter.use(requireAuth).delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const existing = await prisma.tagType.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Tag type not found" });
            return;
        }

        await prisma.tagType.delete({ where: { id } });

        res.status(204).send();
    }),
);

// =============================================================================
// TAGS
// =============================================================================

// Create Tag
tagsRouter.use(requireAuth).post(
    "/",
    asyncHandler(async (req, res) => {
        const parsed = CreateTagSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        const { name, tagTypeId } = parsed.data;

        const tagType = await prisma.tagType.findUnique({ where: { id: tagTypeId } });
        if (!tagType) {
            res.status(404).json({ error: "Tag type not found" });
            return;
        }

        const existing = await prisma.tag.findUnique({
            where: { tagTypeId_name: { tagTypeId, name } },
        });
        if (existing) {
            res.status(409).json({ error: "A tag with that name already exists in this type" });
            return;
        }

        const tag = await prisma.tag.create({
            data: { name, color: parsed.data.color ?? null, tagTypeId },
            include: { tagType: true },
        });

        res.status(201).json(tag);
    }),
);

// Get Tags
tagsRouter.use(requireAuth).get(
    "/",
    asyncHandler(async (_req, res) => {
        const tags = await prisma.tag.findMany({
            orderBy: { createdAt: "desc" },
            include: { tagType: true },
        });

        res.json(tags);
    }),
);

// Get Tag / Param {id}
tagsRouter.use(requireAuth).get(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const tag = await prisma.tag.findUnique({
            where: { id },
            include: { tagType: true },
        });

        if (!tag) {
            res.status(404).json({ error: "Tag not found" });
            return;
        }

        res.json(tag);
    }),
);

// Update Tag / Param {id}
tagsRouter.use(requireAuth).put(
    "/:id",
    asyncHandler(async (req, res) => {
        const parsed = UpdateTagSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const existing = await prisma.tag.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Tag not found" });
            return;
        }

        const { name, tagTypeId, ...rest } = parsed.data;

        // Resolve the tagTypeId and name we'll end up with after the update
        const resolvedTagTypeId = tagTypeId ?? existing.tagTypeId;
        const resolvedName = name ?? existing.name;

        // If either the name or the type is changing, check the composite unique constraint
        if (name !== undefined || tagTypeId !== undefined) {
            if (tagTypeId) {
                const tagType = await prisma.tagType.findUnique({ where: { id: tagTypeId } });
                if (!tagType) {
                    res.status(404).json({ error: "Tag type not found" });
                    return;
                }
            }

            const conflict = await prisma.tag.findUnique({
                where: { tagTypeId_name: { tagTypeId: resolvedTagTypeId, name: resolvedName } },
            });
            if (conflict && conflict.id !== id) {
                res.status(409).json({ error: "A tag with that name already exists in this type" });
                return;
            }
        }

        const tag = await prisma.tag.update({
            where: { id },
            data: { name: parsed.data.name ?? "", tagTypeId: parsed.data.tagTypeId ?? "", color: parsed.data.color ?? null },
            include: { tagType: true },
        });

        res.json(tag);
    }),
);

// Delete Tag / Param {id}
tagsRouter.use(requireAuth).delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const existing = await prisma.tag.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Tag not found" });
            return;
        }

        await prisma.tag.delete({ where: { id } });

        res.status(204).send();
    }),
);