import type { Task } from '../types/task'
import { toDateKey } from './date'

function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function daysBetween(start: string, end: string) {
  const startDate = fromDateKey(start)
  const endDate = fromDateKey(end)
  return Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000)
}

export function taskOccursOnDate(task: Task, dateKey: string) {
  if (task.recurrence === 'none') return task.dueDate === dateKey

  const start = task.recurrenceStart || task.dueDate
  const end = task.recurrenceEnd
  if (!start || dateKey < start || (end && dateKey > end)) return false

  if (task.recurrence === 'daily') return true
  if (task.recurrence === 'weekly') return daysBetween(start, dateKey) % 7 === 0

  return fromDateKey(start).getDate() === fromDateKey(dateKey).getDate()
}

export function getOccurrencesInRange(task: Task, rangeStart: Date, rangeEnd: Date) {
  const dates: string[] = []
  const cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate())
  const end = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate())

  for (let checked = 0; cursor < end && checked < 800; checked += 1) {
    const dateKey = toDateKey(cursor)
    if (taskOccursOnDate(task, dateKey)) dates.push(dateKey)
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

export function isTaskCompletedOnDate(task: Task, dateKey: string) {
  return task.recurrence === 'none'
    ? task.status === 'completed'
    : task.completedOccurrences.includes(dateKey)
}
