import type { DragEvent } from 'react'
import type { Importance, Task, Urgency } from '../types/task'
import { CheckIcon } from '../components/Icons'

interface MatrixPageProps {
  tasks: Task[]
  onMove: (id: string, importance: Importance, urgency: Urgency) => void
  onToggle: (id: string) => void
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
    id: 'q1',
    label: 'Q1',
    title: 'Do now',
    hint: 'Important · Urgent',
    importance: 'high',
    urgency: 'high',
    color: 'border-rose-200 bg-rose-50/50 text-rose-700',
  },
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
    id: 'q3',
    label: 'Q3',
    title: 'Delegate',
    hint: 'Not important · Urgent',
    importance: 'low',
    urgency: 'high',
    color: 'border-amber-200 bg-amber-50/60 text-amber-700',
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
]

export function MatrixPage({ tasks, onMove, onToggle }: MatrixPageProps) {
  const handleDrop = (
    event: DragEvent<HTMLElement>,
    importance: Importance,
    urgency: Urgency,
  ) => {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/task-id')
    if (taskId) onMove(taskId, importance, urgency)
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-medium text-moss-700">Focus by impact</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Eisenhower Matrix</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Drag any task to another quadrant to change its importance and urgency.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-slate-700">{task.title}</p>
                      {task.dueDate && <p className="mt-1 text-[11px] text-slate-400">Due {task.dueDate}</p>}
                    </div>
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
  )
}
