import fs from "fs";
import { execSync } from "child_process";

const migrationsDir = "prisma/migrations";

if (
  !fs.existsSync(migrationsDir) ||
  fs.readdirSync(migrationsDir).length === 0
) {
  execSync("npx prisma migrate dev --name init --skip-seed", {
    stdio: "inherit",
  });
} else {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
}
execSync("npx prisma generate", { stdio: "inherit" });
