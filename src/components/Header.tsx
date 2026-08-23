import { CalendarIcon, CheckIcon } from './Icons'

interface HeaderProps {
  date: Date
}

export function Header({ date }: HeaderProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white shadow-sm">
          <CheckIcon className="h-6 w-6" strokeWidth={2.3} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss-600">
            Personal workspace
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Daily</h1>
        </div>
      </div>

      <div className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
        <CalendarIcon className="h-4 w-4 text-moss-600" />
        <time dateTime={date.toISOString().slice(0, 10)}>{formattedDate}</time>
      </div>
    </header>
  )
}
