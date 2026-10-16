import type { Priority } from '../../types/common'

export type TaskStatus =
  | 'Todo'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'

export type Task = {
  id: number
  userId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  categoryId: number | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
}
export type CreateTaskInput = {
  title: string
  description?: string | null
  priority: Priority
  dueDate?: string | null
  categoryId: number | null
}

export type UpdateTaskInput = {
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  categoryId: number | null
  dueDate: string | null
}