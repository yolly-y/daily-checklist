import { useMemo, useState } from 'react'
import { CheckIcon, HistoryIcon } from '../components/Icons'
import type { DailyHistory } from '../types/productivity'
import { formatFriendlyDate, getTodayKey, toDateKey } from '../utils/date'

interface HistoryPageProps {
  history: DailyHistory[]
}

export function HistoryPage({ history }: HistoryPageProps) {
  const [selectedDate, setSelectedDate] = useState(history[0]?.date || getTodayKey())
  const selectedRecord = history.find((record) => record.date === selectedDate)

  const weeklyRecords = useMemo(() => {
    const start = new Date()
    start.setDate(start.getDate() - 6)
    const startKey = toDateKey(start)
    return history.filter((record) => record.date >= startKey && record.date <= getTodayKey())
  }, [history])

  const weeklyCompleted = weeklyRecords.reduce((sum, record) => sum + record.completedTasks.length, 0)
  const weeklyAverage = weeklyRecords.length === 0
    ? 0
    : Math.round(weeklyRecords.reduce((sum, record) => sum + record.completionRate, 0) / weeklyRecords.length)

  const postponedTasks = useMemo(() => {
    const counts = new Map<string, { title: string; count: number }>()
    history.forEach((record) => {
      record.unfinishedTasks.forEach((task) => {
        const current = counts.get(task.id) || { title: task.title, count: 0 }
        counts.set(task.id, { title: task.title, count: current.count + 1 })
      })
    })
    return [...counts.values()].filter((item) => item.count > 1).sort((a, b) => b.count - a.count).slice(0, 4)
  }, [history])

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-medium text-moss-700">Look back, learn forward</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Productivity history</h2>
        <p className="mt-2 text-sm text-slate-500">A permanent daily record of what moved forward and what still needs attention.</p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard value={weeklyCompleted} label="Completed this week" />
        <StatCard value={`${weeklyAverage}%`} label="Average completion" />
        <StatCard value={weeklyRecords.length} label="Active days recorded" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.7fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 className="font-semibold text-ink">Daily record</h3><p className="mt-1 text-xs text-slate-400">Choose any recorded date.</p></div>
            <input type="date" value={selectedDate} max={getTodayKey()} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:ring-4 focus:ring-moss-100" />
          </div>

          {selectedRecord ? (
            <div>
              <div className="mb-5 rounded-2xl bg-ink p-5 text-white">
                <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-medium text-moss-200">{formatFriendlyDate(selectedRecord.date, { weekday: 'long' })}</p><p className="mt-1 text-2xl font-semibold">{selectedRecord.completionRate}% completed</p></div><div className="text-right"><p className="text-3xl font-semibold text-moss-300">{selectedRecord.productivityScore}</p><p className="text-[10px] uppercase tracking-wide text-slate-400">Score</p></div></div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-moss-300" style={{ width: `${selectedRecord.completionRate}%` }} /></div>
              </div>
              <HistoryList title="Completed" tasks={selectedRecord.completedTasks} completed />
              <HistoryList title="Unfinished" tasks={selectedRecord.unfinishedTasks} />
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center"><div><HistoryIcon className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-500">No activity recorded for this date</p><p className="mt-1 text-xs text-slate-400">A record appears automatically when you have tasks that day.</p></div></div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="font-semibold text-ink">Recent days</h3>
            <div className="mt-4 space-y-2">
              {history.slice(0, 7).map((record) => (
                <button key={record.date} type="button" onClick={() => setSelectedDate(record.date)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selectedDate === record.date ? 'bg-moss-50' : 'hover:bg-slate-50'}`}><span className="flex-1 text-sm font-medium text-slate-600">{formatFriendlyDate(record.date, { month: 'short', day: 'numeric' })}</span><span className="text-xs font-semibold text-moss-700">{record.completionRate}%</span></button>
              ))}
              {history.length === 0 && <p className="py-5 text-center text-xs text-slate-400">No history yet.</p>}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50/60 p-5">
            <h3 className="text-sm font-semibold text-amber-900">Repeatedly postponed</h3>
            <p className="mt-1 text-xs leading-5 text-amber-700/70">Tasks unfinished on more than one recorded day.</p>
            <div className="mt-3 space-y-2">
              {postponedTasks.map((task) => <div key={task.title} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2"><span className="min-w-0 flex-1 truncate text-xs font-medium text-amber-900">{task.title}</span><span className="text-[10px] font-bold text-amber-600">{task.count}×</span></div>)}
              {postponedTasks.length === 0 && <p className="py-3 text-xs text-amber-700/60">No recurring postponements yet.</p>}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-2xl font-semibold text-ink">{value}</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>
}

function HistoryList({ title, tasks, completed = false }: { title: string; tasks: DailyHistory['completedTasks']; completed?: boolean }) {
  return (
    <div className="mb-4"><div className="mb-2 flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${completed ? 'bg-moss-500' : 'bg-amber-400'}`} /><h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title} · {tasks.length}</h4></div><div className="space-y-1">{tasks.map((task) => <div key={task.id} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">{completed ? <CheckIcon className="h-4 w-4 text-moss-600" /> : <span className="h-4 w-4 rounded-full border border-slate-300" />}<span className={`text-sm ${completed ? 'text-slate-500' : 'text-slate-600'}`}>{task.title}</span></div>)}{tasks.length === 0 && <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-400">None recorded.</p>}</div></div>
  )
}
