import { SparkIcon } from './Icons'

interface ProgressCardProps {
  completed: number
  total: number
}

export function ProgressCard({ completed, total }: ProgressCardProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  const allDone = total > 0 && completed === total

  return (
    <section
      aria-labelledby="progress-title"
      className="overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-card sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-moss-200">
            {allDone ? 'Everything is complete' : 'Today’s progress'}
          </p>
          <h2 id="progress-title" className="text-3xl font-semibold tracking-tight">
            {completed}<span className="text-moss-300">/{total}</span>
            <span className="ml-2 text-base font-normal text-slate-300">tasks done</span>
          </h2>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-moss-200">
          <SparkIcon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-300">
          <span>Daily goal</span>
          <span>{percentage}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Task completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          <div
            className="h-full rounded-full bg-moss-300 transition-[width] duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  )
}
