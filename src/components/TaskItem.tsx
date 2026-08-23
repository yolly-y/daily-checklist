import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Priority, Task } from '../types/task'
import { CheckIcon, EditIcon, TrashIcon } from './Icons'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, title: string, priority: Priority) => void
}

const priorityStyles: Record<Priority, string> = {
  high: 'bg-rose-50 text-rose-700 ring-rose-600/10',
  medium: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  low: 'bg-sky-50 text-sky-700 ring-sky-600/10',
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [priority, setPriority] = useState<Priority>(task.priority)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    onEdit(task.id, trimmedTitle, priority)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setTitle(task.title)
    setPriority(task.priority)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="rounded-2xl border border-moss-200 bg-moss-50/50 p-3">
        <form onSubmit={handleEdit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor={`edit-${task.id}`} className="sr-only">
            Edit task
          </label>
          <input
            ref={inputRef}
            id={`edit-${task.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={160}
            onKeyDown={(event) => {
              if (event.key === 'Escape') cancelEdit()
            }}
            className="min-w-0 flex-1 rounded-xl border border-moss-200 bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-4 focus:ring-moss-100"
          />
          <div className="flex gap-2">
            <select
              aria-label="Edit task priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
              className="min-w-0 flex-1 rounded-xl border border-moss-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:ring-4 focus:ring-moss-100 sm:flex-none"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss-800 disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="group flex items-center gap-3 rounded-2xl border border-transparent px-2 py-3 transition hover:border-slate-200 hover:bg-slate-50 sm:px-3">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition focus:outline-none focus:ring-4 focus:ring-moss-100 ${
          task.completed
            ? 'border-moss-600 bg-moss-600 text-white'
            : 'border-slate-300 bg-white text-transparent hover:border-moss-500'
        }`}
      >
        <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`break-words text-[15px] font-medium transition ${
            task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}
        >
          {task.title}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${priorityStyles[task.priority]}`}
      >
        {task.priority}
      </span>

      <div className="flex shrink-0 items-center sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
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
