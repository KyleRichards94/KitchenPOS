import type { UUID } from "crypto";

export type Tag = {
    name: string;
    id: string | UUID;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    tagTypeId: string;
}