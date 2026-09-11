import type { DailyHistory, Goal, Tag } from '../types/productivity'
import type { Priority, Task } from '../types/task'
import { getTodayKey } from '../utils/date'

export const storageKeys = {
  tasks: 'daily-checklist-tasks',
  goals: 'daily-checklist-goals',
  tags: 'daily-checklist-tags',
  history: 'daily-checklist-history',
  legacyTasks: 'daily-checklist-tasks-v1',
} as const

interface LegacyTask {
  id: string
  title: string
  priority?: Priority
  completed?: boolean
  createdAt?: string
}

function readValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeValue<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Keep the in-memory app usable if storage is blocked or full.
  }
}

function migrateLegacyTask(task: LegacyTask): Task {
  const createdDate = task.createdAt?.slice(0, 10) || getTodayKey()
  const completed = Boolean(task.completed)

  return {
    id: task.id,
    title: task.title,
    description: '',
    status: completed ? 'completed' : 'todo',
    importance: task.priority === 'high' ? 'high' : 'low',
    urgency: task.priority === 'low' ? 'low' : 'high',
    priority: task.priority || 'medium',
    tags: [],
    createdDate: task.createdAt || new Date().toISOString(),
    dueDate: createdDate,
    completedDate: completed ? createdDate : null,
    taskType: 'daily',
    goalId: null,
  }
}

export function readTasks(): Task[] {
  const existingTasks = readValue<Task[] | null>(storageKeys.tasks, null)
  if (existingTasks) return existingTasks

  const legacyTasks = readValue<LegacyTask[]>(storageKeys.legacyTasks, [])
  const migratedTasks = legacyTasks.map(migrateLegacyTask)
  if (migratedTasks.length > 0) writeValue(storageKeys.tasks, migratedTasks)
  return migratedTasks
}

export const readGoals = () => readValue<Goal[]>(storageKeys.goals, [])
export const readTags = () => readValue<Tag[]>(storageKeys.tags, [])
export const readHistory = () => readValue<DailyHistory[]>(storageKeys.history, [])
