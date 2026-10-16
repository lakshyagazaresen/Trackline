import {
  CalendarDays,
  Columns3,
  List,
} from 'lucide-react'

export type TaskView =
  | 'list'
  | 'calendar'
  | 'board'

type TaskViewSwitcherProps = {
  value: TaskView
  onChange: (view: TaskView) => void
}

const views: {
  value: TaskView
  label: string
  icon: typeof List
}[] = [
  {
    value: 'list',
    label: 'List',
    icon: List,
  },
  {
    value: 'calendar',
    label: 'Calendar',
    icon: CalendarDays,
  },
  {
    value: 'board',
    label: 'Board',
    icon: Columns3,
  },
]

function TaskViewSwitcher({
  value,
  onChange,
}: TaskViewSwitcherProps) {
  return (
    <div className="flex rounded-2xl border border-slate-800 bg-slate-900/80 p-1">
      {views.map((view) => {
        const Icon = view.icon
        const isActive =
          value === view.value

        return (
          <button
            key={view.value}
            type="button"
            onClick={() =>
              onChange(view.value)
            }
            className={`
              flex flex-1 items-center
              justify-center gap-2
              rounded-xl
              px-3 py-2.5
              text-sm font-medium
              transition-all
              duration-200

              ${
                isActive
                  ? `
                    bg-slate-100
                    text-slate-950
                    shadow-sm
                  `
                  : `
                    text-slate-400
                    hover:bg-slate-800
                    hover:text-slate-200
                  `
              }
            `}
          >
            <Icon size={17} />

            <span className="hidden md:inline">
              {view.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default TaskViewSwitcher