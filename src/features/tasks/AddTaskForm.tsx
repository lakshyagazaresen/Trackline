import { useState } from 'react'

type AddTaskFormProps = {
  onAdd: (title: string) => Promise<void>
}

function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] =
      useState<string | null>(null)
  

  async function handleSubmit(
  event: React.SubmitEvent<HTMLFormElement>
) {
  event.preventDefault()

  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    setValidationError('Please enter a task title.')
    return
  }

  if (trimmedTitle.length > 200) {
    setValidationError(
      'Task title must be 200 characters or fewer.'
    )
    return
  }

  try {
    setValidationError(null)
    setIsSubmitting(true)

    await onAdd(trimmedTitle)

    setTitle('')
  } catch {
    // TaskList handles API/network errors.
  } finally {
    setIsSubmitting(false)
  }
}

  return (
  <div>
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
    >
      <input
        type="text"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value)

          if (validationError) {
            setValidationError(null)
          }
        }}
        placeholder="Add a task..."
        maxLength={200}
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-white px-4 py-2 font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>

    {validationError && (
      <p className="mt-2 text-sm text-red-400">
        {validationError}
      </p>
    )}
  </div>
)
}

export default AddTaskForm