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
import { Task, Column as ColumnType } from "../../types"
import { useAppDispatch } from "../../hooks/redux"
import { updateTaskThunk } from "../../store/task/taskThunk"

interface BoardContainerProps {
  tasks: Task[]
  columns: ColumnType[]
  projectSlug: string
  orgSlug: string
  showCreateTask?: boolean
  onCreateTaskClose?: () => void
  onTaskClick?: (task: Task) => void
}

export const BoardContainer: React.FC<BoardContainerProps> = ({
  tasks,
  columns,
  projectSlug,
  orgSlug,
  showCreateTask = false,
  onCreateTaskClose,
  onTaskClick,
}) => {
  const dispatch = useAppDispatch()
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Group tasks by column
  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(t => t.columnId === columnId)
  }

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

    let newColumnId = activeTask.columnId
    let newStatus = activeTask.status

    // Check if dropped on a column
    const overColumn = columns.find(c => c.id === overId)
    if (overColumn) {
      newColumnId = overId
      // Map column name to status
      const statusMap: Record<string, any> = {
        'To Do': 'TODO',
        'In Progress': 'IN_PROGRESS',
        'Done': 'DONE',
      }
      newStatus = statusMap[overColumn.name] || activeTask.status
    } else {
      // Dropped on another task, find its column
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        newColumnId = overTask.columnId
        newStatus = overTask.status
      }
    }

    if (newColumnId !== activeTask.columnId || newStatus !== activeTask.status) {
      dispatch(
        updateTaskThunk({
          ...activeTask,
          columnId: newColumnId,
          status: newStatus,
        })
      )
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-6 overflow-x-auto pb-6 px-2">
        {columns && columns.length > 0 ? (
          columns.map(column => (
            <Column
              key={column.id}
              id={column.id}
              title={column.name}
              tasks={getTasksByColumn(column.id)}
              onTaskClick={onTaskClick}
              projectSlug={projectSlug}
              orgSlug={orgSlug}
            />
          ))
        ) : (
          <div className="text-muted-foreground">No columns available</div>
        )}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  )
}