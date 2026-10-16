import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { useTasksApi } from './useTasksApi'

import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from './taskTypes'

export function useTasks() {
  const {
    getTasks,
    createTask: createTaskRequest,
    updateTask: updateTaskRequest,
    deleteTask: deleteTaskRequest,
  } = useTasksApi()

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const loadTasks = useCallback(
    async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data =
          await getTasks()

        setTasks(data)
      } catch (error) {
        console.error(error)

        setError(
          'Unable to load tasks.',
        )
      } finally {
        setIsLoading(false)
      }
    },
    [getTasks],
  )

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const addTask = useCallback(
    async (
      input: CreateTaskInput,
    ) => {
      try {
        setError(null)

        const newTask =
          await createTaskRequest(
            input,
          )

        setTasks(
          (currentTasks) => [
            ...currentTasks,
            newTask,
          ],
        )
      } catch (error) {
        console.error(error)

        setError(
          'Unable to add task.',
        )

        throw error
      }
    },
    [createTaskRequest],
  )

  const saveTask = useCallback(
    async (
      id: number,
      input: UpdateTaskInput,
    ) => {
      try {
        setError(null)

        const updatedTask =
          await updateTaskRequest(
            id,
            input,
          )

        setTasks(
          (currentTasks) =>
            currentTasks.map(
              (task) =>
                task.id === id
                  ? updatedTask
                  : task,
            ),
        )

        return updatedTask
      } catch (error) {
        console.error(error)

        setError(
          'Unable to update task.',
        )

        throw error
      }
    },
    [updateTaskRequest],
  )

  const changeTaskStatus =
    useCallback(
      async (
        task: Task,
        status: TaskStatus,
      ) => {
        await saveTask(
          task.id,
          {
            title: task.title,
            description:
              task.description,
            status,
            priority:
              task.priority,
              categoryId: task.categoryId,
            dueDate:
              task.dueDate,
          },
        )
      },
      [saveTask],
    )

  const removeTask = useCallback(
    async (id: number) => {
      try {
        setError(null)

        await deleteTaskRequest(id)

        setTasks(
          (currentTasks) =>
            currentTasks.filter(
              (task) =>
                task.id !== id,
            ),
        )
      } catch (error) {
        console.error(error)

        setError(
          'Unable to delete task.',
        )

        throw error
      }
    },
    [deleteTaskRequest],
  )

  return {
    tasks,
    isLoading,
    error,

    loadTasks,
    addTask,
    saveTask,
    changeTaskStatus,
    removeTask,
  }
}