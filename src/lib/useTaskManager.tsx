"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { addTaskToDB, editTaskOnDB, removeTaskFromDB } from "~/server/actions/tasks";
import type { Color } from "./taskColors";
import { addCompletedChunkToDB  } from "~/server/actions/chunks";
import type { Chunk } from "./chunkManager";

export type Task = {
    title: string;
    dueDate: Date;
    totalMinutesToComplete: number;
    minutesCompleted: number;
    mode: "all-at-once" | "incremental";
    colorHex: Color;
    id: string | undefined;
}

type TasksContext = {
    tasks: Task[],
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    completedChunks: Chunk[]
    setCompletedChunks: React.Dispatch<React.SetStateAction<Chunk[]>>
}

const TaskContextsInstance = createContext<TasksContext>({
  tasks: [],
  setTasks: () => {}, // No-op function to avoid ESLint empty function warning
  completedChunks: [],
  setCompletedChunks: () => {}, // No-op function to avoid ESLint empty function warning
});

export function TasksProvider({ children, tasksFromDB, completedChunksFromDB }: { children: React.ReactNode, tasksFromDB: Task[], completedChunksFromDB: Chunk[] }) {
    const [tasks, setTasks] = useState<Task[]>(tasksFromDB);
    const [completedChunks, setCompletedChunks] = useState<Chunk[]>(completedChunksFromDB);

    return (
        <TaskContextsInstance.Provider value={{ tasks, setTasks, completedChunks, setCompletedChunks }}>
            {children}
        </TaskContextsInstance.Provider>
    );
}

export default function useTaskManager() {
    const { tasks, setTasks, completedChunks, setCompletedChunks } = useContext(TaskContextsInstance);

    const createTask = async (task: Task) => {
        const id = await addTaskToDB(task);
        if (id !== undefined) {
            setTasks(prevTasks => [...prevTasks, { ...task, id }]);
        }
    };
    const removeTask = async (task: Task) => {
        setTasks(prevTasks => prevTasks.filter(t => t !== task));
        await removeTaskFromDB(task.id!);
    };

    const editTask = async (task: Task) => {
        setTasks(prevTasks => prevTasks.map(t => (
            (t.id === task.id) ? task : t
        )));
        await editTaskOnDB(task);
    }

    const completeChunk = async (chunk: Chunk) => {
        const id = await addCompletedChunkToDB(chunk);
        if (id !== undefined) {
            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t.id === chunk.task.id
                        ? { ...t, minutesCompleted: t.minutesCompleted + chunk.durationMinutes }
                        : t
                )
            );
            setCompletedChunks(prevChunks => [...prevChunks, { ...chunk, id }]);
        }
    }

    return { tasks, completedChunks, createTask, removeTask, editTask, completeChunk } as const;
}