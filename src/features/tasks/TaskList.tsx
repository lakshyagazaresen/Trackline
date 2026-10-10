import { useEffect, useState } from "react";
import AddTaskForm from "./AddTaskForm";
import TaskItem from "./TaskItem";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
} from "./tasksApi";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getTasks();

        setTasks(data);
      } catch (error) {
        console.error(error);

        setError("Could not load your tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  const completedCount = tasks.filter((task) => task.completed).length;

  async function handleAddTask(title: string) {
    try {
      setError(null);

      const newTask = await createTask(title);

      setTasks((currentTasks) => [...currentTasks, newTask]);
    } catch (error) {
      console.error(error);

      setError("Could not create the task. Please try again.");

      throw error;
    }
  }

  async function handleToggleTask(taskId: number) {
    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      return;
    }

    try {
      setError(null);

      const updatedTask = await updateTask(taskId, !task.completed);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );
    } catch (error) {
      console.error(error);

      setError("Could not update the task. Please try again.");
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      setError(null);

      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
    } catch (error) {
      console.error(error);

      setError("Could not delete the task. Please try again.");
    }
  }
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
        <p className="text-slate-400">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="text-lg font-semibold text-white">Today's Tasks</h3>

      <p className="mt-1 text-sm text-slate-400">
        {completedCount} of {tasks.length} completed
      </p>
      {error && (
        <div className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <AddTaskForm onAdd={handleAddTask} />

      <div className="mt-5 space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            completed={task.completed}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
