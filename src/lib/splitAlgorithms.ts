import type { TaskPriorityAlgorithm } from "./chunkManager";

export const algorithm1: TaskPriorityAlgorithm = (task, chunks, date) => {
    const daysLeftUntilDue = (task.dueDate.getTime() - new Date().getTime()) / 24 * 60 * 60 * 1000;
    const totalPlanned = chunks
                .filter(chunk => chunk.task.id === task.id)
                .reduce((sum, chunk) => sum + chunk.durationMinutes, 0); 
    const minutesLeftToPlan = task.totalMinutesToComplete - task.minutesCompleted - totalPlanned;

    const totalPlannedOnDate = chunks
        .filter(chunk => chunk.task.id === task.id && chunk.date.toDateString() === date.toDateString())
        .reduce((sum, chunk) => sum + chunk.durationMinutes, 0);
    
    return ((minutesLeftToPlan - totalPlannedOnDate) / daysLeftUntilDue) * (task.mode === "all-at-once" ? Number.MAX_VALUE : 1);
}