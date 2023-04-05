import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    switch (req.method) {
        case "GET":
            const tasks = await prisma.tasks.findMany();
            res.status(200).send(tasks);
            break;
        case "POST": 
            const { task } = JSON.parse(req.body);
            const data = await prisma.tasks.create({
                data: {
                    task,
                }
            });
            res.status(200).send(data);
            break;
        case "PUT":
            res.status(200).send(`${req.method} Request`);
            break;
        case "DELETE":
            res.status(200).send(`${req.method} Request`);
            break;
        default:
            return res.status(405).send("Method not allowed");
    }
}
