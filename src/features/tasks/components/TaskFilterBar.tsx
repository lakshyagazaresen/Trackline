import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Layers3,
  TriangleAlert,
} from 'lucide-react'

export type TaskSmartFilter =
  | 'all'
  | 'today'
  | 'upcoming'
  | 'overdue'
  | 'completed'

type TaskFilterBarProps = {
  value: TaskSmartFilter
  onChange: (filter: TaskSmartFilter) => void

  counts: Record<
    TaskSmartFilter,
    number
  >
}

const filters = [
  {
    value: 'all',
    label: 'All',
    icon: Layers3,
  },
  {
    value: 'today',
    label: 'Today',
    icon: CalendarDays,
  },
  {
    value: 'upcoming',
    label: 'Upcoming',
    icon: Clock3,
  },
  {
    value: 'overdue',
    label: 'Overdue',
    icon: TriangleAlert,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
  },
] satisfies {
  value: TaskSmartFilter
  label: string
  icon: typeof Layers3
}[]

function TaskFilterBar({
  value,
  onChange,
  counts,
}: TaskFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon

          const isActive =
            value === filter.value

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                onChange(filter.value)
              }
              className={`
                flex shrink-0
                items-center gap-1.5
                rounded-full
                border
                px-3 py-2
                text-xs font-medium
                transition-all
                duration-200
                active:scale-95

                sm:gap-2
                sm:px-3.5
                sm:text-sm

                ${
                    isActive
                    ? `
                        border-sky-400/40
                        bg-sky-400
                        text-slate-950
                        shadow-lg
                        shadow-sky-950/20
                    `
                    : `
                        border-slate-800
                        bg-slate-900
                        text-slate-400
                        hover:border-slate-700
                        hover:text-slate-200
                    `
                }
                `}
            >
              <Icon size={15} />

              <span>
                {filter.label}
              </span>

              <span
                className={`
                  rounded-full
                  px-1.5 py-0.5
                  text-[11px]

                  ${
                    isActive
                      ? 'bg-slate-950/15'
                      : 'bg-slate-800 text-slate-500'
                  }
                `}
              >
                {counts[filter.value]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TaskFilterBar