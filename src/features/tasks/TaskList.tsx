import { useEffect, useState } from "react";

import AddTaskForm from "./AddTaskForm";
import TaskItem from "./TaskItem";

import type { Task } from "./tasksApi";
import { useTasksApi } from "./useTasksApi";
function TaskList() {
  const { getTasks, createTask, updateTask, deleteTask } = useTasksApi();
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

        setError("Unable to load tasks.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, [getTasks]);

  const completedCount = tasks.filter((task) => task.completed).length;

  async function handleAddTask(title: string) {
    const newTask = await createTask(title);

    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  async function handleToggleTask(id: number, completed: boolean) {
    try {
      setError(null);

      const updatedTask = await updateTask(id, completed);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );
    } catch (error) {
      console.error(error);

      setError("Unable to update task.");
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
            task={task}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
