import { useMemo } from 'react'
import { Header } from './components/Header'
import { ProgressCard } from './components/ProgressCard'
import { TaskForm } from './components/TaskForm'
import { TaskSection } from './components/TaskSection'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { NewTask, Priority, Task } from './types/task'

const STORAGE_KEY = 'daily-checklist-tasks-v1'

const createTaskId = () => {
  if ('randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, [])
  const today = new Date()

  const { activeTasks, completedTasks } = useMemo(
    () => ({
      activeTasks: tasks.filter((task) => !task.completed),
      completedTasks: tasks.filter((task) => task.completed),
    }),
    [tasks],
  )

  const addTask = ({ title, priority }: NewTask) => {
    const newTask: Task = {
      id: createTaskId(),
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((currentTasks) => [newTask, ...currentTasks])
  }

  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const editTask = (id: string, title: string, priority: Priority) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, title, priority } : task,
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-ink">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(155,200,168,0.22),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(186,230,253,0.24),_transparent_35%)]" />

      <main className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Header date={today} />

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)] lg:items-start">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-moss-700">Make today count</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
                What’s on your list?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Capture your priorities, keep moving, and enjoy the satisfaction of a clear list.
              </p>
            </div>

            <TaskForm onAdd={addTask} />

            <div className="space-y-5">
              <TaskSection
                title="To do"
                count={activeTasks.length}
                tasks={activeTasks}
                emptyMessage="Your list is clear — add a task when you’re ready."
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
              />
              <TaskSection
                title="Completed"
                count={completedTasks.length}
                tasks={completedTasks}
                emptyMessage="Completed tasks will appear here."
                completed
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-8">
            <ProgressCard completed={completedTasks.length} total={tasks.length} />
            <p className="mt-4 px-2 text-center text-xs leading-5 text-slate-400">
              Your tasks are saved privately in this browser.
            </p>
          </aside>
        </div>

        <footer className="mt-12 border-t border-slate-200/70 pt-6 text-center text-xs text-slate-400">
          Small steps, thoughtfully completed.
        </footer>
      </main>
    </div>
  )
}

export default App
