import { useState } from 'react'

import TaskCard from '../components/TaskCard'

import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '../taskTypes'

import type {
  CreateTaskCategoryInput,
  TaskCategory,
} from '../taskCategoryTypes'

type TaskBoardViewProps = {
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

type BoardColumn = {
  status: TaskStatus
  label: string
  description: string
}

const boardColumns: BoardColumn[] = [
  {
    status: 'Todo',
    label: 'To-Do',
    description: 'Ready to tackle',
  },
  {
    status: 'InProgress',
    label: 'In Progress',
    description: 'Currently moving',
  },
  {
    status: 'Completed',
    label: 'Completed',
    description: 'Done and dusted',
  },
  {
    status: 'Cancelled',
    label: 'Cancelled',
    description: 'No longer needed',
  },
]

const priorityRank: Record<
  Task['priority'],
  number
> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Urgent: 4,
}

function TaskBoardView({
  tasks,
  categories,
  onCreateCategory,
  onStatusChange,
  onUpdate,
  onDelete,
  onEdit,
}: TaskBoardViewProps) {
  const [
    mobileStatus,
    setMobileStatus,
  ] =
    useState<TaskStatus>(
      'Todo',
    )

  return (
    <div className="space-y-4">
      {/* Mobile / tablet status selector */}
      <div
        className="
          flex
          flex-wrap
          gap-2

          lg:hidden
        "
      >
        {boardColumns.map(
          (column) => {
            const count =
              tasks.filter(
                (task) =>
                  task.status ===
                  column.status,
              ).length

            const active =
              mobileStatus ===
              column.status

            return (
              <button
                key={
                  column.status
                }
                type="button"
                onClick={() =>
                  setMobileStatus(
                    column.status,
                  )
                }
                className={`
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border

                  px-3
                  py-2

                  text-xs
                  font-medium

                  transition

                  ${
                    active
                      ? `
                        border-sky-400/40
                        bg-sky-400/15
                        text-sky-300
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
                {column.label}

                <span
                  className={`
                    rounded-full

                    px-1.5
                    py-0.5

                    text-[10px]

                    ${
                      active
                        ? `
                          bg-sky-400/20
                          text-sky-200
                        `
                        : `
                          bg-slate-800
                          text-slate-500
                        `
                    }
                  `}
                >
                  {count}
                </span>
              </button>
            )
          },
        )}
      </div>

      {/* Mobile / tablet board */}
      <div className="lg:hidden">
        {boardColumns
          .filter(
            (column) =>
              column.status ===
              mobileStatus,
          )
          .map(
            (column) => (
              <BoardColumnView
                key={
                  column.status
                }
                column={
                  column
                }
                tasks={
                  tasks
                }
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

      {/* Desktop board */}
      <div
        className="
          hidden
          grid-cols-4
          items-start
          gap-4

          lg:grid
        "
      >
        {boardColumns.map(
          (column) => (
            <BoardColumnView
              key={
                column.status
              }
              column={column}
              tasks={tasks}
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
    </div>
  )
}

type BoardColumnViewProps = {
  column: BoardColumn

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

function BoardColumnView({
  column,
  tasks,
  categories,
  onCreateCategory,
  onStatusChange,
  onUpdate,
  onDelete,
  onEdit,
}: BoardColumnViewProps) {
  const columnTasks =
    tasks
      .filter(
        (task) =>
          task.status ===
          column.status,
      )
      .sort(
        compareBoardTasks,
      )

  return (
    <section
      className="
        min-w-0

        rounded-3xl

        border
        border-slate-800

        bg-slate-900/40

        p-3
      "
    >
      <header
        className="
          mb-3
          flex
          items-start
          justify-between
          gap-3

          px-1
          pt-1
        "
      >
        <div className="min-w-0">
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <StatusDot
              status={
                column.status
              }
            />

            <h2
              className="
                truncate
                text-sm
                font-semibold
                text-slate-200
              "
            >
              {column.label}
            </h2>
          </div>

          <p
            className="
              mt-1
              pl-4

              text-xs
              text-slate-600
            "
          >
            {column.description}
          </p>
        </div>

        <span
          className="
            shrink-0

            rounded-full

            bg-slate-800

            px-2
            py-1

            text-xs
            font-semibold
            text-slate-400
          "
        >
          {columnTasks.length}
        </span>
      </header>

      {columnTasks.length >
      0 ? (
        <div className="space-y-3">
          {columnTasks.map(
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

            px-4
            py-8

            text-center
          "
        >
          <p
            className="
              text-xs
              text-slate-600
            "
          >
            No tasks here.
          </p>
        </div>
      )}
    </section>
  )
}

function StatusDot({
  status,
}: {
  status: TaskStatus
}) {
  const className =
    status === 'Todo'
      ? 'bg-slate-400'
      : status ===
          'InProgress'
        ? 'bg-sky-400'
        : status ===
            'Completed'
          ? 'bg-emerald-400'
          : 'bg-rose-400'

  return (
    <span
      className={`
        size-2
        shrink-0
        rounded-full
        ${className}
      `}
    />
  )
}

function compareBoardTasks(
  a: Task,
  b: Task,
) {
  const priorityDifference =
    priorityRank[
      b.priority
    ] -
    priorityRank[
      a.priority
    ]

  if (
    priorityDifference !== 0
  ) {
    return priorityDifference
  }

  if (
    a.dueDate &&
    b.dueDate
  ) {
    return a.dueDate.localeCompare(
      b.dueDate,
    )
  }

  if (a.dueDate) {
    return -1
  }

  if (b.dueDate) {
    return 1
  }

  return (
    new Date(
      b.createdAt,
    ).getTime() -
    new Date(
      a.createdAt,
    ).getTime()
  )
}

export default TaskBoardView