import type { ReactNode } from 'react'

export type PillVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

type PillProps = {
  children: ReactNode
  variant?: PillVariant
}

const variantClasses: Record<PillVariant, string> = {
  neutral:
    'border-slate-700 bg-slate-800 text-slate-300',

  info:
    'border-blue-800 bg-blue-950/50 text-blue-300',

  success:
    'border-emerald-800 bg-emerald-950/50 text-emerald-300',

  warning:
    'border-amber-800 bg-amber-950/50 text-amber-300',

  danger:
    'border-red-800 bg-red-950/50 text-red-300',
}

function Pill({
  children,
  variant = 'neutral',
}: PillProps) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full border
        px-2.5 py-1
        text-xs font-medium
        ${variantClasses[variant]}
      `}
    >
      {children}
    </span>
  )
}

export default Pill