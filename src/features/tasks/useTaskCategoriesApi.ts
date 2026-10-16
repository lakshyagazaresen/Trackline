import { useCallback } from 'react'

import { useApiClient } from '../../api/useApiClient'
import { API_BASE_URL } from '../../config/apiConfig'

import type {
  CreateTaskCategoryInput,
  TaskCategory,
  UpdateTaskCategoryInput,
} from './taskCategoryTypes'

const API_URL =
  `${API_BASE_URL}/api/task-categories`

export function useTaskCategoriesApi() {
  const apiFetch =
    useApiClient()

  const getCategories =
    useCallback(
      async (): Promise<TaskCategory[]> => {
        const response =
          await apiFetch(API_URL)

        if (!response.ok) {
          throw new Error(
            `Failed to load task categories: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const createCategory =
    useCallback(
      async (
        input: CreateTaskCategoryInput,
      ): Promise<TaskCategory> => {
        const response =
          await apiFetch(
            API_URL,
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify(
                input,
              ),
            },
          )

        if (!response.ok) {
          throw new Error(
            `Failed to create task category: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const updateCategory =
    useCallback(
      async (
        id: number,
        input: UpdateTaskCategoryInput,
      ): Promise<TaskCategory> => {
        const response =
          await apiFetch(
            `${API_URL}/${id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify(
                input,
              ),
            },
          )

        if (!response.ok) {
          throw new Error(
            `Failed to update task category: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const deleteCategory =
    useCallback(
      async (
        id: number,
      ): Promise<void> => {
        const response =
          await apiFetch(
            `${API_URL}/${id}`,
            {
              method: 'DELETE',
            },
          )

        if (!response.ok) {
          throw new Error(
            `Failed to delete task category: ${response.status}`,
          )
        }
      },
      [apiFetch],
    )

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}