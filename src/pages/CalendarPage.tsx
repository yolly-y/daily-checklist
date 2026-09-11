import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core'
import type { Task } from '../types/task'
import { formatFriendlyDate, getTodayKey, toDateKey } from '../utils/date'
import { CalendarIcon, CheckIcon, PlusIcon } from '../components/Icons'

interface CalendarPageProps {
  tasks: Task[]
  onCreateAtDate: (date: string) => void
  onMoveDate: (id: string, date: string) => void
  onEditTask: (task: Task) => void
  onToggleTask: (id: string) => void
}

const priorityColors = {
  high: '#dc5f63',
  medium: '#d99a32',
  low: '#4386a6',
}

export function CalendarPage({
  tasks,
  onCreateAtDate,
  onMoveDate,
  onEditTask,
  onToggleTask,
}: CalendarPageProps) {
  const [selectedDate, setSelectedDate] = useState(getTodayKey())
  const datedTasks = tasks.filter((task) => task.dueDate)
  const selectedTasks = tasks.filter((task) => task.dueDate === selectedDate)
  const events: EventInput[] = datedTasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.dueDate || undefined,
    allDay: true,
    backgroundColor: priorityColors[task.priority],
    borderColor: priorityColors[task.priority],
    textColor: '#ffffff',
    classNames: task.status === 'completed' ? ['calendar-event-completed'] : [],
  }))

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr.slice(0, 10))
  }

  const handleEventClick = (info: EventClickArg) => {
    const task = tasks.find((item) => item.id === info.event.id)
    if (task) {
      if (task.dueDate) setSelectedDate(task.dueDate)
      onEditTask(task)
    }
  }

  const handleEventDrop = (info: EventDropArg) => {
    if (info.event.start) onMoveDate(info.event.id, toDateKey(info.event.start))
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-moss-700">See time clearly</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Calendar</h2>
          <p className="mt-2 text-sm text-slate-500">Click a date to inspect it. Drag a task to reschedule it.</p>
        </div>
        <button type="button" onClick={() => onCreateAtDate(selectedDate)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white"><PlusIcon className="h-4 w-4" /> Task on selected day</button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="calendar-shell min-w-0 rounded-3xl border border-slate-200 bg-white p-3 shadow-card sm:p-5">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate={selectedDate}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
            buttonText={{ today: 'Today', month: 'Month', week: 'Week' }}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            editable
            eventStartEditable
            dayMaxEvents={3}
            nowIndicator
            height="auto"
            firstDay={1}
          />
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card xl:sticky xl:top-8 xl:self-start">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-moss-50 text-moss-700"><CalendarIcon className="h-5 w-5" /></div>
            <div><p className="text-xs font-medium text-slate-400">Selected date</p><h3 className="text-sm font-semibold text-ink">{formatFriendlyDate(selectedDate, { weekday: 'short', month: 'short', day: 'numeric' })}</h3></div>
          </div>
          <div className="mt-4 space-y-2">
            {selectedTasks.map((task) => (
              <div key={task.id} className="group flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <button type="button" onClick={() => onToggleTask(task.id)} className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${task.status === 'completed' ? 'border-moss-600 bg-moss-600 text-white' : 'border-slate-300 text-transparent'}`} aria-label={`Toggle ${task.title}`}><CheckIcon className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => onEditTask(task)} className={`min-w-0 flex-1 break-words text-left text-xs font-medium leading-5 ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{task.title}</button>
              </div>
            ))}
            {selectedTasks.length === 0 && <p className="py-6 text-center text-xs leading-5 text-slate-400">Nothing planned yet.<br />Click below to add a task.</p>}
          </div>
          <button type="button" onClick={() => onCreateAtDate(selectedDate)} className="mt-4 w-full rounded-xl border border-dashed border-moss-300 py-2.5 text-xs font-semibold text-moss-700 hover:bg-moss-50">+ Add task</button>
        </aside>
      </div>
    </div>
  )
}
