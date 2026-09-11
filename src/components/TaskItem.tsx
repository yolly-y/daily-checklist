import type { Tag } from '../types/productivity'
import type { Task } from '../types/task'
import { formatFriendlyDate } from '../utils/date'
import { CheckIcon, EditIcon, TrashIcon } from './Icons'

interface TaskItemProps {
  task: Task
  tags: Tag[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

const priorityStyles = {
  high: 'bg-rose-50 text-rose-700 ring-rose-600/10',
  medium: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  low: 'bg-sky-50 text-sky-700 ring-sky-600/10',
}

export function TaskItem({ task, tags, onToggle, onDelete, onEdit }: TaskItemProps) {
  const assignedTags = tags.filter((tag) => task.tags.includes(tag.id))
  const completed = task.status === 'completed'

  return (
    <li className="group flex items-start gap-3 rounded-2xl border border-transparent px-2 py-3 transition hover:border-slate-200 hover:bg-slate-50 sm:px-3">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition focus:outline-none focus:ring-4 focus:ring-moss-100 ${
          completed
            ? 'border-moss-600 bg-moss-600 text-white'
            : 'border-slate-300 bg-white text-transparent hover:border-moss-500'
        }`}
      >
        <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`break-words text-[15px] font-medium transition ${
            completed ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}
        >
          {task.title}
        </p>
        {(task.description || task.dueDate || assignedTags.length > 0) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {task.dueDate && (
              <span className="text-[11px] text-slate-400">{formatFriendlyDate(task.dueDate)}</span>
            )}
            {assignedTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ color: tag.color, backgroundColor: `${tag.color}14` }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${priorityStyles[task.priority]}`}
      >
        {task.priority}
      </span>

      <div className="flex shrink-0 items-center sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-white hover:text-moss-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-moss-200"
        >
          <EditIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-100"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  )
}
