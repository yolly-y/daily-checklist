export interface Goal {
  id: string
  name: string
  description: string
  deadline: string | null
  status: 'active' | 'paused' | 'completed'
  createdDate: string
  completionCount: number
}

export interface Tag {
  id: string
  name: string
  color: string
  createdDate: string
}

export interface HistoryTaskSnapshot {
  id: string
  title: string
  dueDate: string | null
}

export interface DailyHistory {
  date: string
  completedTasks: HistoryTaskSnapshot[]
  unfinishedTasks: HistoryTaskSnapshot[]
  completionRate: number
  productivityScore: number
}

export type AppPage = 'dashboard' | 'calendar' | 'goals' | 'tags' | 'history'
