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
