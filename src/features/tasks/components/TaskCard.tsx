import ActionMenu from '../../../components/ui/ActionMenu'
import DatePicker from '../../../components/ui/DatePicker'
import PrioritySelect from '../../../components/ui/PrioritySelect'
import { getTaskDueState } from '../taskUtils'

import TaskStatusSelect from '../TaskStatusSelect'

import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '../taskTypes'
import TaskCategorySelect from './TaskCategorySelect'

import type {
  CreateTaskCategoryInput,
  TaskCategory,
} from '../taskCategoryTypes'

type TaskCardProps = {
  task: Task
  categories: TaskCategory[]
  onCreateCategory: (
    input: CreateTaskCategoryInput,
    ) => Promise<TaskCategory>

  onEdit?: (
    id: number,
    ) => void

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
}

function TaskCard({
  task,
  categories,
  onCreateCategory,
  onEdit,
  onStatusChange,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const isCompleted =
    task.status === 'Completed'

  const isCancelled =
    task.status === 'Cancelled'

    
    const dueState =
        getTaskDueState(task)

  async function changePriority(
    priority: Task['priority'],
  ) {
    await onUpdate(task.id, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority,
      categoryId: task.categoryId,  
      dueDate: task.dueDate,
    })
  }
  
  async function changeCategory(
    categoryId: number | null,
    ) {
    await onUpdate(task.id, {
        title: task.title,
        description:
        task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        categoryId,
    })
    }

  async function changeDueDate(
    dueDate: string | null,
  ) {
    await onUpdate(task.id, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      categoryId: task.categoryId,
      dueDate,
    })
  }

  return (
    <article
        className={`
            rounded-2xl
            border
            bg-slate-900
            p-4
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:shadow-lg
            hover:shadow-black/10

            ${
            isCompleted
                ? 'border-emerald-950/70 opacity-75'
                : dueState === 'overdue'
                ? 'border-red-900/60'
                : dueState === 'today'
                    ? 'border-amber-800/60'
                    : 'border-slate-800 hover:border-slate-700'
            }
        `}
        >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() =>
                onEdit?.(task.id)
            }
            className="
                min-w-0 flex-1
                text-left
                outline-none
                rounded-xl
                focus-visible:ring-2
                focus-visible:ring-sky-500/50
            "
            >
            <h3
                className={`
                font-medium
                leading-snug
                transition-colors

                ${
                    isCompleted
                    ? 'text-slate-500 line-through'
                    : isCancelled
                        ? 'text-slate-500'
                        : 'text-slate-100'
                }
                `}
            >
                {task.title}
            </h3>

            {task.description && (
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                {task.description}
                </p>
            )}
            </button>
        </div>
        {dueState === 'overdue' && (
            <p className="mt-3 text-xs font-medium text-red-400">
                Overdue
            </p>
            )}

            {dueState === 'today' && (
            <p className="mt-3 text-xs font-medium text-amber-300">
                Due today
            </p>
            )}

        <ActionMenu
            onEdit={
                onEdit
                ? () => onEdit(task.id)
                : undefined
            }
            onDelete={() =>
                onDelete(task.id)
            }
            />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TaskStatusSelect
            value={task.status}
            onChange={(status) => {
                void onStatusChange(
                task,
                status,
                )
            }}
            />

        <PrioritySelect
          value={task.priority}
          onChange={(priority) => {
            void changePriority(
              priority,
            )
          }}
        />

        <TaskCategorySelect
            categories={categories}
            value={task.categoryId}
            onChange={(categoryId) => {
                void changeCategory(categoryId)
            }}
            onCreateCategory={onCreateCategory}
            />

        <DatePicker
        compact
          value={task.dueDate}
          onChange={(dueDate) => {
            void changeDueDate(
              dueDate,
            )
          }}
          placeholder="Add date"
        />
      </div>
    </article>
  )
}

export default TaskCard