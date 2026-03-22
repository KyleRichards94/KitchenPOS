import { Router } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler, paramString } from "../lib/express-utils.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { prisma } from "../prisma.js";
import { CreateUserSchema, sanitiseUser, UpdateUserSchema } from "../domainSchemas/user.schema.js";

export const usersRouter = Router();

const SALT_ROUNDS = 12;

// Create User
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
// Get Users 
usersRouter.use(requireAuth).get(
    "/",
    asyncHandler(async (_req, res) => {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(users.map(sanitiseUser));
    }),
);
// Get User/ Param {id}
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
// Update User/Param {id}; from body, User
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
// Delete User / id
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