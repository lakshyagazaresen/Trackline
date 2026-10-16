import { useState } from 'react'

import TaskQuickAdd from './components/TaskQuickAdd'
import TaskViewSwitcher from './components/TaskViewSwitcher'
import TaskDetail from './components/TaskDetail'

import TaskBoardView from './views/TaskBoardView'
import TaskCalendarView from './views/TaskCalendarView'
import TaskListView from './views/TaskListView'

import { useTasks } from './useTasks'
import {
  useTaskCategories,
} from './useTaskCategories'

import type {
  TaskView,
} from './components/TaskViewSwitcher'

function TasksPage() {
  const [view, setView] =
    useState<TaskView>('list')
  
  const [
    selectedTaskId,
    setSelectedTaskId,
  ] = useState<number | null>(null)

  const {
    categories,
    addCategory,
  } = useTaskCategories()
  

  const {
    tasks,
    isLoading,
    error,
    addTask,
    saveTask,
    changeTaskStatus,
    removeTask,
  } = useTasks()

  const selectedTask =
    tasks.find(
      (task) =>
        task.id === selectedTaskId,
    ) ?? null
  

  return (
    <div className="mx-auto w-full max-w-6xl pb-24">
      <header className="mb-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-slate-500">
              Get things moving
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Tasks
            </h1>
          </div>
        </div>

        <div className="mt-5">
          <TaskViewSwitcher
            value={view}
            onChange={setView}
          />
        </div>
      </header>

      <main>
        {view === 'list' && (
          <TaskListView
            tasks={tasks}
            categories={categories}
            onCreateCategory={addCategory}
            isLoading={isLoading}
            error={error}
            onStatusChange={changeTaskStatus}
            onUpdate={saveTask}
            onDelete={removeTask}
            onEdit={setSelectedTaskId}
          />
        )}

        {view ===
  'calendar' && (
  <TaskCalendarView
    tasks={tasks}
    categories={
      categories
    }
    onCreateCategory={
      addCategory
    }
    onStatusChange={
      changeTaskStatus
    }
    onUpdate={
      saveTask
    }
    onDelete={
      removeTask
    }
    onEdit={
      setSelectedTaskId
    }
  />
)}

        {view ===
  'board' && (
  <TaskBoardView
    tasks={tasks}
    categories={
      categories
    }
    onCreateCategory={
      addCategory
    }
    onStatusChange={
      changeTaskStatus
    }
    onUpdate={
      saveTask
    }
    onDelete={
      removeTask
    }
    onEdit={
      setSelectedTaskId
    }
  />
)}
      </main>
      <TaskQuickAdd
        categories={categories}
        onCreateCategory={addCategory}
        onAdd={addTask}
      />

      <TaskDetail
        task={selectedTask}
        categories={categories}
        onCreateCategory={addCategory}
        open={selectedTask !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTaskId(null)
          }
        }}
        onSave={saveTask}
      />
    </div>
  )
}

export default TasksPage