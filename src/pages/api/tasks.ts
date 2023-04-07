import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(401).send("Unauthorized");
    
    switch (req.method) {
        case "GET":
            const tasks = await prisma.tasks.findMany({
                where: {
                    email: session?.user?.email
                }
            });
            res.status(200).send(tasks);
            break;
        case "POST": 
            const { task } = JSON.parse(req.body);
            const data = await prisma.tasks.create({
                data: {
                    email: session?.user?.email,
                    task,
                }
            });
            res.status(201).send(data);
            break;
        case "PUT":
            // update a task
            const { id } = req.query;
            const existingTask = await prisma.tasks.findFirst({
                where: {
                    id: id.toString()
                }
            });
            const updatedTask = await prisma.tasks.update({
                where: {
                    id: id.toString(),
                },
                data: {
                    completed: !existingTask.completed
                }
            });
            res.status(200).send(updatedTask);
            break;
        case "DELETE":
            const { id: taskId } = req.query;
            const eTask = await prisma.tasks.findFirst({
                where: {
                    id: taskId.toString()
                }
            });
            if (eTask.email !== session?.user?.email) return res.status(401).send({ status: true, message: "Unauthorized" });
            await prisma.tasks.delete({
                where: {
                    id: taskId.toString(),
                },
            });
            res.status(200).send({ status: true, message: "Task deleted" });
            break;
        default:
            return res.status(405).send("Method not allowed");
    }
}
