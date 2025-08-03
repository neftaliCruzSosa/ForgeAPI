-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "builtIn" BOOLEAN NOT NULL DEFAULT false,
    "proyectId" INTEGER NOT NULL,
    CONSTRAINT "Entity_proyectId_fkey" FOREIGN KEY ("proyectId") REFERENCES "Proyect" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Entity" ("builtIn", "id", "name", "proyectId") SELECT "builtIn", "id", "name", "proyectId" FROM "Entity";
DROP TABLE "Entity";
ALTER TABLE "new_Entity" RENAME TO "Entity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
