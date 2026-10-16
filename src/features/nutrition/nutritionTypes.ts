export type NutritionInputMethod =
  | 'Manual'
  | 'BarcodeScan'
  | 'AIAnalysis'

export type NutritionLog = {
  id: number

  foodName: string

  caloriesKcal: number
  carbsGrams: number
  proteinGrams: number
  fatGrams: number

  consumedDate: string
  consumedAt: string

  inputMethod: NutritionInputMethod

  createdAt: string
  updatedAt: string
}

export type NutritionTarget = {
  id: number

  dailyCaloriesKcal: number

  dailyProteinGrams: number | null
  dailyCarbsGrams: number | null
  dailyFatGrams: number | null

  effectiveFrom: string
  effectiveTo: string | null
}

export type NutritionDailySummary = {
  date: string

  caloriesKcal: number
  carbsGrams: number
  proteinGrams: number
  fatGrams: number

  targetCaloriesKcal: number | null
  targetCarbsGrams: number | null
  targetProteinGrams: number | null
  targetFatGrams: number | null
}

export type CreateManualNutritionLogInput = {
  foodName: string

  caloriesKcal: number
  carbsGrams: number
  proteinGrams: number
  fatGrams: number

  consumedAt: string
}

export type UpdateNutritionLogInput = {
  foodName: string

  caloriesKcal: number
  carbsGrams: number
  proteinGrams: number
  fatGrams: number

  consumedAt: string
}

export type SetNutritionTargetInput = {
  dailyCaloriesKcal: number

  dailyProteinGrams: number | null
  dailyCarbsGrams: number | null
  dailyFatGrams: number | null

  effectiveFrom: string
}