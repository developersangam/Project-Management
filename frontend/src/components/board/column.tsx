import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./taskCard"
import { Task } from "../../types"
import { Plus, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

interface ColumnProps {
  id: string
  title: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask?: () => void
}

export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  tasks,
  onTaskClick,
  onAddTask
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  const getColumnColor = (columnId: string) => {
    const colors = {
      'todo': 'border-l-blue-500',
      'in-progress': 'border-l-yellow-500',
      'review': 'border-l-purple-500',
      'done': 'border-l-green-500',
    }
    return colors[columnId as keyof typeof colors] || 'border-l-gray-500'
  }

  return (
    <div className={cn(
      "bg-muted/30 border border-border rounded-lg w-80 flex flex-col shadow-sm",
      getColumnColor(id)
    )}>
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-foreground text-sm">
            {title}
          </h3>
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
            onClick={onAddTask}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 space-y-3 min-h-0 overflow-y-auto transition-colors",
          isOver && "bg-accent/20 rounded-b-lg"
        )}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No tasks yet
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={onAddTask}
            >
              Add a task
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}