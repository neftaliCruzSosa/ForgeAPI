-- CreateTable
CREATE TABLE "Protect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "method" TEXT NOT NULL,
    "authLevel" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    CONSTRAINT "Protect_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Field" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ref" TEXT,
    "required" BOOLEAN NOT NULL,
    "entityId" INTEGER NOT NULL,
    CONSTRAINT "Field_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "builtIn" BOOLEAN NOT NULL,
    "proyectId" INTEGER NOT NULL,
    CONSTRAINT "Entity_proyectId_fkey" FOREIGN KEY ("proyectId") REFERENCES "Proyect" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
