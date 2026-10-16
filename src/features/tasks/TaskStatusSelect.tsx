import PillSelect from '../../components/ui/PillSelect'

import type { TaskStatus } from './taskTypes'

type TaskStatusSelectProps = {
  value: TaskStatus
  onChange: (
    status: TaskStatus,
  ) => void
}

const statusOptions = [
  {
    value: 'Todo',
    label: 'To-Do',
    variant: 'neutral',
  },
  {
    value: 'InProgress',
    label: 'In Progress',
    variant: 'info',
  },
  {
    value: 'Completed',
    label: 'Completed',
    variant: 'success',
  },
  {
    value: 'Cancelled',
    label: 'Cancelled',
    variant: 'danger',
  },
] satisfies {
  value: TaskStatus
  label: string
  variant:
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
}[]

function TaskStatusSelect({
  value,
  onChange,
}: TaskStatusSelectProps) {
  return (
    <PillSelect
      value={value}
      options={statusOptions}
      onValueChange={onChange}
    />
  )
}

export default TaskStatusSelect