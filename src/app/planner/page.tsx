import WeekCalendar from "@components/WeekCalendar";
import { TasksProvider } from "~/lib/useTaskManager";
import { use } from "react";
import { getTasksFromDB } from "~/server/actions/tasks";
import TaskView from "@components/TaskView";
import { getCompletedChunksFromDB } from "~/server/actions/chunks";

export default function Page() {
  const tasksFromDB = use(getTasksFromDB());
  const completedChunksFromDB = use(getCompletedChunksFromDB()).map(chunk => (
    {...chunk, completed: true}
  ))

  return (
    <main className="flex min-h-screen h-screen flex-row items-center justify-between">
      <TasksProvider tasksFromDB={tasksFromDB} completedChunksFromDB={completedChunksFromDB}>
        <div className="w-1/5 h-full">
          <TaskView />
        </div>
        <div className="w-4/5 h-full flex justify-center items-center">
          <WeekCalendar />
        </div>
      </TasksProvider>
    </main>
  );
}