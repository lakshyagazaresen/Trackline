import { useCallback } from 'react'

import { useApiClient } from '../../api/useApiClient'
import { API_BASE_URL } from '../../config/apiConfig'

import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from './taskTypes'

const API_URL =
  `${API_BASE_URL}/api/tasks`

export function useTasksApi() {
  const apiFetch = useApiClient()

  const getTasks = useCallback(
    async (): Promise<Task[]> => {
      const response =
        await apiFetch(API_URL)

      if (!response.ok) {
        throw new Error(
          `Failed to load tasks: ${response.status}`,
        )
      }

      return response.json()
    },
    [apiFetch],
  )

  const getTask = useCallback(
    async (id: number): Promise<Task> => {
      const response =
        await apiFetch(`${API_URL}/${id}`)

      if (!response.ok) {
        throw new Error(
          `Failed to load task: ${response.status}`,
        )
      }

      return response.json()
    },
    [apiFetch],
  )

  const createTask = useCallback(
    async (
      input: CreateTaskInput,
    ): Promise<Task> => {
      const response =
        await apiFetch(API_URL, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(input),
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
      input: UpdateTaskInput,
    ): Promise<Task> => {
      const response =
        await apiFetch(
          `${API_URL}/${id}`,
          {
            method: 'PUT',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(input),
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
      const response =
        await apiFetch(
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
    getTask,
    createTask,
    updateTask,
    deleteTask,
  }
}