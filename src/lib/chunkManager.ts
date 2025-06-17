import { algorithm1 } from "./splitAlgorithms";
import type { Task } from "./useTaskManager";

export type Chunk = {
    date: Date;
    task: Task;
    durationMinutes: number;
    completed: boolean;
    id?: string;
}

export type TaskPriorityAlgorithm = (task: Task, chunks: Chunk[], date: Date) => number;

const MINUTES_INCREMENT = 10;

export function makeChunks(tasks: Task[], completedChunks: Chunk[]): Chunk[] {
    const tasksToPlan = tasks.filter(task => task.dueDate >= new Date() && task.minutesCompleted < task.totalMinutesToComplete);
    const lastDate = tasksToPlan.reduce((maxDate, task) => {
        return task.dueDate > maxDate ? task.dueDate : maxDate;
    }, new Date(0));
    lastDate.setHours(0, 0, 0, 0);
    const firstDate = tasksToPlan.reduce((minDate, task) => {
        return task.dueDate < minDate ? task.dueDate : minDate;
    }, new Date());
    firstDate.setHours(0, 0, 0, 0);

    const chunks: Chunk[] = [];

    const completedCount = new Map<number, number>();
    for (const chunk of completedChunks) {
        const dateKey = chunk.date.getTime();
        completedCount.set(dateKey, (completedCount.get(dateKey) ?? 0) + (chunk.durationMinutes / 10));
    }

    let round = 0;

    while (tasksToPlan.filter(task => {
                if (task.dueDate <= firstDate) return false;
                const totalPlanned = chunks
                    .filter(chunk => chunk.task.id === task.id)
                    .reduce((sum, chunk) => sum + chunk.durationMinutes, 0);
                return (totalPlanned + task.minutesCompleted) < task.totalMinutesToComplete;
            }).length > 0) {
        for (let date = lastDate; date >= firstDate; date = new Date(date.getTime() - 24 * 60 * 60 * 1000)) {
            const dateKey = date.getTime();
            if (round < (completedCount.get(dateKey) ?? 0)) {
                continue;
            }
            
            let priorityTask = chunks.find(chunk =>
                chunk.date.getTime() === date.getTime() &&
                chunk.task.mode === "all-at-once" &&
                chunk.durationMinutes < chunk.task.totalMinutesToComplete
            )?.task ?? tasksToPlan.filter(task => {
                if (task.dueDate <= date) return false;
                const totalPlanned = chunks
                    .filter(chunk => chunk.task.id === task.id)
                    .reduce((sum, chunk) => sum + chunk.durationMinutes, 0);

                // Prevent selecting an "all-at-once" task if it has already been assigned to any other day
                if (
                    task.mode === "all-at-once" &&
                    chunks.some(chunk => chunk.task.id === task.id && chunk.date.getTime() !== date.getTime())
                ) {
                    return false;
                }
                return (totalPlanned + task.minutesCompleted) < task.totalMinutesToComplete;
            }).sort((a, b) => {
                const priorityA = algorithm1(a, chunks, date);
                const priorityB = algorithm1(b, chunks, date);

                const aHasCompleted = completedChunks.some(chunk => chunk.date.toString() === date.toString() && chunk.task.id === a.id);
                console.log(date, completedChunks.map(chunk => chunk.date))
                const bHasCompleted = completedChunks.some(chunk => chunk.date.toString() === date.toString() && chunk.task.id === b.id);
                

                // console.log(aHasCompleted, bHasCompleted)

                if (aHasCompleted && !bHasCompleted) return 1;
                if (bHasCompleted && !aHasCompleted) return -1;

                return priorityB - priorityA; // Higher priority first
            })[0];
                     
            if (!priorityTask) {
                continue;
            }
        
            if (!chunks.some(chunk => chunk.date.getTime() === date.getTime() && chunk.task.id === priorityTask.id)) {
                chunks.push({
                    date: new Date(date),
                    task: priorityTask,
                    durationMinutes: MINUTES_INCREMENT,
                    completed: false,
                });
            } else {
                chunks.find(chunk => chunk.date.getTime() === date.getTime() && chunk.task.id === priorityTask.id)!.durationMinutes += MINUTES_INCREMENT;
            }
        }
        round++;
        if (round >= 10000) {
            console.log("more than 10k rounds, breaking");
            break;
        }
    }

    return chunks;
}