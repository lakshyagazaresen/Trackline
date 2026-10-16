import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

export type TaskSort =
  | 'dueDate'
  | 'priority'
  | 'createdAt'
  | 'title'

type TaskSearchSortBarProps = {
  searchQuery: string

  onSearchChange: (
    value: string,
  ) => void

  sortBy: TaskSort

  onSortChange: (
    value: TaskSort,
  ) => void
}

function TaskSearchSortBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: TaskSearchSortBarProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-3

        sm:flex-row
        sm:items-center
      "
    >
      <div className="relative min-w-0 flex-1">
        <Search
          size={17}
          className="
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) =>
            onSearchChange(
              event.currentTarget.value,
            )
          }
          placeholder="Search tasks..."
          className="
            w-full
            rounded-2xl

            border
            border-slate-800

            bg-slate-900

            py-2.5
            pl-10
            pr-10

            text-sm
            text-slate-200

            outline-none

            placeholder:text-slate-600

            transition

            focus:border-sky-500
            focus:ring-2
            focus:ring-sky-500/20
          "
        />

        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() =>
              onSearchChange('')
            }
            className="
              absolute
              right-2.5
              top-1/2
              flex size-7
              -translate-y-1/2
              items-center
              justify-center

              rounded-full
              text-slate-500

              transition

              hover:bg-slate-800
              hover:text-slate-200
            "
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div
        className="
          flex
          items-center
          gap-2

          rounded-2xl

          border
          border-slate-800

          bg-slate-900

          px-3
        "
      >
        <SlidersHorizontal
          size={15}
          className="shrink-0 text-slate-500"
        />

        <select
          value={sortBy}
          onChange={(event) =>
            onSortChange(
              event.currentTarget
                .value as TaskSort,
            )
          }
          className="
            min-w-0
            flex-1

            bg-transparent

            py-2.5

            text-sm
            font-medium
            text-slate-300

            outline-none

            sm:w-40
          "
        >
          <option value="dueDate">
            Due date
          </option>

          <option value="priority">
            Priority
          </option>

          <option value="createdAt">
            Newest
          </option>

          <option value="title">
            Title A–Z
          </option>
        </select>
      </div>
    </div>
  )
}

export default TaskSearchSortBar