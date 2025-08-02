import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const proyects = await prisma.proyect.findMany();
    console.log(proyects);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
