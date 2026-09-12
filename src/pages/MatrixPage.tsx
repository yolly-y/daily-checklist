import { useState, type DragEvent, type FormEvent } from 'react'
import type { Importance, NewTask, Task, Urgency } from '../types/task'
import { CheckIcon, EditIcon, PlusIcon, TrashIcon } from '../components/Icons'

interface MatrixPageProps {
  tasks: Task[]
  onAdd: (task: NewTask) => void
  onOpenComposer: (importance: Importance, urgency: Urgency) => void
  onMove: (id: string, importance: Importance, urgency: Urgency) => void
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const quadrants: Array<{
  id: string
  label: string
  title: string
  hint: string
  importance: Importance
  urgency: Urgency
  color: string
}> = [
  {
    id: 'q2',
    label: 'Q2',
    title: 'Plan',
    hint: 'Important · Not urgent',
    importance: 'high',
    urgency: 'low',
    color: 'border-moss-200 bg-moss-50/70 text-moss-700',
  },
  {
    id: 'q1',
    label: 'Q1',
    title: 'Do now',
    hint: 'Important · Urgent',
    importance: 'high',
    urgency: 'high',
    color: 'border-rose-200 bg-rose-50/50 text-rose-700',
  },
  {
    id: 'q4',
    label: 'Q4',
    title: 'Eliminate',
    hint: 'Not important · Not urgent',
    importance: 'low',
    urgency: 'low',
    color: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  {
    id: 'q3',
    label: 'Q3',
    title: 'Delegate',
    hint: 'Not important · Urgent',
    importance: 'low',
    urgency: 'high',
    color: 'border-amber-200 bg-amber-50/60 text-amber-700',
  },
]

export function MatrixPage({ tasks, onAdd, onOpenComposer, onMove, onToggle, onEdit, onDelete }: MatrixPageProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const handleDrop = (
    event: DragEvent<HTMLElement>,
    importance: Importance,
    urgency: Urgency,
  ) => {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/task-id')
    if (taskId) onMove(taskId, importance, urgency)
  }

  const handleAdd = (event: FormEvent<HTMLFormElement>, quadrant: (typeof quadrants)[number]) => {
    event.preventDefault()
    const title = drafts[quadrant.id]?.trim()
    if (!title) return

    onAdd({
      title,
      importance: quadrant.importance,
      urgency: quadrant.urgency,
      priority:
        quadrant.importance === 'high' && quadrant.urgency === 'high'
          ? 'high'
          : quadrant.importance === 'low' && quadrant.urgency === 'low'
            ? 'low'
            : 'medium',
      taskType: 'daily',
    })
    setDrafts((current) => ({ ...current, [quadrant.id]: '' }))
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-medium text-moss-700">Your command center</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Dashboard</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Capture tasks directly in the right quadrant, then drag them as priorities change.
        </p>
      </div>

      <div className="relative rounded-[2rem] border border-slate-200/80 bg-white/55 p-3 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center justify-center gap-5 rounded-2xl bg-slate-50 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 md:hidden">
          <span>↑ Importance</span><span className="h-4 w-px bg-slate-300" /><span>Urgency →</span>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-3 z-10 hidden -translate-x-1/2 text-lg font-semibold text-moss-700 md:block">↑</div>
        <div className="pointer-events-none absolute bottom-1/2 left-1/2 top-8 z-10 hidden w-px -translate-x-1/2 bg-slate-400 md:block" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 z-10 hidden -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap rounded-full bg-[#f7f8f6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-moss-700 md:block">Importance</div>

        <div className="pointer-events-none absolute left-1/2 right-8 top-1/2 z-10 hidden h-px -translate-y-1/2 bg-slate-400 md:block" />
        <div className="pointer-events-none absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 text-lg font-semibold text-moss-700 md:block">→</div>
        <div className="pointer-events-none absolute left-3/4 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f8f6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-moss-700 md:block">Urgency</div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-moss-700 shadow-sm md:block" aria-hidden="true" />

        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-x-10 md:gap-y-10">
        {quadrants.map((quadrant) => {
          const quadrantTasks = tasks.filter(
            (task) =>
              task.status !== 'completed' &&
              task.importance === quadrant.importance &&
              task.urgency === quadrant.urgency,
          )

          return (
            <section
              key={quadrant.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, quadrant.importance, quadrant.urgency)}
              className="min-h-72 rounded-3xl border border-slate-200 bg-white p-4 shadow-card sm:p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-lg border px-2 py-1 text-[11px] font-bold ${quadrant.color}`}>
                      {quadrant.label}
                    </span>
                    <h3 className="font-semibold text-ink">{quadrant.title}</h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{quadrant.hint}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  {quadrantTasks.length}
                </span>
              </div>

              <form onSubmit={(event) => handleAdd(event, quadrant)} className="mb-4 flex gap-2">
                <input
                  value={drafts[quadrant.id] || ''}
                  onChange={(event) => setDrafts((current) => ({ ...current, [quadrant.id]: event.target.value }))}
                  placeholder={`Add to ${quadrant.title.toLowerCase()}…`}
                  maxLength={160}
                  aria-label={`Add a task to ${quadrant.title}`}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-moss-300 focus:bg-white focus:ring-4 focus:ring-moss-100"
                />
                <button
                  type="submit"
                  disabled={!drafts[quadrant.id]?.trim()}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:bg-moss-800 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <PlusIcon className="h-3.5 w-3.5" /> Add
                </button>
              </form>
              <button type="button" onClick={() => onOpenComposer(quadrant.importance, quadrant.urgency)} className="mb-4 -mt-2 text-xs font-semibold text-moss-700 hover:text-moss-900">
                Set schedule & details →
              </button>

              <div className="space-y-2">
                {quadrantTasks.map((task) => (
                  <article
                    key={task.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/task-id', task.id)
                      event.dataTransfer.effectAllowed = 'move'
                    }}
                    className="group flex cursor-grab items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(task.id)}
                      aria-label={`Complete ${task.title}`}
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-slate-300 text-transparent transition hover:border-moss-500 hover:text-moss-500"
                    >
                      <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <button type="button" onClick={() => onEdit(task)} className="break-words text-left text-sm font-medium text-slate-700 hover:text-moss-700">{task.title}</button>
                      {task.recurrence !== 'none' ? (
                        <p className="mt-1 text-[11px] capitalize text-moss-600">{task.recurrence} · {task.recurrenceStart} → {task.recurrenceEnd}</p>
                      ) : task.dueDate ? (
                        <p className="mt-1 text-[11px] text-slate-400">Due {task.dueDate}</p>
                      ) : null}
                    </div>
                    <button type="button" onClick={() => onEdit(task)} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-moss-700 group-hover:opacity-100 focus:opacity-100" aria-label={`Edit ${task.title}`}><EditIcon className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => onDelete(task.id)} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 focus:opacity-100" aria-label={`Delete ${task.title}`}><TrashIcon className="h-3.5 w-3.5" /></button>
                  </article>
                ))}
                {quadrantTasks.length === 0 && (
                  <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center text-xs leading-5 text-slate-400">
                    Drop tasks here
                  </div>
                )}
              </div>
            </section>
          )
        })}
        </div>
      </div>
    </div>
  )
}
