import { useEffect, useState } from 'react'
import { useWorkoutApi } from '../services/workoutApi'
import type { WorkoutSession, WorkoutSessionDetail, WorkoutSet } from '../types/workout'

type WorkoutHistory = {
  sessions: WorkoutSession[]
  completed: WorkoutSessionDetail[]
  isLoading: boolean
  error: string | null
  failedCount: number
}

/**
 * Fetch a bounded number of completed sessions for Quick Log and Insights.
 * Work is batched to avoid issuing hundreds of simultaneous requests.
 * Existing endpoints are used; the backend does not need analytics migrations.
 */
export function useWorkoutHistory(limit = 20, enabled = true): WorkoutHistory {
  const api = useWorkoutApi()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [completed, setCompleted] = useState<WorkoutSessionDetail[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [failedCount, setFailedCount] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      setError(null)
      setFailedCount(0)
      try {
        const all = await api.sessions.list()
        if (cancelled) return
        setSessions(all)
        const recent = all
          .filter((session) => session.status === 'Completed')
          .sort((a, b) => b.workoutDate.localeCompare(a.workoutDate) || b.createdAt.localeCompare(a.createdAt))
          .slice(0, limit)

        const details: WorkoutSessionDetail[] = []
        let failures = 0
        for (let start = 0; start < recent.length; start += 3) {
          const batch = await Promise.allSettled(
            recent.slice(start, start + 3).map((session) => api.getSessionDetail(session.id)),
          )
          if (cancelled) return
          for (const result of batch) {
            if (result.status === 'fulfilled') details.push(result.value)
            else failures += 1
          }
        }
        if (cancelled) return
        setCompleted(details)
        setFailedCount(failures)
        if (failures) setError(`${failures} past workout(s) could not be loaded. Results may be incomplete.`)
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load workout history.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [api, enabled, limit])

  return { sessions, completed, isLoading, error, failedCount }
}

/** Most recent logged set for a category, from a *completed* past workout. */
export function findLastLoggedSet(
  workouts: WorkoutSessionDetail[],
  categoryId: string,
): WorkoutSet | undefined {
  const ordered = [...workouts].sort(
    (a, b) => b.workoutDate.localeCompare(a.workoutDate) || b.createdAt.localeCompare(a.createdAt),
  )
  for (const workout of ordered) {
    for (const exercise of [...workout.exercises].reverse()) {
      if (exercise.workoutCategoryId !== categoryId) continue
      const last = [...exercise.sets]
        .filter((set) => set.isCompleted)
        .sort((a, b) => b.setNumber - a.setNumber)[0]
      if (last) return last
    }
  }
  return undefined
}
