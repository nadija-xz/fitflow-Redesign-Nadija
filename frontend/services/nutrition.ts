import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'] as const;
export type MealType = (typeof mealTypes)[number];
export type Meal = { id: string; date: string; type: MealType; name: string; calories: number; protein: number; carbs: number; fat: number };
export type NutritionLog = { goal: number; meals: Meal[] };
export const emptyNutrition = (): NutritionLog => ({ goal: 2200, meals: [] });
const key = (userId: string) => `fitflow_nutrition_${encodeURIComponent(userId).replace(/%/g, '_')}`;
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function nutritionTotals(meals: Meal[]) {
  return meals.reduce((sum, meal) => ({ calories: sum.calories + meal.calories, protein: sum.protein + meal.protein, carbs: sum.carbs + meal.carbs, fat: sum.fat + meal.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}
export async function loadNutrition(userId: string): Promise<NutritionLog> {
  const raw = Platform.OS === 'web' ? localStorage.getItem(key(userId)) : await SecureStore.getItemAsync(key(userId));
  if (!raw) return emptyNutrition();
  const value = JSON.parse(raw);
  if (!Number.isInteger(value.goal) || value.goal <= 0 || !Array.isArray(value.meals) || !value.meals.every((meal: Meal) => typeof meal.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(meal.date) && mealTypes.includes(meal.type) && typeof meal.name === 'string' && ['calories', 'protein', 'carbs', 'fat'].every(field => typeof meal[field as keyof Meal] === 'number' && Number.isFinite(meal[field as keyof Meal]) && Number(meal[field as keyof Meal]) >= 0))) throw new Error('Invalid nutrition log');
  return value;
}
export async function saveNutrition(userId: string, log: NutritionLog) {
  const raw = JSON.stringify(log);
  if (Platform.OS === 'web') localStorage.setItem(key(userId), raw);
  else await SecureStore.setItemAsync(key(userId), raw);
}
