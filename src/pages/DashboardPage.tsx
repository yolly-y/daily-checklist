import { useState } from 'react'
import { ProgressCard } from '../components/ProgressCard'
import { TaskForm } from '../components/TaskForm'
import { TaskSection } from '../components/TaskSection'
import type { Tag } from '../types/productivity'
import type { NewTask, Task } from '../types/task'
import { getTodayKey } from '../utils/date'

interface DashboardPageProps {
  tasks: Task[]
  tags: Tag[]
  onAdd: (task: NewTask) => void
  onOpenComposer: () => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function DashboardPage({
  tasks,
  tags,
  onAdd,
  onOpenComposer,
  onToggle,
  onDelete,
  onEdit,
}: DashboardPageProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const today = getTodayKey()
  const dailyTasks = tasks.filter(
    (task) =>
      task.dueDate === today ||
      (!task.dueDate && task.taskType === 'daily') ||
      (task.status !== 'completed' && Boolean(task.dueDate && task.dueDate < today)),
  )
  const visibleTasks = selectedTag
    ? dailyTasks.filter((task) => task.tags.includes(selectedTag))
    : dailyTasks
  const activeTasks = visibleTasks.filter((task) => task.status !== 'completed')
  const completedTasks = visibleTasks.filter((task) => task.status === 'completed')

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)] xl:items-start">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-moss-700">Make today count</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
              Today’s tasks
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Focus on what matters now. Overdue tasks stay visible until you complete or reschedule them.
            </p>
          </div>
          <button type="button" onClick={onOpenComposer} className="shrink-0 rounded-2xl border border-moss-200 bg-moss-50 px-4 py-2.5 text-sm font-semibold text-moss-700 transition hover:bg-moss-100">
            Add with details
          </button>
        </div>

        <TaskForm onAdd={onAdd} />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSelectedTag(null)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedTag === null ? 'bg-ink text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>All</button>
            {tags.map((tag) => (
              <button key={tag.id} type="button" onClick={() => setSelectedTag(tag.id)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedTag === tag.id ? 'shadow-sm' : 'border-slate-200 bg-white'}`} style={{ borderColor: selectedTag === tag.id ? tag.color : undefined, color: selectedTag === tag.id ? tag.color : '#64748b', backgroundColor: selectedTag === tag.id ? `${tag.color}10` : undefined }}>{tag.name}</button>
            ))}
          </div>
        )}

        <TaskSection title="To do" count={activeTasks.length} tasks={activeTasks} tags={tags} emptyMessage="Your list is clear — add a task when you’re ready." onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        <TaskSection title="Completed" count={completedTasks.length} tasks={completedTasks} tags={tags} emptyMessage="Completed tasks will appear here." completed onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      </div>

      <aside className="xl:sticky xl:top-8">
        <ProgressCard completed={completedTasks.length} total={visibleTasks.length} />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"><p className="text-2xl font-semibold text-ink">{activeTasks.length}</p><p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">Remaining</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"><p className="text-2xl font-semibold text-moss-700">{completedTasks.length}</p><p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">Completed</p></div>
        </div>
        <p className="mt-4 px-2 text-center text-xs leading-5 text-slate-400">Your tasks are saved privately in this browser.</p>
      </aside>
    </div>
  )
}
