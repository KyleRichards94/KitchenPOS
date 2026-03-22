import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt.js";

/** Requires `Authorization: Bearer <jwt>`. Sets `req.user` on success. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
        res.status(401).json({ error: "Missing Authorization header" });
        return;
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        next();
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
