import { useMemo } from 'react'
import { useApiClient } from '../../../api/useApiClient'
import { API_BASE_URL } from '../../../config/apiConfig'

import type {
  WorkoutCategory,
  WorkoutSession,
  WorkoutSessionExercise,
  WorkoutSet,
  WorkoutSessionDetail,
  WorkoutExerciseDetail,
  CreateWorkoutCategoryRequest,
  UpdateWorkoutCategoryRequest,
  CreateWorkoutSessionRequest,
  UpdateWorkoutSessionRequest,
  CreateWorkoutSessionExerciseRequest,
  UpdateWorkoutSessionExerciseRequest,
  CreateWorkoutSetRequest,
  UpdateWorkoutSetRequest,
} from '../types/workout'

export function useWorkoutApi() {
  const apiFetch = useApiClient()

  return useMemo(() => {
    async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
      const headers = new Headers(options.headers)
      if (options.body != null) headers.set('Content-Type', 'application/json')
      const response = await apiFetch(`${API_BASE_URL}${path}`, { ...options, headers })
      if (!response.ok) {
        const body = await response.text()
        let message = `Request failed (${response.status})`
        if (body) {
          try {
            const parsed = JSON.parse(body) as { message?: string; detail?: string; title?: string }
            message = parsed.message ?? parsed.detail ?? parsed.title ?? message
          } catch {
            message = body
          }
        }
        throw new Error(message)
      }
      if (response.status === 204) return undefined as T
      return response.json() as Promise<T>
    }

    const json = (value: unknown) => JSON.stringify(value)

    const categories = {
      list: () => request<WorkoutCategory[]>('/api/workout-categories'),
      get: (id: string) => request<WorkoutCategory>(`/api/workout-categories/${id}`),
      create: (data: CreateWorkoutCategoryRequest) => request<WorkoutCategory>('/api/workout-categories', { method: 'POST', body: json(data) }),
      update: (id: string, data: UpdateWorkoutCategoryRequest) => request<WorkoutCategory>(`/api/workout-categories/${id}`, { method: 'PUT', body: json(data) }),
      archive: (id: string) => request<void>(`/api/workout-categories/${id}`, { method: 'DELETE' }),
    }

    const sessions = {
      list: () => request<WorkoutSession[]>('/api/workout-sessions'),
      get: (id: string) => request<WorkoutSession>(`/api/workout-sessions/${id}`),
      create: (data: CreateWorkoutSessionRequest) => request<WorkoutSession>('/api/workout-sessions', { method: 'POST', body: json(data) }),
      update: (id: string, data: UpdateWorkoutSessionRequest) => request<WorkoutSession>(`/api/workout-sessions/${id}`, { method: 'PUT', body: json(data) }),
      finish: (id: string) => request<WorkoutSession>(`/api/workout-sessions/${id}/finish`, { method: 'POST' }),
      reopen: (id: string) => request<WorkoutSession>(`/api/workout-sessions/${id}/reopen`, { method: 'POST' }),
      repeat: (id: string, data: CreateWorkoutSessionRequest) => request<WorkoutSession>(`/api/workout-sessions/${id}/repeat`, { method: 'POST', body: json(data) }),
      remove: (id: string) => request<void>(`/api/workout-sessions/${id}`, { method: 'DELETE' }),
    }

    const sessionExercises = {
      list: (sessionId: string) => request<WorkoutSessionExercise[]>(`/api/workout-sessions/${sessionId}/exercises`),
      get: (sessionId: string, entryId: string) => request<WorkoutSessionExercise>(`/api/workout-sessions/${sessionId}/exercises/${entryId}`),
      add: (sessionId: string, data: CreateWorkoutSessionExerciseRequest) => request<WorkoutSessionExercise>(`/api/workout-sessions/${sessionId}/exercises`, { method: 'POST', body: json(data) }),
      update: (sessionId: string, entryId: string, data: UpdateWorkoutSessionExerciseRequest) => request<WorkoutSessionExercise>(`/api/workout-sessions/${sessionId}/exercises/${entryId}`, { method: 'PUT', body: json(data) }),
      remove: (sessionId: string, entryId: string) => request<void>(`/api/workout-sessions/${sessionId}/exercises/${entryId}`, { method: 'DELETE' }),
    }

    const sets = {
      list: (sessionId: string, entryId: string) => request<WorkoutSet[]>(`/api/workout-sessions/${sessionId}/exercises/${entryId}/sets`),
      get: (sessionId: string, entryId: string, setId: string) => request<WorkoutSet>(`/api/workout-sessions/${sessionId}/exercises/${entryId}/sets/${setId}`),
      create: (sessionId: string, entryId: string, data: CreateWorkoutSetRequest) => request<WorkoutSet>(`/api/workout-sessions/${sessionId}/exercises/${entryId}/sets`, { method: 'POST', body: json(data) }),
      update: (sessionId: string, entryId: string, setId: string, data: UpdateWorkoutSetRequest) => request<WorkoutSet>(`/api/workout-sessions/${sessionId}/exercises/${entryId}/sets/${setId}`, { method: 'PUT', body: json(data) }),
      remove: (sessionId: string, entryId: string, setId: string) => request<void>(`/api/workout-sessions/${sessionId}/exercises/${entryId}/sets/${setId}`, { method: 'DELETE' }),
    }

    async function getSessionDetail(sessionId: string): Promise<WorkoutSessionDetail> {
      const [session, exercises] = await Promise.all([sessions.get(sessionId), sessionExercises.list(sessionId)])
      const detailedExercises: WorkoutExerciseDetail[] = await Promise.all(
        exercises.map(async (exercise) => ({
          ...exercise,
          sets: await sets.list(sessionId, exercise.id),
        })),
      )
      detailedExercises.sort((a, b) => a.sortOrder - b.sortOrder)
      return { ...session, exercises: detailedExercises }
    }

    return { categories, sessions, sessionExercises, sets, getSessionDetail }
  }, [apiFetch])
}

export type WorkoutApi = ReturnType<typeof useWorkoutApi>
