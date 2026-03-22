import type { UserRole } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            /** Set by `requireAuth` after a valid Bearer JWT. */
            user?: {
                id: string;
                email: string;
                role: UserRole;
            };
        }
    }
}

export {};
