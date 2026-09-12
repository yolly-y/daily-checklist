import { useState, type FormEvent } from 'react'
import type { Goal } from '../types/productivity'
import type { Task } from '../types/task'
import { formatFriendlyDate } from '../utils/date'
import { CheckIcon, PlusIcon, TargetIcon, TrashIcon } from '../components/Icons'

interface GoalsPageProps {
  goals: Goal[]
  tasks: Task[]
  onCreate: (name: string, description: string, deadline: string | null) => void
  onStatusChange: (id: string, status: Goal['status']) => void
  onCompletionCountChange: (id: string, change: number) => void
  onDelete: (id: string) => void
  onAddTask: (goalId: string) => void
  onToggleTask: (id: string) => void
  onEditTask: (task: Task) => void
}

export function GoalsPage({
  goals,
  tasks,
  onCreate,
  onStatusChange,
  onCompletionCountChange,
  onDelete,
  onAddTask,
  onToggleTask,
  onEditTask,
}: GoalsPageProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim(), description.trim(), deadline || null)
    setName('')
    setDescription('')
    setDeadline('')
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-moss-700">Think beyond today</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Long-term goals</h2>
          <p className="mt-2 text-sm text-slate-500">Turn meaningful outcomes into visible, manageable steps.</p>
        </div>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          <PlusIcon className="h-4 w-4" /> New goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5 rounded-3xl border border-moss-200 bg-moss-50/60 p-5 shadow-card">
          <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr_180px_auto]">
            <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Goal name" maxLength={100} className="rounded-xl border border-moss-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-moss-100" />
            <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Why does this matter?" maxLength={240} className="rounded-xl border border-moss-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-moss-100" />
            <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="rounded-xl border border-moss-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:ring-4 focus:ring-moss-100" />
            <button type="submit" disabled={!name.trim()} className="rounded-xl bg-moss-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Create</button>
          </div>
        </form>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {goals.map((goal) => {
          const goalTasks = tasks.filter((task) => task.goalId === goal.id)
          const completedCount = goalTasks.filter((task) => task.status === 'completed').length
          const progress = goalTasks.length === 0 ? 0 : Math.round((completedCount / goalTasks.length) * 100)

          return (
            <article key={goal.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-moss-50 text-moss-700"><TargetIcon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-lg font-semibold text-ink">{goal.name}</h3>
                  {goal.description && <p className="mt-1 text-sm leading-5 text-slate-500">{goal.description}</p>}
                  {goal.deadline && <p className="mt-2 text-xs text-slate-400">Target · {formatFriendlyDate(goal.deadline)}</p>}
                </div>
                <button type="button" onClick={() => onDelete(goal.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${goal.name}`}><TrashIcon className="h-4 w-4" /></button>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500"><span>{completedCount}/{goalTasks.length} milestones</span><span>{progress}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-moss-500 transition-[width]" style={{ width: `${progress}%` }} /></div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-moss-100 bg-moss-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-moss-600">Completed</p>
                  <p className="mt-1 text-2xl font-semibold text-ink">{goal.completionCount} <span className="text-sm font-medium text-slate-500">times</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={goal.completionCount === 0} onClick={() => onCompletionCountChange(goal.id, -1)} className="grid h-10 w-10 place-items-center rounded-xl border border-moss-200 bg-white text-lg font-semibold text-moss-700 disabled:opacity-35" aria-label={`Remove one completion from ${goal.name}`}>−</button>
                  <button type="button" onClick={() => onCompletionCountChange(goal.id, 1)} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-moss-700 px-4 text-xs font-semibold text-white hover:bg-moss-800" aria-label={`Record one completion for ${goal.name}`}><PlusIcon className="h-3.5 w-3.5" /> Record completion</button>
                </div>
              </div>

              <div className="mt-5 space-y-1 border-t border-slate-100 pt-4">
                {goalTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="group flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-slate-50">
                    <button type="button" onClick={() => onToggleTask(task.id)} className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${task.status === 'completed' ? 'border-moss-600 bg-moss-600 text-white' : 'border-slate-300 text-transparent'}`} aria-label={`Toggle ${task.title}`}><CheckIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => onEditTask(task)} className={`min-w-0 flex-1 truncate text-left text-sm ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{task.title}</button>
                  </div>
                ))}
                {goalTasks.length === 0 && <p className="py-3 text-center text-xs text-slate-400">No milestone tasks yet.</p>}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <select value={goal.status} onChange={(event) => onStatusChange(goal.id, event.target.value as Goal['status'])} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold capitalize text-slate-500 outline-none">
                  <option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option>
                </select>
                <button type="button" onClick={() => onAddTask(goal.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-moss-50 hover:text-moss-700"><PlusIcon className="h-3.5 w-3.5" /> Add milestone</button>
              </div>
            </article>
          )
        })}
      </div>

      {goals.length === 0 && (
        <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
          <div><TargetIcon className="mx-auto h-8 w-8 text-moss-400" /><h3 className="mt-3 font-semibold text-ink">Create your first long-term goal</h3><p className="mt-1 text-sm text-slate-400">Then connect daily actions to the outcome that matters.</p></div>
        </div>
      )}
    </div>
  )
}
