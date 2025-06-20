"use client";

import { useState } from "react";
import TaskCreator from "./TaskCreator";
import useTaskManager, { type Task } from "~/lib/useTaskManager";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Dialog } from "./ui/dialog";
import { DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import TaskForm from "./TaskForm";

export default function TaskView() {
    const [taskCreatorOpen, setTaskCreatorOpen] = useState(false);

    const openTaskCreator = () => {
        setTaskCreatorOpen(true);
    }

    const closeTaskCreator = () => {
        setTaskCreatorOpen(false);
    }

    return (
        <div className="w-full h-[calc(100%-64px)] bg-gray-100 mt-16 overflow-y-auto">
            {taskCreatorOpen ? (<TaskCreator closeTaskCreator={closeTaskCreator} />) : (
                <TaskList openTaskCreator={openTaskCreator} />
            )}
        </div>
    );
}

function TaskList({ openTaskCreator }: { openTaskCreator: () => void}) {
    const { tasks } = useTaskManager();

    return (
        <div className="w-full h-full flex flex-col gap-2 p-4 items-center">
            <div className="w-full flex justify-between items-center mb-8">
                <h1 className="text-2xl">
                    Your Tasks
                </h1>
                <Button size="icon" onClick={openTaskCreator}>
                    <Plus />
                </Button>
            </div>
            {tasks.filter(task => task.minutesCompleted < task.totalMinutesToComplete).map(task => (
                <TaskBlock key={task.id} task={task} />
            ))}
            {tasks.filter(task => task.minutesCompleted < task.totalMinutesToComplete).length === 0 && (
                <h3 className="text-xl">
                    Start by adding a task 
                </h3>
            )}
        </div>
    );
}

function TaskBlock({ task }: { task: Task }) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    return (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
                <div
                    style={{
                        backgroundColor: task.colorHex,
                        boxShadow: `0 0 0 2px ${task.colorHex}80`
                    }}
                    className={`w-full h-1/10 rounded-lg flex items-center flex-col justify-center p-2`}
                >
                    <div>
                        {task.title}
                    </div>
                    <div className="flex text-sm w-full justify-center items-center flex-col">
                        Due {task.dueDate.toLocaleDateString()} at {task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                    
                    {/* <div className="flex w-full justify-center items-center flex-col">
                        Time Remaining: TODO
                    </div> */}
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle />
                <TaskForm task={task} closeTaskForm={() => setEditDialogOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}