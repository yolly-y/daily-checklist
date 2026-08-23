export const priorities = ['high', 'medium', 'low'] as const

export type Priority = (typeof priorities)[number]

export interface Task {
  id: string
  title: string
  priority: Priority
  completed: boolean
  createdAt: string
}

export type NewTask = Pick<Task, 'title' | 'priority'>
