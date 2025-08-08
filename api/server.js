import express from 'express';
import cors from 'cors';
const app = express();

// Configure CORS to allow requests from http://localhost:5175
const corsOptions = {
ºorigin: 'http://localhost:8888', // Specify the allowed origin
};

app.use(cors(corsOptions));

const port = 3000;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


app.get('/', async (req, res) => {
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
    res.send(proyects);
});


app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});