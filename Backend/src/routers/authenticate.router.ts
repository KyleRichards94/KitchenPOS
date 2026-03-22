import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../lib/express-utils.js";
import { signAccessToken } from "../lib/jwt.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { prisma } from "../prisma.js";

export const authenticateRouter = Router();

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------

authenticateRouter.post(
    "/login",
    asyncHandler(async (req, res) => {
        const parsed = LoginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const token = signAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }),
);

// ---------------------------------------------------------------------------
// GET /auth/me
// ---------------------------------------------------------------------------

authenticateRouter.use(requireAuth).get(
    "/me",
    asyncHandler(async (req, res) => {
        const u = req.user;
        if (!u) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: u.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            res.status(401).json({ error: "User no longer exists" });
            return;
        }

        res.json(user);
    }),
);
