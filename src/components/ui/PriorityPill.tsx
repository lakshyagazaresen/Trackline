import Pill from './Pill'
import type { PillVariant } from './Pill'
import type { Priority } from '../../types/common'

type PriorityPillProps = {
  priority: Priority
}

const priorityVariants: Record<
  Priority,
  PillVariant
> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Urgent: 'danger',
}

function PriorityPill({
  priority,
}: PriorityPillProps) {
  return (
    <Pill variant={priorityVariants[priority]}>
      {priority}
    </Pill>
  )
}

export default PriorityPill