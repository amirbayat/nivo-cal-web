export interface User {
  id: string
  phone: string
  name: string | null
  role: 'USER' | 'ADMIN'
  isActive: boolean
}

export type NivoCalGender = 'MALE' | 'FEMALE'
export type NivoCalActivityLevel = 'SEDENTARY' | 'LIGHT' | 'ACTIVE' | 'VERY_ACTIVE'
export type NivoCalGoal = 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_WEIGHT'

export interface NutritionProfile {
  id: string
  userId: string
  gender: NivoCalGender
  age: number
  heightCm: number
  activityLevel: NivoCalActivityLevel
  goal: NivoCalGoal
  goalPaceLevel: number
  dailyCalorieTarget: number
  proteinTargetG: number
  carbsTargetG: number
  fatTargetG: number
  createdAt: string
  updatedAt: string
}

export interface CreateNutritionProfileInput {
  gender: NivoCalGender
  age: number
  heightCm: number
  weightKg: number
  activityLevel: NivoCalActivityLevel
  goal: NivoCalGoal
  goalPaceLevel?: number
}

export interface NivoCalFoodItem {
  nameFa: string
  portionEstimate: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  fiberG: number | null
  sugarG: number | null
}

export interface NivoCalScanResult {
  isFood: boolean
  confidence: 'high' | 'medium' | 'low'
  items: NivoCalFoodItem[]
  totalCalories: number
  healthScore: 'healthy' | 'moderate' | 'unhealthy'
  healthNotes: string[]
}

export interface NivoCalLog extends NivoCalScanResult {
  id: string
  imageUrl: string
  note?: string | null
  createdAt: string
}

export interface WeightLogEntry {
  id: string
  weightKg: number
  createdAt: string
  deltaKg: number | null
}

export interface WeightTrend {
  points: { date: string; weightKg: number }[]
  deltaKg: number
  periodDays: number
}

export interface WeeklyAdherenceDay {
  date: string
  consumedCalories: number
  targetCalories: number
  status: 'under' | 'onTarget' | 'over' | 'noData'
}

export interface NivoCalDailySummary {
  profile: NutritionProfile
  consumed: { calories: number; proteinG: number; carbsG: number; fatG: number }
  remainingCalories: number
  meals: NivoCalLog[]
  weightTrend: WeightTrend
  streakDays: number
  weeklyAdherence: WeeklyAdherenceDay[]
}
