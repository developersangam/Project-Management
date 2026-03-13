import * as React from "react"
import { Task } from "../../types"
import { useAppDispatch } from "../../hooks/redux"
import { closeTaskDrawer } from "../../store/ui/uiSlice"
import { Button } from "../ui/button"
import { X, Calendar, User, AlertCircle } from "lucide-react"

interface TaskDrawerProps {
  task: Task | null
  isOpen: boolean
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({ task, isOpen }) => {
  const dispatch = useAppDispatch()

  if (!isOpen || !task) return null

  const priorityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100',
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-xl transform transition-transform z-50">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Task Details</h2>
          <Button variant="ghost" size="icon" onClick={() => dispatch(closeTaskDrawer())}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">{task.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || 'text-gray-600 bg-gray-100'}`}>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {(task.priority as any)?.charAt(0)?.toUpperCase() + (task.priority as any)?.slice(1)} Priority
                </span>
              </div>
            </div>

            {task.description && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
                  {task.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Assignee</label>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{task.assignee?.name || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'No due date set'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border p-6">
          <div className="flex space-x-3">
            <Button className="flex-1">Edit Task</Button>
            <Button variant="outline" className="flex-1">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  )
}