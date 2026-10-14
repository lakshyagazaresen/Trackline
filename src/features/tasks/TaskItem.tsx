import type { Task } from './tasksApi'

type TaskItemProps = {
  task: Task
  onToggle: (
    id: number,
    completed: boolean,
  ) => void
  onDelete: (id: number) => void
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(event) =>
            onToggle(
              task.id,
              event.currentTarget.checked,
            )
          }
        />

        <span
          className={
            task.completed
              ? 'text-slate-500 line-through'
              : 'text-slate-200'
          }
        >
          {task.title}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="text-sm text-slate-500 hover:text-red-400"
      >
        Delete
      </button>
    </div>
  )
}

export default TaskItem