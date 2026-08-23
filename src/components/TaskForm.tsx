import { useState, type FormEvent } from 'react'
import type { NewTask, Priority } from '../types/task'
import { PlusIcon } from './Icons'

interface TaskFormProps {
  onAdd: (task: NewTask) => void
}

const priorityOptions: Array<{ value: Priority; label: string; dot: string }> = [
  { value: 'high', label: 'High', dot: 'bg-rose-500' },
  { value: 'medium', label: 'Medium', dot: 'bg-amber-500' },
  { value: 'low', label: 'Low', dot: 'bg-sky-500' },
]

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) return

    onAdd({ title: trimmedTitle, priority })
    setTitle('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200/80 bg-white p-3 shadow-card sm:p-4"
    >
      <label htmlFor="new-task" className="sr-only">
        Add a new task
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="new-task"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          maxLength={160}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-2xl border border-transparent bg-slate-50 px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:border-moss-300 focus:bg-white focus:ring-4 focus:ring-moss-100"
        />

        <div className="flex gap-2">
          <label htmlFor="task-priority" className="sr-only">
            Priority
          </label>
          <div className="relative min-w-0 flex-1 sm:w-36 sm:flex-none">
            <span
              className={`pointer-events-none absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
                priorityOptions.find((option) => option.value === priority)?.dot
              }`}
            />
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
              className="h-full w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-8 pr-8 text-sm font-medium text-slate-600 outline-none transition focus:border-moss-300 focus:ring-4 focus:ring-moss-100"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              ▾
            </span>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-moss-800 focus:outline-none focus:ring-4 focus:ring-moss-200 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            <PlusIcon className="h-5 w-5" strokeWidth={2.2} />
            <span className="hidden xs:inline sm:inline">Add task</span>
          </button>
        </div>
      </div>
    </form>
  )
}
