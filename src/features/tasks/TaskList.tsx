import { useTasks } from './useTasks'
import { useTaskCategories } from './useTaskCategories'

import TaskListView from './views/TaskListView'

function TaskList() {
  const {
    tasks,
    isLoading,
    error,
    saveTask,
    changeTaskStatus,
    removeTask,
  } = useTasks()

const {
  categories,
  addCategory,
} = useTaskCategories()

  return (
    <TaskListView
      tasks={tasks}
      categories={categories}
      onCreateCategory={addCategory}
      isLoading={isLoading}
      error={error}
      onStatusChange={
        changeTaskStatus
      }
      onUpdate={saveTask}
      onDelete={removeTask}
    />
  )
}

export default TaskList