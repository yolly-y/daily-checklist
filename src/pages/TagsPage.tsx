import { TagIcon } from '../components/Icons'
import type { Tag } from '../types/productivity'
import type { Task } from '../types/task'

interface TagsPageProps {
  tags: Tag[]
  tasks: Task[]
}

export function TagsPage({ tags, tasks }: TagsPageProps) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-medium text-moss-700">See your categories</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Tags</h2>
        <p className="mt-2 text-sm text-slate-500">Tags are created and assigned inside a task’s Set window.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tags.map((tag) => {
          const taggedTasks = tasks.filter((task) => task.tags.includes(tag.id))
          const activeTasks = taggedTasks.filter((task) => task.status !== 'completed').length
          return (
            <article key={tag.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ color: tag.color, backgroundColor: `${tag.color}12` }}>
                  <TagIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-ink">{tag.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{taggedTasks.length} linked tasks</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs">
                <span className="text-slate-500">Active</span>
                <span className="font-semibold" style={{ color: tag.color }}>{activeTasks}</span>
              </div>
            </article>
          )
        })}
      </div>

      {tags.length === 0 && (
        <div className="grid min-h-64 place-items-center rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
          <div><TagIcon className="mx-auto h-8 w-8 text-slate-300" /><h3 className="mt-3 font-semibold text-ink">No tags yet</h3><p className="mt-1 text-sm text-slate-400">Open Set schedule & details from a quadrant to create one.</p></div>
        </div>
      )}
    </div>
  )
}
