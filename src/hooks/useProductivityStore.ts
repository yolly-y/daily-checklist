import { useEffect, useState } from 'react'
import {
  readGoals,
  readHistory,
  readTags,
  readTasks,
  storageKeys,
  writeValue,
} from '../services/storage'
import type { DailyHistory, Goal, Tag } from '../types/productivity'
import type { Task } from '../types/task'
import { getTodayKey } from '../utils/date'
import { buildDailyHistory } from '../services/history'

export function useProductivityStore() {
  const [tasks, setTasks] = useState<Task[]>(readTasks)
  const [goals, setGoals] = useState<Goal[]>(readGoals)
  const [tags, setTags] = useState<Tag[]>(readTags)
  const [history, setHistory] = useState<DailyHistory[]>(readHistory)

  useEffect(() => writeValue(storageKeys.tasks, tasks), [tasks])
  useEffect(() => writeValue(storageKeys.goals, goals), [goals])
  useEffect(() => writeValue(storageKeys.tags, tags), [tags])
  useEffect(() => writeValue(storageKeys.history, history), [history])

  useEffect(() => {
    const todaySnapshot = buildDailyHistory(tasks, getTodayKey())
    if (!todaySnapshot) return

    setHistory((currentHistory) => {
      const existing = currentHistory.find((record) => record.date === todaySnapshot.date)
      if (existing && JSON.stringify(existing) === JSON.stringify(todaySnapshot)) {
        return currentHistory
      }

      return [
        ...currentHistory.filter((record) => record.date !== todaySnapshot.date),
        todaySnapshot,
      ].sort((a, b) => b.date.localeCompare(a.date))
    })
  }, [tasks])

  return {
    tasks,
    setTasks,
    goals,
    setGoals,
    tags,
    setTags,
    history,
    setHistory,
  }
}
