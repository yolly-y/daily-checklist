import { useState, type FormEvent } from 'react'
import type { Tag } from '../types/productivity'
import { EditIcon, TagIcon, TrashIcon } from '../components/Icons'

interface SettingsPageProps {
  tags: Tag[]
  onCreate: (name: string, color: string) => void
  onUpdate: (id: string, name: string, color: string) => void
  onDelete: (id: string) => void
}

const colors = ['#357348', '#2563eb', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#0891b2', '#475569']

export function SettingsPage({ tags, onCreate, onUpdate, onDelete }: SettingsPageProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(colors[0])
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    if (editingId) onUpdate(editingId, trimmedName, color)
    else onCreate(trimmedName, color)
    setName('')
    setColor(colors[0])
    setEditingId(null)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-moss-700">Personalize your system</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Tags & preferences</h2>
        <p className="mt-2 text-sm text-slate-500">Create reusable tags for areas, projects, and contexts.</p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-moss-50 text-moss-700"><TagIcon className="h-5 w-5" /></div>
          <div><h3 className="font-semibold text-ink">Task tags</h3><p className="text-xs text-slate-400">Assign more than one tag to any task.</p></div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tag name, e.g. Career" maxLength={30} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-moss-300 focus:ring-4 focus:ring-moss-100" />
            <button type="submit" disabled={!name.trim()} className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">{editingId ? 'Save tag' : 'Add tag'}</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Tag color">
            {colors.map((option) => <button key={option} type="button" onClick={() => setColor(option)} aria-label={`Use color ${option}`} className={`h-7 w-7 rounded-full border-2 transition ${color === option ? 'scale-110 border-ink' : 'border-white'}`} style={{ backgroundColor: option }} />)}
          </div>
        </form>

        <div className="mt-5 space-y-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
              <span className="flex-1 text-sm font-medium text-slate-700">{tag.name}</span>
              <button type="button" onClick={() => { setEditingId(tag.id); setName(tag.name); setColor(tag.color) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-moss-700" aria-label={`Edit ${tag.name}`}><EditIcon className="h-4 w-4" /></button>
              <button type="button" onClick={() => onDelete(tag.id)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${tag.name}`}><TrashIcon className="h-4 w-4" /></button>
            </div>
          ))}
          {tags.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No tags yet. Add your first one above.</p>}
        </div>
      </section>
    </div>
  )
}
