import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { asyncHandler, paramString } from "../lib/express-utils.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { prisma } from "../prisma.js";
import { UserRole } from "@prisma/client";

export const usersRouter = Router();

const SALT_ROUNDS = 12;

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(1),
    role: z.nativeEnum(UserRole).optional(),
});

const UpdateUserSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().min(1).optional(),
    role: z.nativeEnum(UserRole).optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Never return passwordHash to the client
const sanitiseUser = (user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    passwordHash: string;
}) => {
    const { passwordHash: _omit, ...safe } = user;
    return safe;
};

// ---------------------------------------------------------------------------
// POST /users — public (registration / bootstrap)
// ---------------------------------------------------------------------------

usersRouter.post(
    "/",
    asyncHandler(async (req, res) => {
        const parsed = CreateUserSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        const { email, password, name, role } = parsed.data;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ error: "A user with that email already exists" });
            return;
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                ...(role !== undefined ? { role } : {}),
            },
        });

        res.status(201).json(sanitiseUser(user));
    }),
);

// ---------------------------------------------------------------------------
// GET /users
// ---------------------------------------------------------------------------

usersRouter.use(requireAuth).get(
    "/",
    asyncHandler(async (_req, res) => {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(users.map(sanitiseUser));
    }),
);

// ---------------------------------------------------------------------------
// GET /users/:id
// ---------------------------------------------------------------------------

usersRouter.use(requireAuth).get(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.json(sanitiseUser(user));
    }),
);

// ---------------------------------------------------------------------------
// PUT /users/:id
// ---------------------------------------------------------------------------

usersRouter.use(requireAuth).put(
    "/:id",
    asyncHandler(async (req, res) => {
        const parsed = UpdateUserSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        const { password, ...rest } = parsed.data;

        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const existing = await prisma.user.findUnique({
            where: { id },
        });

        if (!existing) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Check email uniqueness if it's being changed
        if (rest.email && rest.email !== existing.email) {
            const emailTaken = await prisma.user.findUnique({
                where: { email: rest.email },
            });
            if (emailTaken) {
                res.status(409).json({ error: "That email is already in use" });
                return;
            }
        }

        const updateData: Record<string, unknown> = { ...rest };
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        res.json(sanitiseUser(user));
    })
);

// ---------------------------------------------------------------------------
// DELETE /users/:id
// ---------------------------------------------------------------------------

usersRouter.use(requireAuth).delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const id = paramString(req, "id");
        if (!id) {
            res.status(400).json({ error: "Invalid id" });
            return;
        }

        const existing = await prisma.user.findUnique({
            where: { id },
        });

        if (!existing) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await prisma.user.delete({ where: { id } });

        res.status(204).send();
    })
);