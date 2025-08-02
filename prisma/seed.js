// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Example: Create a user
  await prisma.proyect.create({
    data: {
      name: 'demo-social-api',
      auth: true,
      dbType: 'mongo',
      authType: 'jwt',
      framework: 'express',
    },
  });
  
  console.log('Seed data inserted successfully!');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });