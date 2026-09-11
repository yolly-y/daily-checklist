import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const baseProps: IconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m12 3 1.2 3.1a7.2 7.2 0 0 0 4.1 4.1l3.2 1.3-3.2 1.3a7.2 7.2 0 0 0-4.1 4.1L12 20l-1.2-3.1a7.2 7.2 0 0 0-4.1-4.1l-3.2-1.3 3.2-1.3a7.2 7.2 0 0 0 4.1-4.1Z" />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </svg>
  )
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  )
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5M12 7v5l3 2" />
    </svg>
  )
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20 13 13 20l-10-10V3h7Z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
