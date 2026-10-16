import {
  useState,
} from 'react'

import {
  motion,
} from 'motion/react'

import {
  Check,
} from 'lucide-react'

import TaskCard from './TaskCard'

import type {
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '../taskTypes'

import type {
  CreateTaskCategoryInput,
  TaskCategory,
} from '../taskCategoryTypes'

type SwipeableTaskCardProps = {
  task: Task
  categories: TaskCategory[]
    onCreateCategory: (
    input: CreateTaskCategoryInput,
    ) => Promise<TaskCategory>

  onStatusChange: (
    task: Task,
    status: TaskStatus,
  ) => Promise<void>

  onUpdate: (
    id: number,
    input: UpdateTaskInput,
  ) => Promise<Task>

  onDelete: (
    id: number,
  ) => void

  onEdit?: (
    id: number,
  ) => void

  onSwipeComplete: (
    task: Task,
  ) => Promise<void>
}

function SwipeableTaskCard({
  task,
  categories,
  onCreateCategory,
  onStatusChange,
  onUpdate,
  onDelete,
  onEdit,
  onSwipeComplete,
}: SwipeableTaskCardProps) {
  const [
    isCompleting,
    setIsCompleting,
  ] = useState(false)

  const canComplete =
    task.status !== 'Completed' &&
    task.status !== 'Cancelled'

  async function handleDragEnd(
    _event:
      | MouseEvent
      | TouchEvent
      | PointerEvent,
    info: {
      offset: {
        x: number
      }
      velocity: {
        x: number
      }
    },
  ) {
    if (
      !canComplete ||
      isCompleting
    ) {
      return
    }

    const passedDistance =
      info.offset.x > 90

    const fastSwipe =
      info.velocity.x > 650

    if (
      !passedDistance &&
      !fastSwipe
    ) {
      return
    }

    try {
      setIsCompleting(true)

      await onSwipeComplete(task)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
      "
    >
      {canComplete && (
        <div
          className="
            absolute inset-0
            flex items-center
            bg-emerald-500/15
            px-5
            text-emerald-300
          "
        >
          <div className="flex items-center gap-2 font-medium">
            <div
              className="
                flex size-8
                items-center
                justify-center
                rounded-full
                bg-emerald-400
                text-emerald-950
              "
            >
              <Check
                size={18}
                strokeWidth={3}
              />
            </div>

            Complete
          </div>
        </div>
      )}

      <motion.div
        drag={
          canComplete
            ? 'x'
            : false
        }
        dragConstraints={{
          left: 0,
          right: 120,
        }}
        dragElastic={0.08}
        dragSnapToOrigin
        onDragEnd={handleDragEnd}
        style={{
          touchAction: 'pan-y',
        }}
        whileDrag={{
          scale: 0.99,
        }}
        className="relative"
      >
        <TaskCard
            task={task}
            categories={categories}
            onCreateCategory={onCreateCategory}
            onStatusChange={onStatusChange}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onEdit={onEdit}
            />
      </motion.div>
    </div>
  )
}

export default SwipeableTaskCard