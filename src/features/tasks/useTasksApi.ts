import { useCallback } from 'react'

import { useApiClient } from '../../api/useApiClient'
import type { Task } from './tasksApi'

const API_URL = 'http://localhost:5053/api/tasks'

export function useTasksApi() {
  const apiFetch = useApiClient()

  const getTasks = useCallback(async (): Promise<Task[]> => {
    const response = await apiFetch(API_URL)

    if (!response.ok) {
      throw new Error(
        `Failed to load tasks: ${response.status}`,
      )
    }

    return response.json()
  }, [apiFetch])

  const createTask = useCallback(
    async (title: string): Promise<Task> => {
      const response = await apiFetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
        }),
      })

      if (!response.ok) {
        throw new Error(
          `Failed to create task: ${response.status}`,
        )
      }

      return response.json()
    },
    [apiFetch],
  )

  const updateTask = useCallback(
    async (
      id: number,
      completed: boolean,
    ): Promise<Task> => {
      const response = await apiFetch(
        `${API_URL}/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completed,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `Failed to update task: ${response.status}`,
        )
      }

      return response.json()
    },
    [apiFetch],
  )

  const deleteTask = useCallback(
    async (id: number): Promise<void> => {
      const response = await apiFetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        throw new Error(
          `Failed to delete task: ${response.status}`,
        )
      }
    },
    [apiFetch],
  )

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}
