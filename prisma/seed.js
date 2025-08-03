// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const proyect = await prisma.proyect.create({
    data: {
      name: 'demo-social-api',
      auth: true,
      dbType: 'mongo',
      authType: 'jwt',
      framework: 'express',
    },
  });

  const userEntity = await prisma.entity.create({
    data: {
      name: 'User',
      builtIn: true,
      proyect: {
        connect: {
          id: proyect.id,
        },
      },
    },
  });

  const createUserProtect = await prisma.protect.create({
    data: {
      method: 'CREATE',
      authLevel: 'ADMIN',
      entityId: userEntity.id,
    },
  });

  const updateUserProtect = await prisma.protect.create({
    data: {
      method: 'UPDATE',
      authLevel: 'SELF',
      entityId: userEntity.id,
    },
  });

  const bioField = await prisma.field.create({
    data: {
      name: 'bio',
      type: 'STRING',
      entityId: userEntity.id,
    },
  });

  const avatarField = await prisma.field.create({
    data: {
      name: 'avatar',
      type: 'STRING',
      entityId: userEntity.id,
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