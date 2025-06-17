"use client";

import TaskForm from "./TaskForm";

export default function TaskCreator({ closeTaskCreator }: { closeTaskCreator: () => void }) {
    return (
        <TaskForm closeTaskForm={closeTaskCreator} />
    );
}