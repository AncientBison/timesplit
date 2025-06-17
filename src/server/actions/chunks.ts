"use server"

import { db } from "~/server/db";
import type { Chunk } from "~/lib/chunkManager";
import { auth } from "../auth";
import { completedChunks, tasks } from "../db/schema";
import { eq } from "drizzle-orm";
import type { Task } from "~/lib/useTaskManager";

export async function addCompletedChunkToDB(chunk: Chunk) {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }


    const id = (await db.insert(completedChunks).values({
        taskId: chunk.task.id!,
        userId: session.user.id,
        date: chunk.date,
        durationMinutes: chunk.durationMinutes
    }).returning({ id: tasks.id }))[0]!.id;
    
    if (id === undefined) {
        throw new Error("Failed to add completed chunk to the database");
    }
    
    const task = await db.query.tasks.findFirst({
        where: (tasks, { eq }) => eq(tasks.id, chunk.task.id!)
    });

    const newMinutesCompleted = (task?.minutesCompleted ?? 0) + chunk.durationMinutes;

    await db.update(tasks)
        .set({ minutesCompleted: newMinutesCompleted })
        .where(eq(tasks.id, chunk.task.id!));

    return id;
}

export async function getCompletedChunksFromDB() {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }

    const userCompletedChunks = await db
        .select({
            id: completedChunks.id,
            date: completedChunks.date,
            durationMinutes: completedChunks.durationMinutes,
            task: {
                id: tasks.id,
                title: tasks.title,
                dueDate: tasks.dueDate,
                minutesCompleted: tasks.minutesCompleted,
                totalMinutesToComplete: tasks.totalMinutesToComplete,
                mode: tasks.mode
            }
        })
        .from(completedChunks)
        .innerJoin(tasks, eq(completedChunks.taskId, tasks.id))
        .where(eq(completedChunks.userId, session.user.id));

    // await db.delete(completedChunks).where(eq(completedChunks.userId, session.user.id));

    return userCompletedChunks as Chunk[];
}