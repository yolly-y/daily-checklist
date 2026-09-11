import { useState, type FormEvent } from 'react'
import type { Goal, Tag } from '../types/productivity'
import type {
  Importance,
  NewTask,
  Priority,
  Task,
  TaskStatus,
  TaskType,
  Urgency,
} from '../types/task'
import { getTodayKey } from '../utils/date'

interface TaskEditorModalProps {
  task?: Task | null
  defaultDueDate?: string | null
  defaultGoalId?: string | null
  tags: Tag[]
  goals: Goal[]
  onClose: () => void
  onSave: (task: NewTask, id?: string) => void
}

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-moss-300 focus:ring-4 focus:ring-moss-100'

export function TaskEditorModal({
  task,
  defaultDueDate,
  defaultGoalId,
  tags,
  goals,
  onClose,
  onSave,
}: TaskEditorModalProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo')
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium')
  const [importance, setImportance] = useState<Importance>(task?.importance || 'high')
  const [urgency, setUrgency] = useState<Urgency>(task?.urgency || 'low')
  const [taskType, setTaskType] = useState<TaskType>(task?.taskType || 'daily')
  const [dueDate, setDueDate] = useState(task?.dueDate || defaultDueDate || getTodayKey())
  const [goalId, setGoalId] = useState(task?.goalId || defaultGoalId || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        importance,
        urgency,
        taskType,
        dueDate: dueDate || null,
        goalId: goalId || null,
        tags: selectedTags,
      },
      task?.id,
    )
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
    )
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink/35 p-4 backdrop-blur-sm">
      <button className="absolute inset-0 cursor-default" aria-label="Close task editor" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative my-6 w-full max-w-2xl rounded-3xl border border-white/70 bg-[#fbfcfa] p-5 shadow-2xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss-600">
              {task ? 'Update task' : 'New task'}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              {task ? 'Edit task details' : 'Plan something meaningful'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-100">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Task name</span>
            <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} className={fieldClass} placeholder="What needs to happen?" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={`${fieldClass} resize-none`} placeholder="Add useful context or next steps…" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectField label="Status" value={status} onChange={(value) => setStatus(value as TaskStatus)} options={[['todo', 'To do'], ['in-progress', 'In progress'], ['completed', 'Completed']]} />
            <SelectField label="Priority" value={priority} onChange={(value) => setPriority(value as Priority)} options={[['high', 'High'], ['medium', 'Medium'], ['low', 'Low']]} />
            <SelectField label="Task type" value={taskType} onChange={(value) => setTaskType(value as TaskType)} options={[['daily', 'Daily'], ['short-term', 'Short-term'], ['long-term', 'Long-term']]} />
            <SelectField label="Importance" value={importance} onChange={(value) => setImportance(value as Importance)} options={[['high', 'Important'], ['low', 'Not important']]} />
            <SelectField label="Urgency" value={urgency} onChange={(value) => setUrgency(value as Urgency)} options={[['high', 'Urgent'], ['low', 'Not urgent']]} />
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">Due date</span>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={fieldClass} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Linked goal</span>
            <select value={goalId} onChange={(event) => setGoalId(event.target.value)} className={fieldClass}>
              <option value="">No goal</option>
              {goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.name}</option>)}
            </select>
          </label>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-slate-500">Tags</legend>
            <div className="flex min-h-10 flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2">
              {tags.map((tag) => {
                const selected = selectedTags.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selected ? 'shadow-sm' : 'border-slate-200 text-slate-500'}`}
                    style={selected ? { borderColor: tag.color, color: tag.color, backgroundColor: `${tag.color}12` } : undefined}
                  >
                    {tag.name}
                  </button>
                )
              })}
              {tags.length === 0 && <span className="px-1 py-1 text-xs text-slate-400">Create tags in Settings first.</span>}
            </div>
          </fieldset>
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">Cancel</button>
          <button type="submit" disabled={!title.trim()} className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-moss-800 disabled:opacity-40">
            {task ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<[string, string]>
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  )
}
