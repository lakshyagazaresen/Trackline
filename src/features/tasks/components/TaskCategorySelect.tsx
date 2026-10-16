import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'

import {
  Check,
  ChevronDown,
  Plus,
  Tags,
  X,
} from 'lucide-react'

import {
  taskCategoryColors,
} from '../taskCategoryColors'

import type {
  CreateTaskCategoryInput,
  TaskCategory,
  TaskCategoryColor,
} from '../taskCategoryTypes'

const categoryColorOptions: TaskCategoryColor[] = [
  'Slate',
  'Sky',
  'Blue',
  'Indigo',
  'Violet',
  'Fuchsia',
  'Rose',
  'Orange',
  'Amber',
  'Lime',
  'Emerald',
  'Teal',
  'Cyan',
  'Pink',
]

type TaskCategorySelectProps = {
  categories: TaskCategory[]

  value: number | null

  onChange: (
    categoryId: number | null,
  ) => void

  onCreateCategory?: (
    input: CreateTaskCategoryInput,
  ) => Promise<TaskCategory>

  disabled?: boolean
}

function TaskCategorySelect({
  categories,
  value,
  onChange,
  onCreateCategory,
  disabled = false,
}: TaskCategorySelectProps) {
  const [open, setOpen] =
    useState(false)

  const [creating, setCreating] =
    useState(false)

  const [newName, setNewName] =
    useState('')

  const [newColor, setNewColor] =
    useState<TaskCategoryColor>(
      'Sky',
    )

  const [
    isCreating,
    setIsCreating,
  ] = useState(false)

  const [
    createError,
    setCreateError,
  ] = useState<string | null>(
    null,
  )

  const selectedCategory =
    categories.find(
      (category) =>
        category.id === value,
    ) ?? null

  function resetCreator() {
    setCreating(false)
    setNewName('')
    setNewColor('Sky')
    setCreateError(null)
  }

  function handleOpenChange(
    nextOpen: boolean,
  ) {
    setOpen(nextOpen)

    if (!nextOpen) {
      resetCreator()
    }
  }

  function selectCategory(
    categoryId: number | null,
  ) {
    onChange(categoryId)
    setOpen(false)
  }

  async function handleCreateCategory() {
    if (!onCreateCategory) {
      return
    }

    const name =
      newName.trim()

    if (!name) {
      setCreateError(
        'Enter a category name.',
      )

      return
    }

    try {
      setIsCreating(true)
      setCreateError(null)

      const category =
        await onCreateCategory({
          name,
          color: newColor,
        })

      onChange(category.id)

      resetCreator()
      setOpen(false)
    } catch (error) {
      console.error(error)

      setCreateError(
        'Could not create category.',
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={
        handleOpenChange
      }
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`
            inline-flex
            items-center
            gap-1.5

            rounded-full
            border
            px-2.5 py-1

            text-xs
            font-medium

            outline-none
            transition-all

            hover:scale-[1.03]
            active:scale-95

            focus-visible:ring-2
            focus-visible:ring-sky-500/50

            disabled:cursor-not-allowed
            disabled:opacity-50

            ${
              selectedCategory
                ? taskCategoryColors[
                    selectedCategory.color
                  ].pill
                : `
                  border-slate-700
                  bg-slate-800
                  text-slate-400
                `
            }
          `}
        >
          {selectedCategory ? (
            <span
              className={`
                size-2
                rounded-full
                ${
                  taskCategoryColors[
                    selectedCategory.color
                  ].dot
                }
              `}
            />
          ) : (
            <Tags size={13} />
          )}

          <span>
            {selectedCategory
              ? selectedCategory.name
              : 'Category'}
          </span>

          <ChevronDown
            size={12}
            strokeWidth={2.5}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="
            z-50
            w-64

            rounded-2xl
            border border-slate-700
            bg-slate-900
            p-2

            shadow-2xl
            shadow-black/30

            outline-none
          "
        >
          <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Category
          </p>

          <button
            type="button"
            onClick={() =>
              selectCategory(null)
            }
            className="
              flex w-full
              items-center
              gap-3

              rounded-xl
              px-3 py-2.5

              text-left
              text-sm
              text-slate-400

              transition
              hover:bg-slate-800
            "
          >
            <div className="flex size-5 items-center justify-center">
              {value === null && (
                <Check size={15} />
              )}
            </div>

            <span>
              No category
            </span>
          </button>

          <div className="my-1 h-px bg-slate-800" />

          <div className="space-y-1">
            {categories.map(
              (category) => {
                const color =
                  taskCategoryColors[
                    category.color
                  ]

                const isSelected =
                  category.id === value

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      selectCategory(
                        category.id,
                      )
                    }
                    className="
                      flex w-full
                      items-center
                      gap-3

                      rounded-xl
                      px-3 py-2.5

                      text-left
                      text-sm
                      text-slate-300

                      transition

                      hover:bg-slate-800
                      hover:text-slate-100
                    "
                  >
                    <div className="flex size-5 items-center justify-center">
                      {isSelected ? (
                        <Check
                          size={15}
                        />
                      ) : (
                        <span
                          className={`
                            size-2.5
                            rounded-full
                            ${color.dot}
                          `}
                        />
                      )}
                    </div>

                    <span className="min-w-0 flex-1 truncate">
                      {category.name}
                    </span>
                  </button>
                )
              },
            )}
          </div>

          {categories.length === 0 &&
            !creating && (
              <p className="px-3 py-3 text-center text-sm text-slate-500">
                No categories yet.
              </p>
            )}

          {onCreateCategory && (
            <>
              <div className="my-2 h-px bg-slate-800" />

              {!creating ? (
                <button
                  type="button"
                  onClick={() => {
                    setCreating(true)
                    setCreateError(null)
                  }}
                  className="
                    flex w-full
                    items-center
                    gap-2

                    rounded-xl
                    px-3 py-2.5

                    text-sm
                    font-medium
                    text-sky-300

                    transition

                    hover:bg-slate-800
                    hover:text-sky-200
                  "
                >
                  <Plus size={16} />

                  New category
                </button>
              ) : (
                <div
                  className="
                    space-y-3
                    rounded-xl
                    bg-slate-950/50
                    p-3
                  "
                >
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={newName}
                      onChange={(
                        event,
                      ) =>
                        setNewName(
                          event
                            .currentTarget
                            .value,
                        )
                      }
                      maxLength={100}
                      placeholder="Category name"
                      className="
                        min-w-0
                        flex-1

                        rounded-xl
                        border
                        border-slate-700

                        bg-slate-950
                        px-3 py-2

                        text-sm
                        text-slate-200

                        outline-none

                        placeholder:text-slate-600

                        focus:border-sky-500
                        focus:ring-2
                        focus:ring-sky-500/20
                      "
                    />

                    <button
                      type="button"
                      aria-label="Cancel new category"
                      onClick={
                        resetCreator
                      }
                      className="
                        flex size-8
                        shrink-0
                        items-center
                        justify-center

                        rounded-lg
                        text-slate-500

                        transition

                        hover:bg-slate-800
                        hover:text-slate-200
                      "
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div>
                    <p className="mb-2 text-xs text-slate-500">
                      Pick a colour
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {categoryColorOptions.map(
                        (color) => {
                          const isSelected =
                            color ===
                            newColor

                          return (
                            <button
                              key={
                                color
                              }
                              type="button"
                              title={
                                color
                              }
                              aria-label={`Use ${color}`}
                              onClick={() =>
                                setNewColor(
                                  color,
                                )
                              }
                              className={`
                                flex
                                size-7
                                items-center
                                justify-center
                                rounded-full

                                transition

                                ${
                                  isSelected
                                    ? `
                                      ring-2
                                      ring-slate-200
                                      ring-offset-2
                                      ring-offset-slate-900
                                    `
                                    : `
                                      hover:scale-110
                                    `
                                }
                              `}
                            >
                              <span
                                className={`
                                  size-5
                                  rounded-full
                                  ${
                                    taskCategoryColors[
                                      color
                                    ].dot
                                  }
                                `}
                              />
                            </button>
                          )
                        },
                      )}
                    </div>
                  </div>

                  {createError && (
                    <p className="text-xs text-red-300">
                      {createError}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={
                      isCreating
                    }
                    onClick={() => {
                      void handleCreateCategory()
                    }}
                    className="
                      w-full

                      rounded-xl
                      bg-sky-400
                      px-3 py-2

                      text-sm
                      font-semibold
                      text-slate-950

                      transition

                      hover:bg-sky-300
                      active:scale-[0.98]

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {isCreating
                      ? 'Creating...'
                      : 'Create category'}
                  </button>
                </div>
              )}
            </>
          )}

          <Popover.Arrow
            className="fill-slate-700"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default TaskCategorySelect