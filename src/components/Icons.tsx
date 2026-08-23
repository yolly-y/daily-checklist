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
