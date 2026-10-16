import PillSelect from './PillSelect'

import type { Priority } from '../../types/common'

type PrioritySelectProps = {
  value: Priority
  onChange: (
    priority: Priority,
  ) => void
  disabled?: boolean
}

const priorityOptions = [
  {
    value: 'Low',
    label: 'Low',
    variant: 'neutral',
  },
  {
    value: 'Medium',
    label: 'Medium',
    variant: 'info',
  },
  {
    value: 'High',
    label: 'High',
    variant: 'warning',
  },
  {
    value: 'Urgent',
    label: 'Urgent',
    variant: 'danger',
  },
] satisfies {
  value: Priority
  label: string
  variant:
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
}[]

function PrioritySelect({
  value,
  onChange,
  disabled = false,
}: PrioritySelectProps) {
  return (
    <PillSelect
      value={value}
      options={priorityOptions}
      onValueChange={onChange}
      disabled={disabled}
    />
  )
}

export default PrioritySelect