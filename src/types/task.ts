export const priorities = ['high', 'medium', 'low'] as const
export const taskStatuses = ['todo', 'in-progress', 'completed'] as const
export const taskTypes = ['daily', 'short-term', 'long-term'] as const
export const binaryLevels = ['high', 'low'] as const

export type Priority = (typeof priorities)[number]
export type TaskStatus = (typeof taskStatuses)[number]
export type TaskType = (typeof taskTypes)[number]
export type Importance = (typeof binaryLevels)[number]
export type Urgency = (typeof binaryLevels)[number]

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  importance: Importance
  urgency: Urgency
  priority: Priority
  tags: string[]
  createdDate: string
  dueDate: string | null
  completedDate: string | null
  taskType: TaskType
  goalId: string | null
}

export type NewTask = Pick<Task, 'title' | 'priority'> &
  Partial<
    Pick<
      Task,
      | 'description'
      | 'status'
      | 'importance'
      | 'urgency'
      | 'tags'
      | 'dueDate'
      | 'taskType'
      | 'goalId'
    >
  >

export type TaskUpdate = Omit<Task, 'id' | 'createdDate' | 'completedDate'>
