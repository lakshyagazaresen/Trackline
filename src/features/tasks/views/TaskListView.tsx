import { useState } from 'react'

import TaskFilterBar from '../components/TaskFilterBar'
import TaskSearchSortBar from '../components/TaskSearchSortBar'
import SwipeableTaskCard from '../components/SwipeableTaskCard'
import UndoToast from '../../../components/ui/UndoToast'

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

import type {
  TaskSmartFilter,
} from '../components/TaskFilterBar'

import type {
  TaskSort,
} from '../components/TaskSearchSortBar'

type TaskListViewProps = {
  tasks: Task[]
  categories: TaskCategory[]

  isLoading: boolean
  error: string | null

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

const priorityRank: Record<
  Task['priority'],
  number
> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Urgent: 4,
}

function TaskListView({
  tasks,
  categories,
  isLoading,
  error,
  onCreateCategory,
  onStatusChange,
  onUpdate,
  onDelete,
  onEdit,
}: TaskListViewProps) {
  const [
    filter,
    setFilter,
  ] =
    useState<TaskSmartFilter>(
      'all',
    )

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const [
    sortBy,
    setSortBy,
  ] =
    useState<TaskSort>(
      'dueDate',
    )

  const [
    undoTask,
    setUndoTask,
  ] =
    useState<Task | null>(
      null,
    )

  const [
    undoOpen,
    setUndoOpen,
  ] = useState(false)

  const today =
    toDateValue(
      new Date(),
    )

  function isOpenTask(
    task: Task,
  ) {
    return (
      task.status !==
        'Completed' &&
      task.status !==
        'Cancelled'
    )
  }

  /*
   * Filter counts always use the
   * complete task collection.
   *
   * Search should not change:
   *
   * Today 3
   * Upcoming 5
   * etc.
   */
  const counts: Record<
    TaskSmartFilter,
    number
  > = {
    all: tasks.length,

    today: tasks.filter(
      (task) =>
        isOpenTask(task) &&
        task.dueDate ===
          today,
    ).length,

    upcoming:
      tasks.filter(
        (task) =>
          isOpenTask(
            task,
          ) &&
          task.dueDate !==
            null &&
          task.dueDate >
            today,
      ).length,

    overdue:
      tasks.filter(
        (task) =>
          isOpenTask(
            task,
          ) &&
          task.dueDate !==
            null &&
          task.dueDate <
            today,
      ).length,

    completed:
      tasks.filter(
        (task) =>
          task.status ===
          'Completed',
      ).length,
  }

  /*
   * STEP 1
   * Smart filter
   */
  const filteredTasks =
    tasks.filter(
      (task) => {
        switch (filter) {
          case 'today':
            return (
              isOpenTask(
                task,
              ) &&
              task.dueDate ===
                today
            )

          case 'upcoming':
            return (
              isOpenTask(
                task,
              ) &&
              task.dueDate !==
                null &&
              task.dueDate >
                today
            )

          case 'overdue':
            return (
              isOpenTask(
                task,
              ) &&
              task.dueDate !==
                null &&
              task.dueDate <
                today
            )

          case 'completed':
            return (
              task.status ===
              'Completed'
            )

          case 'all':
          default:
            return true
        }
      },
    )

  /*
   * STEP 2
   * Search
   *
   * Searches:
   * - title
   * - description
   * - category name
   */
  const normalizedSearch =
    searchQuery
      .trim()
      .toLowerCase()

  const searchedTasks =
    filteredTasks.filter(
      (task) => {
        if (
          !normalizedSearch
        ) {
          return true
        }

        const category =
          categories.find(
            (category) =>
              category.id ===
              task.categoryId,
          )

        const searchableText =
          [
            task.title,
            task.description ??
              '',
            category?.name ??
              '',
          ]
            .join(' ')
            .toLowerCase()

        return searchableText.includes(
          normalizedSearch,
        )
      },
    )

  /*
   * STEP 3
   * Sort
   *
   * Copy the array first because
   * Array.sort() mutates.
   */
  const visibleTasks = [
    ...searchedTasks,
  ].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return (
          priorityRank[
            b.priority
          ] -
          priorityRank[
            a.priority
          ]
        )

      case 'createdAt':
        return (
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime()
        )

      case 'title':
        return a.title.localeCompare(
          b.title,
          undefined,
          {
            sensitivity:
              'base',
          },
        )

      case 'dueDate':
      default:
        if (
          a.dueDate ===
            null &&
          b.dueDate ===
            null
        ) {
          return 0
        }

        if (
          a.dueDate ===
          null
        ) {
          return 1
        }

        if (
          b.dueDate ===
          null
        ) {
          return -1
        }

        return a.dueDate.localeCompare(
          b.dueDate,
        )
    }
  })

  async function handleSwipeComplete(
    task: Task,
  ) {
    await onStatusChange(
      task,
      'Completed',
    )

    /*
     * task is the previous
     * snapshot, so its old
     * status can be restored
     * by Undo.
     */
    setUndoTask(task)
    setUndoOpen(true)
  }

  async function handleUndo() {
    if (!undoTask) {
      return
    }

    await onStatusChange(
      undoTask,
      undoTask.status,
    )

    setUndoOpen(false)
    setUndoTask(null)
  }

  if (isLoading) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900/50
          p-8
          text-center
          text-sm
          text-slate-500
        "
      >
        Loading tasks...
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-900/50
          bg-red-950/20
          p-5
          text-sm
          text-red-300
        "
      >
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <TaskSearchSortBar
          searchQuery={
            searchQuery
          }
          onSearchChange={
            setSearchQuery
          }
          sortBy={sortBy}
          onSortChange={
            setSortBy
          }
        />

        <TaskFilterBar
          value={filter}
          onChange={
            setFilter
          }
          counts={counts}
        />

        {visibleTasks.length >
        0 ? (
          <div className="space-y-3">
            {visibleTasks.map(
              (task) => (
                <SwipeableTaskCard
                  key={
                    task.id
                  }
                  task={
                    task
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
                  onSwipeComplete={
                    handleSwipeComplete
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

              px-6
              py-12

              text-center
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-slate-400
              "
            >
              {normalizedSearch
                ? 'No tasks match your search.'
                : 'No tasks here.'}
            </p>

            {normalizedSearch && (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery(
                    '',
                  )
                }
                className="
                  mt-3
                  text-sm
                  font-medium
                  text-sky-400

                  transition

                  hover:text-sky-300
                "
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      <UndoToast
        open={undoOpen}
        message="Task completed"
        onOpenChange={
          setUndoOpen
        }
        onUndo={() => {
          void handleUndo()
        }}
      />
    </>
  )
}

export default TaskListView