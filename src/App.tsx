import { useState } from 'react'
import { Header } from './components/Header'
import { Navigation } from './components/Navigation'
import { TaskEditorModal } from './components/TaskEditorModal'
import { useProductivityStore } from './hooks/useProductivityStore'
import { CalendarPage } from './pages/CalendarPage'
import { DashboardPage } from './pages/DashboardPage'
import { GoalsPage } from './pages/GoalsPage'
import { HistoryPage } from './pages/HistoryPage'
import { MatrixPage } from './pages/MatrixPage'
import { SettingsPage } from './pages/SettingsPage'
import type { AppPage } from './types/productivity'
import type { Importance, NewTask, Task, Urgency } from './types/task'
import { getTodayKey } from './utils/date'

const createTaskId = () => {
  if ('randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function App() {
  const { tasks, setTasks, goals, setGoals, tags, setTags, history } = useProductivityStore()
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultGoalId, setDefaultGoalId] = useState<string | null>(null)
  const [defaultDueDate, setDefaultDueDate] = useState<string | null>(null)
  const today = new Date()

  const saveTask = (input: NewTask, id?: string) => {
    if (id) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task.id !== id) return task
          const nextStatus = input.status || task.status
          return {
            ...task,
            ...input,
            completedDate:
              nextStatus === 'completed'
                ? task.completedDate || getTodayKey()
                : null,
          }
        }),
      )
      setTaskModalOpen(false)
      setEditingTask(null)
      return
    }

    const priority = input.priority
    const newTask: Task = {
      id: createTaskId(),
      title: input.title,
      description: input.description || '',
      status: input.status || 'todo',
      importance: input.importance || (priority === 'high' ? 'high' : 'low'),
      urgency: input.urgency || (priority === 'low' ? 'low' : 'high'),
      priority,
      tags: input.tags || [],
      createdDate: new Date().toISOString(),
      dueDate: input.dueDate === undefined ? getTodayKey() : input.dueDate,
      completedDate: input.status === 'completed' ? getTodayKey() : null,
      taskType: input.taskType || 'daily',
      goalId: input.goalId || null,
    }

    setTasks((currentTasks) => [newTask, ...currentTasks])
    setTaskModalOpen(false)
  }

  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === 'completed' ? 'todo' : 'completed',
              completedDate: task.status === 'completed' ? null : getTodayKey(),
            }
          : task,
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  const createTag = (name: string, color: string) => {
    setTags((currentTags) => [
      ...currentTags,
      { id: createTaskId(), name, color, createdDate: new Date().toISOString() },
    ])
  }

  const updateTag = (id: string, name: string, color: string) => {
    setTags((currentTags) =>
      currentTags.map((tag) => (tag.id === id ? { ...tag, name, color } : tag)),
    )
  }

  const deleteTag = (id: string) => {
    setTags((currentTags) => currentTags.filter((tag) => tag.id !== id))
    setTasks((currentTasks) =>
      currentTasks.map((task) => ({ ...task, tags: task.tags.filter((tagId) => tagId !== id) })),
    )
  }

  const createGoal = (name: string, description: string, deadline: string | null) => {
    setGoals((currentGoals) => [
      ...currentGoals,
      {
        id: createTaskId(),
        name,
        description,
        deadline,
        status: 'active',
        createdDate: new Date().toISOString(),
      },
    ])
  }

  const updateGoalStatus = (id: string, status: 'active' | 'paused' | 'completed') => {
    setGoals((currentGoals) =>
      currentGoals.map((goal) => (goal.id === id ? { ...goal, status } : goal)),
    )
  }

  const deleteGoal = (id: string) => {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id))
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.goalId === id ? { ...task, goalId: null } : task)),
    )
  }

  const moveTaskInMatrix = (id: string, importance: Importance, urgency: Urgency) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, importance, urgency } : task,
      ),
    )
  }

  const moveTaskDate = (id: string, dueDate: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, dueDate } : task)),
    )
  }

  const renderPage = () => {
    if (currentPage === 'dashboard') {
      return (
        <DashboardPage
          tasks={tasks}
          tags={tags}
          onAdd={saveTask}
          onOpenComposer={() => {
            setEditingTask(null)
            setDefaultGoalId(null)
            setDefaultDueDate(null)
            setTaskModalOpen(true)
          }}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={(task) => {
            setEditingTask(task)
            setDefaultDueDate(null)
            setTaskModalOpen(true)
          }}
        />
      )
    }

    if (currentPage === 'matrix') {
      return <MatrixPage tasks={tasks} onMove={moveTaskInMatrix} onToggle={toggleTask} />
    }

    if (currentPage === 'calendar') {
      return (
        <CalendarPage
          tasks={tasks}
          onCreateAtDate={(date) => {
            setEditingTask(null)
            setDefaultGoalId(null)
            setDefaultDueDate(date)
            setTaskModalOpen(true)
          }}
          onMoveDate={moveTaskDate}
          onEditTask={(task) => {
            setEditingTask(task)
            setDefaultGoalId(null)
            setDefaultDueDate(null)
            setTaskModalOpen(true)
          }}
          onToggleTask={toggleTask}
        />
      )
    }

    if (currentPage === 'goals') {
      return (
        <GoalsPage
          goals={goals}
          tasks={tasks}
          onCreate={createGoal}
          onStatusChange={updateGoalStatus}
          onDelete={deleteGoal}
          onAddTask={(goalId) => {
            setEditingTask(null)
            setDefaultGoalId(goalId)
            setDefaultDueDate(null)
            setTaskModalOpen(true)
          }}
          onToggleTask={toggleTask}
          onEditTask={(task) => {
            setEditingTask(task)
            setDefaultGoalId(null)
            setDefaultDueDate(null)
            setTaskModalOpen(true)
          }}
        />
      )
    }

    if (currentPage === 'history') {
      return <HistoryPage history={history} />
    }

    if (currentPage === 'settings') {
      return (
        <SettingsPage
          tags={tags}
          onCreate={createTag}
          onUpdate={updateTag}
          onDelete={deleteTag}
        />
      )
    }

    return (
      <div className="grid min-h-[55vh] place-items-center rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center shadow-card">
        <div>
          <p className="text-sm font-medium text-moss-700">Next workspace</p>
          <h2 className="mt-2 text-3xl font-semibold capitalize text-ink">{currentPage}</h2>
          <p className="mt-2 text-sm text-slate-500">This area is being connected to your productivity data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] pb-24 text-ink lg:pb-0">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(155,200,168,0.22),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(186,230,253,0.24),_transparent_35%)]" />
      <div className="relative lg:grid lg:grid-cols-[230px_minmax(0,1fr)]">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="min-w-0 px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
          <div className="mx-auto max-w-6xl">
            <Header date={today} />
            <div className="mt-8">{renderPage()}</div>
            <footer className="mt-12 border-t border-slate-200/70 pt-6 text-center text-xs text-slate-400">
              Small steps, thoughtfully completed.
            </footer>
          </div>
        </main>
      </div>
      {taskModalOpen && (
        <TaskEditorModal
          key={editingTask?.id || 'new-task'}
          task={editingTask}
          defaultDueDate={defaultDueDate}
          defaultGoalId={defaultGoalId}
          tags={tags}
          goals={goals}
          onClose={() => {
            setTaskModalOpen(false)
            setEditingTask(null)
            setDefaultGoalId(null)
            setDefaultDueDate(null)
          }}
          onSave={saveTask}
        />
      )}
    </div>
  )
}

export default App
