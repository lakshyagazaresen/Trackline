import {
  useEffect,
  useState,
  type SubmitEvent,
} from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import {
  Save,
  X,
} from 'lucide-react'
import ScrollArea from '../../../components/ui/ScrollArea'

import DatePicker from '../../../components/ui/DatePicker'
import PrioritySelect from '../../../components/ui/PrioritySelect'
import TaskStatusSelect from '../TaskStatusSelect'
import type { Priority } from '../../../types/common'
import TaskCategorySelect from './TaskCategorySelect'

import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '../taskTypes'

import type {
  CreateTaskCategoryInput,
  TaskCategory,
} from '../taskCategoryTypes'




type TaskDetailProps = {
  task: Task | null
  categories: TaskCategory[]

  onCreateCategory: (
    input: CreateTaskCategoryInput,
  ) => Promise<TaskCategory>

  open: boolean

  onOpenChange: (
    open: boolean,
  ) => void

  onSave: (
    id: number,
    input: UpdateTaskInput,
  ) => Promise<Task>
}

function TaskDetail({
  task,
  categories,
  onCreateCategory,
  open,
  onOpenChange,
  onSave,
}: TaskDetailProps) {
  const [title, setTitle] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [status, setStatus] =
    useState<TaskStatus>('Todo')

  const [priority, setPriority] =
    useState<Priority>('Medium')

    const [
        categoryId,
        setCategoryId,
        ] = useState<number | null>(null)

  const [dueDate, setDueDate] =
    useState<string | null>(null)

  const [isSaving, setIsSaving] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    if (!task) {
      return
    }

    setTitle(task.title)
    setDescription(
      task.description ?? '',
    )
    setStatus(task.status)
    setPriority(task.priority)
    setCategoryId(
        task.categoryId,
        )
    setDueDate(task.dueDate)
    setError(null)
  }, [task])

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!task) {
      return
    }

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

    if (trimmedTitle.length > 200) {
      setError(
        'Task title must be 200 characters or fewer.',
      )
      return
    }

    if (
      trimmedDescription.length >
      4000
    ) {
      setError(
        'Description must be 4000 characters or fewer.',
      )
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      await onSave(task.id, {
        title: trimmedTitle,
        description:
          trimmedDescription || null,
        status,
        priority,
        categoryId,
        dueDate,
      })

      onOpenChange(false)
    } catch (error) {
      console.error(error)

      setError(
        'Could not save your changes.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 z-50
            bg-slate-950/70
            backdrop-blur-sm
          "
        />

        <Dialog.Content
          className="
            fixed bottom-0 left-0 right-0 z-50
            max-h-[92vh]
            overflow-hidden

            rounded-t-3xl
            border border-slate-800
            bg-slate-950
            shadow-2xl
            outline-none

            md:inset-y-0
            md:left-auto
            md:right-0
            md:h-screen
            md:max-h-none
            md:w-[460px]
            md:rounded-none
            md:rounded-l-3xl
            md:border-y-0
            md:border-r-0
            md:border-l
          "
        >
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[92vh] flex-col md:h-full md:max-h-none"
          >
            {/* Mobile handle */}
            <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-slate-700 md:hidden" />

            <header className="flex shrink-0 items-start justify-between border-b border-slate-800 px-5 py-5 sm:px-6">
              <div>
                <Dialog.Title className="text-xl font-semibold text-slate-100">
                  Task details
                </Dialog.Title>

                <Dialog.Description className="mt-1 text-sm text-slate-500">
                  Make it exactly what you need.
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close task"
                  className="
                    rounded-full
                    p-2
                    text-slate-500
                    transition
                    hover:bg-slate-800
                    hover:text-slate-200
                  "
                >
                  <X size={19} />
                </button>
              </Dialog.Close>
            </header>

            <ScrollArea className="min-h-0 flex-1">
                <div className="space-y-6 px-5 py-5 sm:px-6">
                    <div>
                        <label
                        htmlFor="task-detail-title"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                        Task
                        </label>

                        <input
                        id="task-detail-title"
                        value={title}
                        onChange={(event) =>
                            setTitle(
                            event.currentTarget.value,
                            )
                        }
                        maxLength={200}
                        className="
                            w-full
                            rounded-2xl
                            border border-slate-800
                            bg-slate-900
                            px-4 py-3
                            text-base font-medium
                            text-slate-100
                            outline-none
                            transition
                            focus:border-sky-500
                            focus:ring-2
                            focus:ring-sky-500/20
                        "
                        />
                    </div>

                <div>
                    <label
                    htmlFor="task-detail-description"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                    Notes
                    </label>

                    <textarea
                    id="task-detail-description"
                    value={description}
                    onChange={(event) =>
                        setDescription(
                        event.currentTarget.value,
                        )
                    }
                    maxLength={4000}
                    rows={5}
                    placeholder="Add some context..."
                    className="
                        w-full resize-none
                        rounded-2xl
                        border border-slate-800
                        bg-slate-900
                        px-4 py-3
                        text-sm
                        leading-relaxed
                        text-slate-200
                        outline-none
                        transition
                        placeholder:text-slate-600
                        focus:border-slate-600
                    "
                    />
                </div>

                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                    </p>

                    <TaskStatusSelect
                    value={status}
                    onChange={setStatus}
                    />
                </div>

                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Priority
                    </p>

                    <PrioritySelect
                    value={priority}
                    onChange={setPriority}
                    />
                </div>

                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Category
                    </p>

                    <TaskCategorySelect
                        categories={categories}
                        value={categoryId}
                        onChange={setCategoryId}
                        onCreateCategory={onCreateCategory}
                        />
                    </div>

                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Due
                    </p>

                    <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    placeholder="No due date"
                    />
                </div>

                {error && (
                    <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    {error}
                    </div>
                )}
                </div>
            </ScrollArea>

            <footer className="shrink-0 border-t border-slate-800 bg-slate-950 px-5 py-4 sm:px-6">
              <button
                type="submit"
                disabled={isSaving}
                className="
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-sky-400
                  px-5 py-3
                  font-semibold
                  text-slate-950
                  transition
                  hover:bg-sky-300
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Save size={17} />

                {isSaving
                  ? 'Saving...'
                  : 'Save changes'}
              </button>
            </footer>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default TaskDetail