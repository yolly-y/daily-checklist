import type { ComponentType, SVGProps } from 'react'
import type { AppPage } from '../types/productivity'
import {
  CalendarIcon,
  CheckIcon,
  HistoryIcon,
  HomeIcon,
  TagIcon,
  TargetIcon,
} from './Icons'

interface NavigationProps {
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const items: Array<{ id: AppPage; label: string; icon: IconComponent }> = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'goals', label: 'Goals', icon: TargetIcon },
  { id: 'tags', label: 'Tags', icon: TagIcon },
  { id: 'history', label: 'History', icon: HistoryIcon },
]

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navigation = (
    <nav aria-label="Main navigation" className="flex gap-1 lg:flex-col">
      {items.map(({ id, label, icon: Icon }) => {
        const active = currentPage === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={active ? 'page' : undefined}
            className={`group flex min-w-[74px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition lg:min-w-0 lg:flex-row lg:gap-3 lg:px-4 lg:py-3 lg:text-sm ${
              active
                ? 'bg-ink text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? 'text-moss-200' : 'text-slate-400'}`} />
            {label}
          </button>
        )
      })}
    </nav>
  )

  return (
    <>
      <aside className="hidden min-h-screen border-r border-slate-200/70 bg-white/70 px-5 py-8 backdrop-blur lg:block">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white">
            <CheckIcon className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-ink">Daily</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-moss-600">
              Productivity OS
            </p>
          </div>
        </div>
        {navigation}
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl justify-between overflow-x-auto">{navigation}</div>
      </div>
    </>
  )
}
