import { useState } from 'react'

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import TaskCard from '../components/TaskCard'

import {
  toDateValue,
} from '../../../lib/date'

import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '../taskTypes'

import type {
  CreateTaskCategoryInput,
  TaskCategory,
} from '../taskCategoryTypes'

type CalendarMode =
  | 'day'
  | 'week'
  | 'month'

type TaskCalendarViewProps = {
  tasks: Task[]
  categories: TaskCategory[]

  onCreateCategory: (
    input: CreateTaskCategoryInput,
  ) => Promise<TaskCategory>

  onStatusChange: (
    task: Task,
    status: TaskStatus,
  ) => Promise<void>

  onUpdate: (
    id: number,
    input: UpdateTaskInput,
  ) => Promise<Task>

  onDelete: (
    id: number,
  ) => void

  onEdit?: (
    id: number,
  ) => void
}

const weekDayLabels = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
]

function TaskCalendarView({
  tasks,
  categories,
  onCreateCategory,
  onStatusChange,
  onUpdate,
  onDelete,
  onEdit,
}: TaskCalendarViewProps) {
  const [
    mode,
    setMode,
  ] =
    useState<CalendarMode>(
      'month',
    )

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    startOfToday(),
  )

  const today =
    startOfToday()

  const selectedDateValue =
    toDateValue(
      selectedDate,
    )

  const selectedTasks =
    tasks
      .filter(
        (task) =>
          task.dueDate ===
          selectedDateValue,
      )
      .sort(
        (a, b) =>
          priorityRank(
            b,
          ) -
          priorityRank(
            a,
          ),
      )

  function moveBack() {
    switch (mode) {
      case 'day':
        setSelectedDate(
          addDays(
            selectedDate,
            -1,
          ),
        )
        break

      case 'week':
        setSelectedDate(
          addDays(
            selectedDate,
            -7,
          ),
        )
        break

      case 'month':
        setSelectedDate(
          addMonths(
            selectedDate,
            -1,
          ),
        )
        break
    }
  }

  function moveForward() {
    switch (mode) {
      case 'day':
        setSelectedDate(
          addDays(
            selectedDate,
            1,
          ),
        )
        break

      case 'week':
        setSelectedDate(
          addDays(
            selectedDate,
            7,
          ),
        )
        break

      case 'month':
        setSelectedDate(
          addMonths(
            selectedDate,
            1,
          ),
        )
        break
    }
  }

  function goToToday() {
    setSelectedDate(
      startOfToday(),
    )
  }

  return (
    <div className="space-y-5">
      {/* View switch */}
      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            inline-flex
            rounded-2xl

            border
            border-slate-800

            bg-slate-900
            p-1
          "
        >
          <CalendarModeButton
            label="Day"
            active={
              mode === 'day'
            }
            onClick={() =>
              setMode('day')
            }
          />

          <CalendarModeButton
            label="Week"
            active={
              mode === 'week'
            }
            onClick={() =>
              setMode('week')
            }
          />

          <CalendarModeButton
            label="Month"
            active={
              mode === 'month'
            }
            onClick={() =>
              setMode('month')
            }
          />
        </div>

        <button
          type="button"
          onClick={
            goToToday
          }
          className="
            rounded-xl

            border
            border-slate-800

            bg-slate-900

            px-3 py-2

            text-sm
            font-medium
            text-slate-300

            transition

            hover:border-slate-700
            hover:bg-slate-800
            hover:text-slate-100
          "
        >
          Today
        </button>
      </div>

      {/* Navigation */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <button
          type="button"
          aria-label="Previous"
          onClick={moveBack}
          className="
            flex size-10
            items-center
            justify-center

            rounded-xl

            border
            border-slate-800

            bg-slate-900

            text-slate-400

            transition

            hover:bg-slate-800
            hover:text-slate-100
          "
        >
          <ChevronLeft
            size={19}
          />
        </button>

        <h2
          className="
            min-w-0
            text-center

            text-base
            font-semibold
            text-slate-200

            sm:text-lg
          "
        >
          {getPeriodTitle(
            selectedDate,
            mode,
          )}
        </h2>

        <button
          type="button"
          aria-label="Next"
          onClick={
            moveForward
          }
          className="
            flex size-10
            items-center
            justify-center

            rounded-xl

            border
            border-slate-800

            bg-slate-900

            text-slate-400

            transition

            hover:bg-slate-800
            hover:text-slate-100
          "
        >
          <ChevronRight
            size={19}
          />
        </button>
      </div>

      {/* Calendar */}
      {mode === 'day' && (
        <DayView
          date={
            selectedDate
          }
          tasks={
            tasks
          }
        />
      )}

      {mode === 'week' && (
        <WeekView
          selectedDate={
            selectedDate
          }
          tasks={tasks}
          today={today}
          onSelectDate={
            setSelectedDate
          }
        />
      )}

      {mode === 'month' && (
        <MonthView
          selectedDate={
            selectedDate
          }
          tasks={tasks}
          today={today}
          onSelectDate={
            setSelectedDate
          }
        />
      )}

      {/* Selected date agenda */}
      <section>
        <div
          className="
            mb-3
            flex
            items-baseline
            justify-between
            gap-3
          "
        >
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Selected day
            </p>

            <h3
              className="
                mt-1
                text-lg
                font-semibold
                text-slate-200
              "
            >
              {formatFullDate(
                selectedDate,
              )}
            </h3>
          </div>

          <span
            className="
              text-sm
              text-slate-500
            "
          >
            {
              selectedTasks.length
            }{' '}
            {selectedTasks.length ===
            1
              ? 'task'
              : 'tasks'}
          </span>
        </div>

        {selectedTasks.length >
        0 ? (
          <div className="space-y-3">
            {selectedTasks.map(
              (task) => (
                <TaskCard
                  key={
                    task.id
                  }
                  task={task}
                  categories={
                    categories
                  }
                  onCreateCategory={
                    onCreateCategory
                  }
                  onStatusChange={
                    onStatusChange
                  }
                  onUpdate={
                    onUpdate
                  }
                  onDelete={
                    onDelete
                  }
                  onEdit={
                    onEdit
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div
            className="
              rounded-2xl

              border
              border-dashed
              border-slate-800

              px-6 py-10

              text-center
            "
          >
            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Nothing due on this
              day.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

/* ----------------------------------
   Day
----------------------------------- */

type DayViewProps = {
  date: Date
  tasks: Task[]
}

function DayView({
  date,
  tasks,
}: DayViewProps) {
  const dateValue =
    toDateValue(date)

  const count =
    tasks.filter(
      (task) =>
        task.dueDate ===
        dateValue,
    ).length

  return (
    <div
      className="
        rounded-3xl

        border
        border-slate-800

        bg-slate-900/60

        p-6
      "
    >
      <p
        className="
          text-sm
          font-medium
          text-sky-400
        "
      >
        {formatWeekDay(
          date,
        )}
      </p>

      <div
        className="
          mt-2
          flex
          items-end
          gap-3
        "
      >
        <span
          className="
            text-5xl
            font-black
            tracking-tight
            text-slate-100
          "
        >
          {date.getDate()}
        </span>

        <span
          className="
            pb-1
            text-sm
            text-slate-500
          "
        >
          {count}{' '}
          {count === 1
            ? 'task'
            : 'tasks'}
        </span>
      </div>
    </div>
  )
}

/* ----------------------------------
   Week
----------------------------------- */

type WeekViewProps = {
  selectedDate: Date
  today: Date
  tasks: Task[]

  onSelectDate: (
    date: Date,
  ) => void
}

function WeekView({
  selectedDate,
  today,
  tasks,
  onSelectDate,
}: WeekViewProps) {
  const start =
    startOfWeek(
      selectedDate,
    )

  const days =
    Array.from(
      { length: 7 },
      (_, index) =>
        addDays(
          start,
          index,
        ),
    )

  return (
    <div
      className="
        grid
        grid-cols-7
        gap-1.5

        rounded-3xl

        border
        border-slate-800

        bg-slate-900/50

        p-2

        sm:gap-2
        sm:p-3
      "
    >
      {days.map(
        (date) => {
          const dateValue =
            toDateValue(
              date,
            )

          const isSelected =
            isSameDate(
              date,
              selectedDate,
            )

          const isToday =
            isSameDate(
              date,
              today,
            )

          const count =
            tasks.filter(
              (task) =>
                task.dueDate ===
                dateValue,
            ).length

          return (
            <button
              key={
                dateValue
              }
              type="button"
              onClick={() =>
                onSelectDate(
                  date,
                )
              }
              className={`
                min-w-0

                rounded-2xl

                px-1
                py-3

                text-center

                transition

                sm:px-2

                ${
                  isSelected
                    ? `
                      bg-sky-400
                      text-slate-950
                    `
                    : `
                      text-slate-400
                      hover:bg-slate-800
                      hover:text-slate-100
                    `
                }
              `}
            >
              <span
                className="
                  block

                  text-[10px]
                  font-semibold
                  uppercase

                  sm:text-xs
                "
              >
                {formatShortWeekDay(
                  date,
                )}
              </span>

              <span
                className={`
                  mx-auto
                  mt-1

                  flex size-7
                  items-center
                  justify-center

                  rounded-full

                  text-sm
                  font-semibold

                  ${
                    isToday &&
                    !isSelected
                      ? `
                        bg-sky-400/15
                        text-sky-300
                      `
                      : ''
                  }
                `}
              >
                {date.getDate()}
              </span>

              <div
                className="
                  mt-2
                  flex h-2
                  items-center
                  justify-center
                  gap-0.5
                "
              >
                {Array.from({
                  length:
                    Math.min(
                      count,
                      3,
                    ),
                }).map(
                  (
                    _,
                    index,
                  ) => (
                    <span
                      key={
                        index
                      }
                      className={`
                        size-1
                        rounded-full

                        ${
                          isSelected
                            ? 'bg-slate-950'
                            : 'bg-sky-400'
                        }
                      `}
                    />
                  ),
                )}
              </div>
            </button>
          )
        },
      )}
    </div>
  )
}

/* ----------------------------------
   Month
----------------------------------- */

type MonthViewProps = {
  selectedDate: Date
  today: Date
  tasks: Task[]

  onSelectDate: (
    date: Date,
  ) => void
}

function MonthView({
  selectedDate,
  today,
  tasks,
  onSelectDate,
}: MonthViewProps) {
  const days =
    getMonthGrid(
      selectedDate,
    )

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl

        border
        border-slate-800

        bg-slate-900/50
      "
    >
      <div
        className="
          grid
          grid-cols-7

          border-b
          border-slate-800
        "
      >
        {weekDayLabels.map(
          (day) => (
            <div
              key={day}
              className="
                py-2.5
                text-center

                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-600

                sm:text-xs
              "
            >
              {day}
            </div>
          ),
        )}
      </div>

      <div
        className="
          grid
          grid-cols-7
        "
      >
        {days.map(
          (date) => {
            const dateValue =
              toDateValue(
                date,
              )

            const dayTasks =
              tasks.filter(
                (task) =>
                  task.dueDate ===
                  dateValue,
              )

            const isSelected =
              isSameDate(
                date,
                selectedDate,
              )

            const isToday =
              isSameDate(
                date,
                today,
              )

            const inMonth =
              date.getMonth() ===
              selectedDate.getMonth()

            return (
              <button
                key={
                  dateValue
                }
                type="button"
                onClick={() =>
                  onSelectDate(
                    date,
                  )
                }
                className={`
                  relative

                  min-h-16
                  min-w-0

                  border-b
                  border-r
                  border-slate-800/70

                  p-1.5

                  text-left

                  transition

                  sm:min-h-24
                  sm:p-2

                  ${
                    isSelected
                      ? `
                        bg-sky-400/10
                      `
                      : `
                        hover:bg-slate-800/60
                      `
                  }

                  ${
                    inMonth
                      ? ''
                      : 'opacity-35'
                  }
                `}
              >
                <span
                  className={`
                    flex size-6
                    items-center
                    justify-center

                    rounded-full

                    text-xs
                    font-medium

                    ${
                      isToday
                        ? `
                          bg-sky-400
                          font-bold
                          text-slate-950
                        `
                        : isSelected
                          ? 'text-sky-300'
                          : 'text-slate-400'
                    }
                  `}
                >
                  {date.getDate()}
                </span>

                {/* Mobile dots */}
                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    gap-1

                    sm:hidden
                  "
                >
                  {dayTasks
                    .slice(
                      0,
                      4,
                    )
                    .map(
                      (task) => (
                        <span
                          key={
                            task.id
                          }
                          className="
                            size-1.5
                            rounded-full
                            bg-sky-400
                          "
                        />
                      ),
                    )}
                </div>

                {/* Larger screen titles */}
                <div
                  className="
                    mt-1
                    hidden
                    space-y-1

                    sm:block
                  "
                >
                  {dayTasks
                    .slice(
                      0,
                      2,
                    )
                    .map(
                      (task) => (
                        <div
                          key={
                            task.id
                          }
                          className="
                            truncate

                            rounded-md

                            bg-slate-800

                            px-1.5
                            py-1

                            text-[10px]
                            font-medium
                            text-slate-300
                          "
                        >
                          {
                            task.title
                          }
                        </div>
                      ),
                    )}

                  {dayTasks.length >
                    2 && (
                    <span
                      className="
                        block
                        px-1

                        text-[10px]
                        text-slate-500
                      "
                    >
                      +
                      {dayTasks.length -
                        2}{' '}
                      more
                    </span>
                  )}
                </div>
              </button>
            )
          },
        )}
      </div>
    </div>
  )
}

/* ----------------------------------
   Shared controls
----------------------------------- */

type CalendarModeButtonProps = {
  label: string
  active: boolean
  onClick: () => void
}

function CalendarModeButton({
  label,
  active,
  onClick,
}: CalendarModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl

        px-3
        py-1.5

        text-sm
        font-medium

        transition

        ${
          active
            ? `
              bg-slate-700
              text-slate-100
              shadow-sm
            `
            : `
              text-slate-500
              hover:text-slate-200
            `
        }
      `}
    >
      {label}
    </button>
  )
}

/* ----------------------------------
   Date helpers
----------------------------------- */

function startOfToday() {
  const now =
    new Date()

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  )
}

function addDays(
  date: Date,
  amount: number,
) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() +
      amount,
  )
}

function addMonths(
  date: Date,
  amount: number,
) {
  return new Date(
    date.getFullYear(),
    date.getMonth() +
      amount,
    1,
  )
}

function startOfWeek(
  date: Date,
) {
  const day =
    date.getDay()

  const difference =
    day === 0
      ? -6
      : 1 - day

  return addDays(
    date,
    difference,
  )
}

function getMonthGrid(
  date: Date,
) {
  const monthStart =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
    )

  const gridStart =
    startOfWeek(
      monthStart,
    )

  return Array.from(
    { length: 42 },
    (_, index) =>
      addDays(
        gridStart,
        index,
      ),
  )
}

function isSameDate(
  left: Date,
  right: Date,
) {
  return (
    left.getFullYear() ===
      right.getFullYear() &&
    left.getMonth() ===
      right.getMonth() &&
    left.getDate() ===
      right.getDate()
  )
}

function formatFullDate(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    'en-IE',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  ).format(date)
}

function formatWeekDay(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    'en-IE',
    {
      weekday: 'long',
      month: 'long',
    },
  ).format(date)
}

function formatShortWeekDay(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    'en-IE',
    {
      weekday: 'short',
    },
  ).format(date)
}

function getPeriodTitle(
  date: Date,
  mode: CalendarMode,
) {
  if (mode === 'day') {
    return formatFullDate(
      date,
    )
  }

  if (mode === 'week') {
    const start =
      startOfWeek(date)

    const end =
      addDays(
        start,
        6,
      )

    const startText =
      new Intl.DateTimeFormat(
        'en-IE',
        {
          day: 'numeric',
          month: 'short',
        },
      ).format(start)

    const endText =
      new Intl.DateTimeFormat(
        'en-IE',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      ).format(end)

    return `${startText} – ${endText}`
  }

  return new Intl.DateTimeFormat(
    'en-IE',
    {
      month: 'long',
      year: 'numeric',
    },
  ).format(date)
}

function priorityRank(
  task: Task,
) {
  switch (task.priority) {
    case 'Urgent':
      return 4

    case 'High':
      return 3

    case 'Medium':
      return 2

    case 'Low':
      return 1
  }
}

export default TaskCalendarView