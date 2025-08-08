import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const proyects = await prisma.proyect.findMany({
        include: {
            entities: {
                include: {
                    fields: true,
                    protect: true,
                }
            },
        }
    });
    console.log(JSON.stringify(proyects, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
