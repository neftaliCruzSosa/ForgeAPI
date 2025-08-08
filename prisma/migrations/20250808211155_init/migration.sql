-- CreateTable
CREATE TABLE "Proyect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "outputDir" TEXT NOT NULL,
    "dbType" TEXT NOT NULL,
    "authType" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "author" TEXT,
    "auth" BOOLEAN
);

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
    "required" BOOLEAN NOT NULL DEFAULT false,
    "entityId" INTEGER NOT NULL,
    CONSTRAINT "Field_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "builtIn" BOOLEAN NOT NULL DEFAULT false,
    "proyectId" INTEGER NOT NULL,
    CONSTRAINT "Entity_proyectId_fkey" FOREIGN KEY ("proyectId") REFERENCES "Proyect" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Proyect_name_key" ON "Proyect"("name");
