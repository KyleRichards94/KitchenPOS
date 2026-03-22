import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";

export interface AccessTokenPayload {
    sub: string;
    email: string;
    role: UserRole;
}

function getSecret(): string {
    const s = process.env.JWT_SECRET;
    if (!s?.trim()) {
        throw new Error("JWT_SECRET is not set");
    }
    return s;
}

export function signAccessToken(payload: {
    userId: string;
    email: string;
    role: UserRole;
}): string {
    return jwt.sign(
        { sub: payload.userId, email: payload.email, role: payload.role },
        getSecret(),
        { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" },
    );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "string" || !decoded || typeof decoded !== "object") {
        throw new Error("Invalid token");
    }
    const d = decoded as jwt.JwtPayload & Record<string, unknown>;
    if (
        typeof d.sub !== "string" ||
        typeof d.email !== "string" ||
        (d.role !== "ADMIN" && d.role !== "STAFF")
    ) {
        throw new Error("Invalid token payload");
    }
    return {
        sub: d.sub,
        email: d.email,
        role: d.role as UserRole,
    };
}
