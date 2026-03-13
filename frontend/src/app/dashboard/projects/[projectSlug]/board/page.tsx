'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { fetchTasks } from '@/store/task/taskThunk'
import { openTaskDrawer } from '@/store/ui/uiSlice'
import { BoardContainer } from '@/components/board/boardContainer'
import { TaskDrawer } from '@/components/board/taskDrawer'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, Settings } from 'lucide-react'

export default function BoardPage() {
  const params = useParams()
  const router = useRouter()
  const projectSlug = params.projectSlug as string
  const orgSlug = params.orgSlug as string
  const dispatch = useAppDispatch()
  const { tasks, loading } = useAppSelector(state => state.task)
  const { currentProject } = useAppSelector(state => state.project)
  const { taskDrawerOpen, selectedTask } = useAppSelector(state => state.ui)

  React.useEffect(() => {
    if (projectSlug) {
      dispatch(fetchTasks(projectSlug))
    }
  }, [projectSlug, dispatch])

  const handleTaskClick = (task: any) => {
    dispatch(openTaskDrawer(task))
  }

  // Default columns if project doesn't have them
  const columns = currentProject?.columns || [
    { id: 'todo', name: 'To Do', position: 0 },
    { id: 'in-progress', name: 'In Progress', position: 1 },
    { id: 'done', name: 'Done', position: 2 },
  ]

  return (
    <div className="relative space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
            <p className="text-sm text-muted-foreground">
              {currentProject?.name && `${currentProject.name} - `}
              Drag and drop tasks to organize your work
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/tasks/create">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${projectSlug}`}>
              <Settings className="w-4 h-4 mr-2" />
              Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      ) : (
        <BoardContainer 
          tasks={tasks} 
          columns={columns}
          projectSlug={projectSlug}
          orgSlug={orgSlug || ''}
          onTaskClick={handleTaskClick} 
        />
      )}

      {/* Task Drawer */}
      <TaskDrawer task={selectedTask} isOpen={taskDrawerOpen} />
    </div>
  )
}