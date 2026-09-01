import type { SVGProps } from 'react'

function base(props: SVGProps<SVGSVGElement>) {
  return { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24', ...props }
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  )
}

export function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  )
}

export function HistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4.5H7.5" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  )
}

export function ScaleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  )
}

export function ChevronBackIcon(props: SVGProps<SVGSVGElement>) {
  // فلش «بازگشت» — در RTL باید به راست اشاره کند
  return (
    <svg {...base(props)}>
      <path d="M9.5 5.5 15 12l-5.5 6.5" />
    </svg>
  )
}

export function ChevronForwardIcon(props: SVGProps<SVGSVGElement>) {
  // فلش «ادامه/بعدی» — هم‌جهت با ادامه‌ی خواندن در RTL، به چپ اشاره می‌کند
  return (
    <svg {...base(props)}>
      <path d="M14.5 5.5 9 12l5.5 6.5" />
    </svg>
  )
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 13.4 8.6 18.5 10l-5.1 1.4L12 16.5l-1.4-5.1L5.5 10l5.1-1.4L12 3.5Z" />
      <path d="M18.5 15.5 19.1 17.4 21 18l-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z" />
    </svg>
  )
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </svg>
  )
}

export function FlameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12 3s4 3.5 4 7.5a4 4 0 1 1-8 0c0-1 .4-1.8 1-2.5.2 1 1 1.5 1.5 1 .6-.6.2-1.6-.2-2.5C9.6 5 12 3 12 3Z" />
    </svg>
  )
}

export function DiamondIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 9 8 4h8l4 5-8 11-8-11Z" />
      <path d="M4 9h16" />
      <path d="M9 4 12 9l-1.5 6" />
      <path d="M15 4 12 9l1.5 6" />
    </svg>
  )
}

export function GiftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M4 13h16" />
      <path d="M12 9v11" />
      <path d="M12 9c-1.5-3-3.5-4.5-5-3.5-1.2.9-.7 3.5 5 3.5Z" />
      <path d="M12 9c1.5-3 3.5-4.5 5-3.5 1.2.9.7 3.5-5 3.5Z" />
    </svg>
  )
}

export function ImageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M20 15.5 15 11l-9 8" />
    </svg>
  )
}
