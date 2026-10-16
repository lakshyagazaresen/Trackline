export type TaskCategoryColor =
  | 'Slate'
  | 'Sky'
  | 'Blue'
  | 'Indigo'
  | 'Violet'
  | 'Fuchsia'
  | 'Rose'
  | 'Orange'
  | 'Amber'
  | 'Lime'
  | 'Emerald'
  | 'Teal'
  | 'Cyan'
  | 'Pink'

export type TaskCategory = {
  id: number
  userId: string
  name: string
  color: TaskCategoryColor
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CreateTaskCategoryInput = {
  name: string
  color: TaskCategoryColor
}

export type UpdateTaskCategoryInput = {
  name: string
  color: TaskCategoryColor
  sortOrder: number
}