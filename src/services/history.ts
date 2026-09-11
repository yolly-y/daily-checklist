import type { DailyHistory, HistoryTaskSnapshot } from '../types/productivity'
import type { Task } from '../types/task'

const toSnapshot = (task: Task): HistoryTaskSnapshot => ({
  id: task.id,
  title: task.title,
  dueDate: task.dueDate,
})

export function buildDailyHistory(tasks: Task[], date: string): DailyHistory | null {
  const relevantTasks = tasks.filter(
    (task) =>
      task.dueDate === date ||
      task.completedDate === date ||
      (task.status !== 'completed' && Boolean(task.dueDate && task.dueDate < date)) ||
      (task.taskType === 'daily' && task.createdDate.slice(0, 10) === date),
  )

  if (relevantTasks.length === 0) return null

  const completed = relevantTasks.filter(
    (task) => task.status === 'completed' && task.completedDate === date,
  )
  const unfinished = relevantTasks.filter((task) => task.status !== 'completed')
  const consideredCount = completed.length + unfinished.length
  const completionRate = consideredCount === 0 ? 0 : Math.round((completed.length / consideredCount) * 100)
  const impactBonus = Math.min(
    30,
    completed.reduce((score, task) => score + (task.importance === 'high' ? 10 : 5), 0),
  )

  return {
    date,
    completedTasks: completed.map(toSnapshot),
    unfinishedTasks: unfinished.map(toSnapshot),
    completionRate,
    productivityScore: Math.min(100, Math.round(completionRate * 0.7 + impactBonus)),
  }
}
