import { useState, type SubmitEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Plus,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import DatePicker from '../../../components/ui/DatePicker'
import PrioritySelect from '../../../components/ui/PrioritySelect'
import TaskCategorySelect from './TaskCategorySelect'

import type { Priority } from '../../../types/common'
import type { CreateTaskInput } from '../taskTypes'
import type {
  CreateTaskCategoryInput,
  TaskCategory,
} from '../taskCategoryTypes'


type TaskQuickAddProps = {
  categories: TaskCategory[]

  onCreateCategory: (
    input: CreateTaskCategoryInput,
  ) => Promise<TaskCategory>

  onAdd: (
    input: CreateTaskInput,
  ) => Promise<void>
}

function TaskQuickAdd({
    categories,
    onCreateCategory,
    onAdd,
    }: TaskQuickAddProps) {
  const [open, setOpen] =
    useState(false)

  const [showDetails, setShowDetails] =
    useState(false)

  const [title, setTitle] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [priority, setPriority] =
    useState<Priority>('Medium')

    const [
        categoryId,
        setCategoryId,
        ] = useState<number | null>(null)

  const [dueDate, setDueDate] =
    useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  function resetForm() {
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategoryId(null)
    setDueDate(null)
    setShowDetails(false)
    setError(null)
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const trimmedTitle =
      title.trim()

    const trimmedDescription =
      description.trim()

    if (!trimmedTitle) {
      setError(
        'Give your task a title.',
      )
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await onAdd({
        title: trimmedTitle,
        description:
            trimmedDescription || null,
        priority,
        dueDate,
        categoryId,
        })

      resetForm()
      setOpen(false)
    } catch (error) {
      console.error(error)

      setError(
        'Could not add the task.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleOpenChange(
    nextOpen: boolean,
  ) {
    setOpen(nextOpen)

    if (!nextOpen) {
      resetForm()
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={
        handleOpenChange
      }
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Add task"
          className="
            fixed
            right-4
            z-40

            bottom-[calc(env(safe-area-inset-bottom)+6rem)]

            flex size-14
            items-center
            justify-center

            rounded-2xl
            bg-sky-400
            text-slate-950

            shadow-xl
            shadow-black/30

            transition
            duration-200

            hover:-translate-y-1
            hover:rotate-3
            hover:scale-105
            hover:bg-sky-300

            active:scale-95

            lg:bottom-8
            lg:right-8
            "
        >
          <Plus
            size={26}
            strokeWidth={2.5}
          />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 z-50
            bg-slate-950/70
            backdrop-blur-sm
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
          "
        />

        <Dialog.Content
          className="
            fixed bottom-0 left-0 right-0 z-50
            max-h-[90vh]
            overflow-y-auto
            rounded-t-3xl
            border border-slate-800
            bg-slate-950
            p-5
            shadow-2xl
            outline-none

            md:bottom-auto
            md:left-1/2
            md:right-auto
            md:top-1/2
            md:w-[520px]
            md:-translate-x-1/2
            md:-translate-y-1/2
            md:rounded-3xl
            md:p-6
          "
        >
          {/* Mobile drag handle */}
          <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-700 md:hidden" />

          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-slate-100">
                New task
              </Dialog.Title>

              <Dialog.Description className="mt-1 text-sm text-slate-500">
                What needs doing?
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="
                  rounded-full
                  p-2
                  text-slate-500
                  transition
                  hover:bg-slate-800
                  hover:text-slate-200
                "
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              autoFocus
              value={title}
              onChange={(event) =>
                setTitle(
                  event.currentTarget.value,
                )
              }
              maxLength={200}
              placeholder="Add something to your radar..."
              className="
                w-full
                rounded-2xl
                border border-slate-800
                bg-slate-900
                px-4 py-4
                text-base
                text-slate-100
                outline-none
                transition
                placeholder:text-slate-600
                focus:border-sky-500
                focus:ring-2
                focus:ring-sky-500/20
              "
            />

            {!showDetails && (
              <button
                type="button"
                onClick={() =>
                  setShowDetails(true)
                }
                className="
                  inline-flex
                  items-center gap-2
                  rounded-full
                  px-3 py-2
                  text-sm
                  text-slate-400
                  transition
                  hover:bg-slate-900
                  hover:text-slate-200
                "
              >
                <SlidersHorizontal
                  size={15}
                />

                Add details
              </button>
            )}

            {showDetails && (
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.currentTarget.value,
                    )
                  }
                  maxLength={4000}
                  rows={3}
                  placeholder="A few more details..."
                  className="
                    w-full resize-none
                    rounded-xl
                    border border-slate-800
                    bg-slate-950
                    px-3 py-3
                    text-sm
                    text-slate-200
                    outline-none
                    placeholder:text-slate-600
                    focus:border-slate-600
                  "
                />

                <div className="flex flex-wrap items-center gap-3">
                  <PrioritySelect
                    value={priority}
                    onChange={setPriority}
                  />

                  <TaskCategorySelect
                    categories={categories}
                    value={categoryId}
                    onChange={setCategoryId}
                    onCreateCategory={onCreateCategory}
                    />

                  <DatePicker
                  compact
                    value={dueDate}
                    onChange={setDueDate}
                    placeholder="No due date"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="
                    rounded-xl
                    px-4 py-2.5
                    text-sm
                    text-slate-400
                    transition
                    hover:bg-slate-900
                    hover:text-slate-200
                  "
                >
                  Cancel
                </button>
              </Dialog.Close>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  rounded-xl
                  bg-sky-400
                  px-5 py-2.5
                  text-sm
                  font-semibold
                  text-slate-950
                  transition
                  hover:bg-sky-300
                  active:scale-95
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isSubmitting
                  ? 'Adding...'
                  : 'Add task'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default TaskQuickAdd