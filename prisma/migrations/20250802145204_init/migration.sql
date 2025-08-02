-- CreateTable
CREATE TABLE "Proyect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "auth" BOOLEAN NOT NULL,
    "dbType" TEXT NOT NULL,
    "authType" TEXT NOT NULL,
    "framework" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Proyect_name_key" ON "Proyect"("name");
