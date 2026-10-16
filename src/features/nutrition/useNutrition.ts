import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  useNutritionApi,
} from './useNutritionApi'

import type {
  CreateManualNutritionLogInput,
  NutritionDailySummary,
  NutritionLog,
  NutritionTarget,
  SetNutritionTargetInput,
  UpdateNutritionLogInput,
} from './nutritionTypes'

export function useNutrition(
  date: string,
) {
  const {
    getLogs,
    getDailySummary,
    getWeekSummary,
    getTarget,
    createManualLog,
    updateLog,
    deleteLog,
    setTarget,
  } = useNutritionApi()

  const [
    logs,
    setLogs,
  ] =
    useState<NutritionLog[]>(
      [],
    )

  const [
    dailySummary,
    setDailySummary,
  ] =
    useState<NutritionDailySummary | null>(
      null,
    )

  const [
    weekSummary,
    setWeekSummary,
  ] = useState<
    NutritionDailySummary[]
  >([])

  const [
    target,
    setTargetState,
  ] =
    useState<NutritionTarget | null>(
      null,
    )

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    )

  const loadNutrition =
    useCallback(
      async () => {
        try {
          setIsLoading(true)
          setError(null)

          const [
            logsData,
            dailyData,
            weekData,
            targetData,
          ] =
            await Promise.all([
              getLogs(date),
              getDailySummary(
                date,
              ),
              getWeekSummary(
                date,
              ),
              getTarget(date),
            ])

          setLogs(
            logsData,
          )

          setDailySummary(
            dailyData,
          )

          setWeekSummary(
            weekData,
          )

          setTargetState(
            targetData,
          )
        } catch (error) {
          console.error(
            error,
          )

          setError(
            'Unable to load nutrition data.',
          )
        } finally {
          setIsLoading(
            false,
          )
        }
      },
      [
        date,
        getLogs,
        getDailySummary,
        getWeekSummary,
        getTarget,
      ],
    )

  useEffect(() => {
    void loadNutrition()
  }, [loadNutrition])

  const addManualLog =
    useCallback(
      async (
        input:
          CreateManualNutritionLogInput,
      ) => {
        const log =
          await createManualLog(
            input,
          )

        /*
         * Nutrition has several
         * derived values:
         *
         * logs
         * daily totals
         * weekly totals
         *
         * Reloading keeps all of
         * them consistent.
         */
        await loadNutrition()

        return log
      },
      [
        createManualLog,
        loadNutrition,
      ],
    )

  const saveLog =
    useCallback(
      async (
        id: number,
        input:
          UpdateNutritionLogInput,
      ) => {
        const log =
          await updateLog(
            id,
            input,
          )

        await loadNutrition()

        return log
      },
      [
        updateLog,
        loadNutrition,
      ],
    )

  const removeLog =
    useCallback(
      async (
        id: number,
      ) => {
        await deleteLog(id)

        await loadNutrition()
      },
      [
        deleteLog,
        loadNutrition,
      ],
    )

  const saveTarget =
    useCallback(
      async (
        input:
          SetNutritionTargetInput,
      ) => {
        const savedTarget =
          await setTarget(
            input,
          )

        await loadNutrition()

        return savedTarget
      },
      [
        setTarget,
        loadNutrition,
      ],
    )

  return {
    logs,
    dailySummary,
    weekSummary,
    target,

    isLoading,
    error,

    loadNutrition,

    addManualLog,
    saveLog,
    removeLog,
    saveTarget,
  }
}