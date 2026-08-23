import type { Priority, Task } from '../types/task'
import { CheckIcon } from './Icons'
import { TaskItem } from './TaskItem'

interface TaskSectionProps {
  title: string
  count: number
  tasks: Task[]
  emptyMessage: string
  completed?: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, title: string, priority: Priority) => void
}

export function TaskSection({
  title,
  count,
  tasks,
  emptyMessage,
  completed = false,
  onToggle,
  onDelete,
  onEdit,
}: TaskSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2 w-2 rounded-full ${completed ? 'bg-moss-500' : 'bg-amber-400'}`}
          />
          <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
          {count}
        </span>
      </div>

      {tasks.length > 0 ? (
        <ul className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      ) : (
        <div className="grid min-h-28 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
          <div>
            {completed && (
              <CheckIcon className="mx-auto mb-2 h-5 w-5 text-moss-500" strokeWidth={2.2} />
            )}
            <p className="text-sm text-slate-400">{emptyMessage}</p>
          </div>
        </div>
      )}
    </section>
  )
}
