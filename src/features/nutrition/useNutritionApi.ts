import { useCallback } from 'react'

import {
  useApiClient,
} from '../../api/useApiClient'

import {
  API_BASE_URL,
} from '../../config/apiConfig'

import type {
  CreateManualNutritionLogInput,
  NutritionDailySummary,
  NutritionLog,
  NutritionTarget,
  SetNutritionTargetInput,
  UpdateNutritionLogInput,
} from './nutritionTypes'

const API_URL =
  `${API_BASE_URL}/api/nutrition`

export function useNutritionApi() {
  const apiFetch =
    useApiClient()

  const getLogs =
    useCallback(
      async (
        date: string,
      ): Promise<
        NutritionLog[]
      > => {
        const response =
          await apiFetch(
            `${API_URL}/logs?date=${encodeURIComponent(
              date,
            )}`,
          )

        if (!response.ok) {
          throw new Error(
            `Failed to load nutrition logs: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const getDailySummary =
    useCallback(
      async (
        date: string,
      ): Promise<
        NutritionDailySummary
      > => {
        const response =
          await apiFetch(
            `${API_URL}/summary?date=${encodeURIComponent(
              date,
            )}`,
          )

        if (!response.ok) {
          throw new Error(
            `Failed to load nutrition summary: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const getWeekSummary =
    useCallback(
      async (
        date: string,
      ): Promise<
        NutritionDailySummary[]
      > => {
        const response =
          await apiFetch(
            `${API_URL}/week?date=${encodeURIComponent(
              date,
            )}`,
          )

        if (!response.ok) {
          throw new Error(
            `Failed to load weekly nutrition summary: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const createManualLog =
    useCallback(
      async (
        input:
          CreateManualNutritionLogInput,
      ): Promise<
        NutritionLog
      > => {
        const response =
          await apiFetch(
            `${API_URL}/logs/manual`,
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
            `Failed to create nutrition log: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const updateLog =
    useCallback(
      async (
        id: number,
        input:
          UpdateNutritionLogInput,
      ): Promise<
        NutritionLog
      > => {
        const response =
          await apiFetch(
            `${API_URL}/logs/${id}`,
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
            `Failed to update nutrition log: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const deleteLog =
    useCallback(
      async (
        id: number,
      ): Promise<void> => {
        const response =
          await apiFetch(
            `${API_URL}/logs/${id}`,
            {
              method: 'DELETE',
            },
          )

        if (!response.ok) {
          throw new Error(
            `Failed to delete nutrition log: ${response.status}`,
          )
        }
      },
      [apiFetch],
    )

  const getTarget =
    useCallback(
      async (
        date: string,
      ): Promise<
        NutritionTarget | null
      > => {
        const response =
          await apiFetch(
            `${API_URL}/target?date=${encodeURIComponent(
              date,
            )}`,
          )

        if (
          response.status === 404
        ) {
          return null
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load nutrition target: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  const setTarget =
    useCallback(
      async (
        input:
          SetNutritionTargetInput,
      ): Promise<
        NutritionTarget
      > => {
        const response =
          await apiFetch(
            `${API_URL}/target`,
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
            `Failed to save nutrition target: ${response.status}`,
          )
        }

        return response.json()
      },
      [apiFetch],
    )

  return {
    getLogs,
    getDailySummary,
    getWeekSummary,

    createManualLog,
    updateLog,
    deleteLog,

    getTarget,
    setTarget,
  }
}