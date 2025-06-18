"use client";

import useTaskManager, { type Task } from "~/lib/useTaskManager";
import { Button } from "@ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { AlertCircleIcon, X } from "lucide-react";
import { DatePicker } from "./ui/date-picker";
import { Label } from "@radix-ui/react-label";
import { Alert, AlertTitle } from "./ui/alert";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@components/ui/toggle-group";
import type { Color } from "~/lib/taskColors";
import { ColorPicker } from "./ui/colorPicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import ConfirmationDialog from "./ConfirmationDialog";

interface TaskFormProps {
  task?: Task;
  closeTaskForm: () => void;
}

export default function TaskForm({ task, closeTaskForm }: TaskFormProps) {
  const { createTask, editTask, removeTask } = useTaskManager();
  const isEditing = !!task;
  const hasTimeCompleted = isEditing && task.minutesCompleted > 0;

  // Initialize state with task values if editing, otherwise use defaults
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(0, 0, 0, 0); // Normalize to midnight
  const [taskTitle, setTaskTitle] = useState(task?.title ?? "New Task");
  const [dueDate, setDueDate] = useState<Date>(task?.dueDate ?? new Date(tomorrow));
  const [totalMinutesToComplete, setTotalMinutesToComplete] = useState(
    task?.totalMinutesToComplete ?? 60
  );
  const [mode, setMode] = useState<"incremental" | "all-at-once">(
    task?.mode ?? "incremental"
  );
  const [taskColor, setTaskColor] = useState<Color>(task?.colorHex ?? "#00BBF9");

  return (
    <div className="w-full h-full flex justify-center items-start flex-col gap-4 p-4">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-2xl">
          {isEditing ? "Edit Task" : "Create New Task"}
        </h1>
        <Button size="icon" onClick={closeTaskForm}>
          <X />
        </Button>
      </div>
      <Label>Task Title</Label>
      <Input
        placeholder="Task Title"
        className="w-full max-w-md bg-background"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        required
      />
      <Label>Due Date</Label>
      <DatePicker
        selected={dueDate}
        onSelect={(date) => {
          if (date === undefined) return;
          date.setHours(
            parseInt(dueDate.toTimeString().slice(0, 2)) ?? 0,
            parseInt(dueDate.toTimeString().slice(3, 5)) ?? 0,
            parseInt(dueDate.toTimeString().slice(6, 8)) ?? 0
          );
          setDueDate(date);
        }}
        disabled={(date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today;
        }}
      />
      <Input
        type="time"
        value={dueDate.toTimeString().slice(0, 8)}
        onChange={(e) => {
          if (dueDate) {
            const [hours, minutes] = e.target.value.split(":").map(Number);
            const newDate = new Date(dueDate);
            newDate.setHours(hours!, minutes, 0, 0);
            setDueDate(newDate);
          }
        }}
        step="60"
        className="bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
      <Label>Time to Complete</Label>
      <div className="flex flex-row flex-wrap">
        <Input
          type="number"
          className="w-1/2 max-w-md bg-background"
          value={Math.floor(totalMinutesToComplete / 60)}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              setTotalMinutesToComplete(
                Math.max(value * 60 + (totalMinutesToComplete % 60), 1)
              );
            }
          }}
        />
        <Label className="w-1/2 pl-2 items-center flex">hours</Label>
        <Input
          type="number"
          className="w-1/2 max-w-md bg-background"
          value={totalMinutesToComplete % 60}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              setTotalMinutesToComplete(
                Math.max(totalMinutesToComplete - (totalMinutesToComplete % 60) + value, 1)
              );
            }
          }}
        />
        <Label className="w-1/2 pl-2 items-center flex">minutes</Label>
      </div>
      <div className="w-full flex flex-row items-center justify-between flex-wrap">
        <div className="min-w-1/2">
          <Label>Split Mode</Label>
          <ToggleGroup
            variant="outline"
            type="single"
            className="bg-gray-100"
            value={mode}
            onValueChange={(e) => {
              if (e && !hasTimeCompleted) setMode(e as "incremental" | "all-at-once");
            }}
            disabled={hasTimeCompleted}
          >
            <ToggleGroupItem value="incremental" className="data-[state=on]:bg-white">
              Incremental
            </ToggleGroupItem>
            <ToggleGroupItem value="all-at-once" className="data-[state=on]:bg-white">
              All at once
            </ToggleGroupItem>
          </ToggleGroup>
          {hasTimeCompleted && (
            <Alert className="mt-2">
              <AlertCircleIcon />
              <AlertTitle>Cannot change mode with completed chunks</AlertTitle>
            </Alert>
          )}
        </div>
        <div className="w-1/2">
          <Label>Color</Label>
          <ColorPicker selected={taskColor} onSelect={setTaskColor} />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Button
          className="h-11"
          onClick={async () => {
            if (isEditing) {
              await editTask({
                id: task.id,
                title: taskTitle,
                dueDate: dueDate,
                totalMinutesToComplete: totalMinutesToComplete,
                minutesCompleted: -1,
                mode: mode,
                colorHex: taskColor,
              });
            } else {
              await createTask({
                title: taskTitle,
                dueDate: dueDate,
                totalMinutesToComplete: totalMinutesToComplete,
                minutesCompleted: 0,
                mode: mode,
                colorHex: taskColor,
                id: undefined,
              });
            }
            closeTaskForm();
          }}
          disabled={taskTitle.trim().length === 0}
        >
          {isEditing ? "Save changes" : "Create task"}
        </Button>
        {isEditing && (
          <ConfirmationDialog
            onConfirm={async () => {
                await removeTask(task);
                closeTaskForm();
            }}
            title="Delete Task"
            description="Are you sure you want to delete this task? This action cannot be undone."
            confirmText="Delete Task"
            cancelText="Cancel">
                <Button className="h-11">
                    Delete
                </Button>
            </ConfirmationDialog>
        )}
        {taskTitle.trim().length === 0 && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>A task title is required</AlertTitle>
          </Alert>
        )}
      </div>
    </div>
  );
}