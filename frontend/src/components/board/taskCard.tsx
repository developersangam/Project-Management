import * as React from "react"
import { useDraggable } from "@dnd-kit/core"
import { Task } from "../../types"
import { Calendar, User as UserIcon, MessageSquare, Paperclip } from "lucide-react"
import { cn } from "../../lib/utils"

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-card border border-border rounded-lg p-3 cursor-pointer hover:shadow-lg transition-all duration-200 group",
        isDragging && "opacity-50 rotate-2 shadow-2xl"
      )}
      onClick={onClick}
    >
      {/* Priority indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className={cn(
          "w-3 h-3 rounded-full flex-shrink-0",
          priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-500'
        )} />
        {task.labels && task.labels.length > 0 && (
          <div className="flex space-x-1">
            {task.labels.slice(0, 2).map((label: any, index: number) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <h4 className="font-medium text-foreground text-sm leading-tight mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Description preview */}
      {task.description && (
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          {/* Due date */}
          {task.dueDate && (
            <div className={cn(
              "flex items-center space-x-1",
              isOverdue && "text-red-500"
            )}>
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Comments count */}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>{task.comments.length}</span>
            </div>
          )}

          {/* Attachments count */}
          {task.attachments && task.attachments > 0 && (
            <div className="flex items-center space-x-1">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachments}</span>
            </div>
          )}
        </div>

        {/* Assignee avatar */}
        {task.assignee && (
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {task.assignee.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}