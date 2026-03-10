import * as React from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Column } from "./column"
import { TaskCard } from "./taskCard"
import { Task } from "../../types"
import { useAppDispatch } from "../../hooks/redux"
import { updateTaskThunk } from "../../store/task/taskThunk"

interface BoardContainerProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export const BoardContainer: React.FC<BoardContainerProps> = ({ tasks, onTaskClick }) => {
  const dispatch = useAppDispatch()
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
    { id: 'in-progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in-progress') },
    { id: 'done', title: 'Done', tasks: tasks.filter(t => t.status === 'done') },
  ]

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    let newStatus: Task['status'] = activeTask.status

    if (overId === 'todo' || overId === 'in-progress' || overId === 'done') {
      newStatus = overId as Task['status']
    } else {
      // Dropped on another task, find its column
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        newStatus = overTask.status
      }
    }

    if (newStatus !== activeTask.status) {
      dispatch(updateTaskThunk({ ...activeTask, status: newStatus }))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-6 overflow-x-auto pb-6 px-2">
        {columns.map(column => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  )
}