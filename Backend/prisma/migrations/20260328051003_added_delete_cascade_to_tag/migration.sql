-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "tagTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tags_tagTypeId_fkey" FOREIGN KEY ("tagTypeId") REFERENCES "tag_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tags" ("color", "createdAt", "id", "name", "tagTypeId", "updatedAt") SELECT "color", "createdAt", "id", "name", "tagTypeId", "updatedAt" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE UNIQUE INDEX "tags_tagTypeId_name_key" ON "tags"("tagTypeId", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
