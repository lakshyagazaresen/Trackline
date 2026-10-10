type TaskItemProps = {
  id: number
  title: string
  completed: boolean
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskItem({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 p-3">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />

      <span
        className={
          completed
            ? 'flex-1 text-slate-500 line-through'
            : 'flex-1 text-slate-200'
        }
      >
        {title}
      </span>

      <button
        type="button"
        onClick={() => onDelete(id)}
        className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-800 hover:text-red-400"
      >
        Delete
      </button>
    </div>
  )
}

export default TaskItem