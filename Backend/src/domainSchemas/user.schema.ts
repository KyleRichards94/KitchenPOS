import { z } from "zod";
import { UserRole } from "@prisma/client";

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(1),
    role: z.nativeEnum(UserRole).optional(),
});

export const UpdateUserSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().min(1).optional(),
    role: z.nativeEnum(UserRole).optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Never return passwordHash to the client
export const sanitiseUser = (user: {
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
