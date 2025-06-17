"use server";

import { db } from "~/server/db";

import type { Task } from "~/lib/useTaskManager";
import { completedChunks, tasks } from "../db/schema";
import { auth } from "../auth";
import { eq } from "drizzle-orm";

export async function addTaskToDB(task: Task): Promise<string> {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }

    const id = (await db.insert(tasks).values({
        ...task,
        userId: session?.user.id
    }).returning({ id: tasks.id }))[0]!.id;

    if (id === undefined) {
        throw new Error("Failed to add task to the database");
    }

    return id;
}

export async function removeTaskFromDB(taskID: string) {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }
    
    await db.delete(tasks).where(eq(tasks.id, taskID));

    await db.delete(completedChunks).where(eq(completedChunks.taskId, taskID));
}

export async function editTaskOnDB(task: Task) {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }

    await db.update(tasks)
        .set({ colorHex: task.colorHex, dueDate: task.dueDate, mode: task.mode, title: task.title, totalMinutesToComplete: task.totalMinutesToComplete })
        .where(eq(tasks.id, task.id!));
}

export async function getTasksFromDB() {
    const session = await auth();

    if (!session) {
        throw new Error("User not authenticated");
    }

    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, session.user.id));

    // await db.delete(tasks).where(eq(tasks.userId, session.user.id));

    return userTasks;
}