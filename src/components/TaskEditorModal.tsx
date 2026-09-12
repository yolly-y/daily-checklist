import { useState, type FormEvent } from 'react'
import type { Goal, Tag } from '../types/productivity'
import type {
  Importance,
  NewTask,
  Priority,
  RecurrenceFrequency,
  Task,
  TaskStatus,
  TaskType,
  Urgency,
} from '../types/task'
import { getTodayKey, toDateKey } from '../utils/date'

interface TaskEditorModalProps {
  task?: Task | null
  defaultDueDate?: string | null
  defaultGoalId?: string | null
  defaultImportance?: Importance | null
  defaultUrgency?: Urgency | null
  tags: Tag[]
  goals: Goal[]
  onClose: () => void
  onSave: (task: NewTask, id?: string) => void
  onCreateGoal: (name: string, description: string, deadline: string | null) => string
  onCreateTag: (name: string, color: string) => string
}

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-moss-300 focus:ring-4 focus:ring-moss-100'

const tagColors = ['#357348', '#2563eb', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#0891b2', '#475569']

export function TaskEditorModal({
  task,
  defaultDueDate,
  defaultGoalId,
  defaultImportance,
  defaultUrgency,
  tags,
  goals,
  onClose,
  onSave,
  onCreateGoal,
  onCreateTag,
}: TaskEditorModalProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo')
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium')
  const [importance, setImportance] = useState<Importance>(task?.importance || defaultImportance || 'high')
  const [urgency, setUrgency] = useState<Urgency>(task?.urgency || defaultUrgency || 'low')
  const [taskType, setTaskType] = useState<TaskType>(task?.taskType || 'daily')
  const [dueDate, setDueDate] = useState(task?.dueDate || defaultDueDate || getTodayKey())
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency>(task?.recurrence || 'none')
  const [recurrenceStart, setRecurrenceStart] = useState(task?.recurrenceStart || task?.dueDate || defaultDueDate || getTodayKey())
  const [recurrenceEnd, setRecurrenceEnd] = useState(task?.recurrenceEnd || '')
  const [goalId, setGoalId] = useState(task?.goalId || defaultGoalId || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || [])
  const [showGoalCreator, setShowGoalCreator] = useState(false)
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalDescription, setNewGoalDescription] = useState('')
  const [newGoalDeadline, setNewGoalDeadline] = useState('')
  const [showTagCreator, setShowTagCreator] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState(tagColors[0])

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
        dueDate: recurrence === 'none' ? dueDate || null : recurrenceStart,
        goalId: goalId || null,
        tags: selectedTags,
        recurrence,
        recurrenceStart: recurrence === 'none' ? null : recurrenceStart,
        recurrenceEnd: recurrence === 'none' ? null : recurrenceEnd,
      },
      task?.id,
    )
  }

  const handleRecurrenceChange = (value: RecurrenceFrequency) => {
    setRecurrence(value)
    if (value === 'none') return
    const start = recurrenceStart || dueDate || getTodayKey()
    setRecurrenceStart(start)
    if (!recurrenceEnd) {
      const end = new Date(`${start}T12:00:00`)
      end.setMonth(end.getMonth() + 1)
      setRecurrenceEnd(toDateKey(end))
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
    )
  }

  const createGoal = () => {
    if (!newGoalName.trim()) return
    const newId = onCreateGoal(newGoalName.trim(), newGoalDescription.trim(), newGoalDeadline || null)
    setGoalId(newId)
    setNewGoalName('')
    setNewGoalDescription('')
    setNewGoalDeadline('')
    setShowGoalCreator(false)
  }

  const createTag = () => {
    if (!newTagName.trim()) return
    const newId = onCreateTag(newTagName.trim(), newTagColor)
    setSelectedTags((current) => [...current, newId])
    setNewTagName('')
    setNewTagColor(tagColors[0])
    setShowTagCreator(false)
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
              {task ? 'Update task' : 'Set task'}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              {task ? 'Edit task details' : 'Create and organize one task'}
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
            {recurrence === 'none' && <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-500">Due date</span>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={fieldClass} />
            </label>}
          </div>

          <section className="rounded-2xl border border-moss-100 bg-moss-50/55 p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <SelectField
                label="Repeat"
                value={recurrence}
                onChange={(value) => handleRecurrenceChange(value as RecurrenceFrequency)}
                options={[["none", "Does not repeat"], ["daily", "Every day"], ["weekly", "Every week"], ["monthly", "Every month"]]}
              />
              {recurrence !== 'none' && (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-500">Starts on</span>
                    <input type="date" required value={recurrenceStart} onChange={(event) => { setRecurrenceStart(event.target.value); if (recurrenceEnd && recurrenceEnd < event.target.value) setRecurrenceEnd(event.target.value) }} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-500">Ends on</span>
                    <input type="date" required min={recurrenceStart} value={recurrenceEnd} onChange={(event) => setRecurrenceEnd(event.target.value)} className={fieldClass} />
                  </label>
                </>
              )}
            </div>
            <p className="mt-3 text-xs leading-5 text-moss-700/75">
              {recurrence === 'none'
                ? 'Choose a single due date above.'
                : recurrence === 'weekly'
                  ? 'The task repeats on the same weekday as the start date.'
                  : recurrence === 'monthly'
                    ? 'The task repeats on the same day number each month.'
                    : 'The task appears on every day in this date range.'}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-end gap-2">
              <label className="min-w-0 flex-1">
                <span className="mb-1.5 block text-xs font-semibold text-slate-500">Linked long-term goal</span>
                <select value={goalId} onChange={(event) => setGoalId(event.target.value)} className={fieldClass}>
                  <option value="">No goal</option>
                  {goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.name}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => setShowGoalCreator((value) => !value)} className="shrink-0 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-moss-700 hover:bg-moss-50">+ New goal</button>
            </div>
            {showGoalCreator && (
              <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={newGoalName} onChange={(event) => setNewGoalName(event.target.value)} placeholder="Goal name" maxLength={100} className={fieldClass} />
                  <input type="date" value={newGoalDeadline} onChange={(event) => setNewGoalDeadline(event.target.value)} className={fieldClass} />
                </div>
                <input value={newGoalDescription} onChange={(event) => setNewGoalDescription(event.target.value)} placeholder="Goal description" maxLength={240} className={`${fieldClass} mt-2`} />
                <button type="button" disabled={!newGoalName.trim()} onClick={createGoal} className="mt-2 rounded-xl bg-moss-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-35">Create and link goal</button>
              </div>
            )}
          </section>

          <fieldset className="rounded-2xl border border-slate-200 bg-white p-4">
            <legend className="sr-only">Tags</legend>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500">Tags</span>
              <button type="button" onClick={() => setShowTagCreator((value) => !value)} className="text-xs font-semibold text-moss-700 hover:text-moss-900">+ New tag</button>
            </div>
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
              {tags.length === 0 && <span className="px-1 py-1 text-xs text-slate-400">No tags yet. Create one here.</span>}
            </div>
            {showTagCreator && (
              <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input value={newTagName} onChange={(event) => setNewTagName(event.target.value)} placeholder="Tag name" maxLength={30} className={fieldClass} />
                  <button type="button" disabled={!newTagName.trim()} onClick={createTag} className="shrink-0 rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-35">Create and add</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2" aria-label="New tag color">
                  {tagColors.map((color) => <button key={color} type="button" onClick={() => setNewTagColor(color)} aria-label={`Use color ${color}`} className={`h-6 w-6 rounded-full border-2 transition ${newTagColor === color ? 'scale-110 border-ink' : 'border-white'}`} style={{ backgroundColor: color }} />)}
                </div>
              </div>
            )}
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
