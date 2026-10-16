import { toDateValue } from '../../lib/date'

import type { Task } from './taskTypes'

export type TaskDueState =
  | 'none'
  | 'today'
  | 'upcoming'
  | 'overdue'

export function getTaskDueState(
  task: Task,
): TaskDueState {
  if (
    !task.dueDate ||
    task.status === 'Completed' ||
    task.status === 'Cancelled'
  ) {
    return 'none'
  }

  const today =
    toDateValue(new Date())

  if (task.dueDate === today) {
    return 'today'
  }

  if (task.dueDate < today) {
    return 'overdue'
  }

  return 'upcoming'
}