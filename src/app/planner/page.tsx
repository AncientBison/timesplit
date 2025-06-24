import WeekCalendar from "@components/WeekCalendar";
import { TasksProvider } from "~/lib/useTaskManager";
import { use } from "react";
import { getTasksFromDB } from "~/server/actions/tasks";
import TaskView from "@components/TaskView";
import { getCompletedChunksFromDB } from "~/server/actions/chunks";
import CompletedChunksDisplay from "~/components/CompletedChunksDisplay";

export default function Page() {
  const tasksFromDB = use(getTasksFromDB());
  const completedChunksFromDB = use(getCompletedChunksFromDB()).map((chunk) => ({
    ...chunk,
    completed: true,
  }));

  return (
    <main className="flex min-h-screen h-screen flex-row items-center justify-between">
      <TasksProvider tasksFromDB={tasksFromDB} completedChunksFromDB={completedChunksFromDB}>
        <div className="w-1/5 min-w-[230px] h-full">
          <TaskView />
        </div>
        <div className="w-4/5 h-full overflow-y-auto flex flex-col">
          <div className="w-full min-h-screen flex items-center justify-center">
            <WeekCalendar />
          </div>
          {/* <div  className="w-full flex items-center justify-center">
            <CompletedChunksDisplay />
          </div> */}
        </div>
      </TasksProvider>
    </main>
  );
}