export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayKey() {
  return toDateKey(new Date())
}

export function formatFriendlyDate(dateKey: string, options?: Intl.DateTimeFormatOptions) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(year, month - 1, day))
}
