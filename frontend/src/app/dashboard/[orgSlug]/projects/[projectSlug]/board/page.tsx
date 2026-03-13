'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchTasks } from '@/store/task/taskThunk';
import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardLayout } from '@/components/layout/dashboardLayout'
import { BoardContainer } from '@/components/board/boardContainer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function BoardPage() {
  const params = useParams()
  const projectSlug = params.projectSlug as string
  const orgSlug = params.orgSlug as string
  const dispatch = useAppDispatch()
  const { tasks, loading } = useAppSelector(state => state.task)
  const { currentProject } = useAppSelector(state => state.project)
  const [showCreateTask, setShowCreateTask] = useState(false)

  useEffect(() => {
    if (projectSlug) {
      dispatch(fetchTasks(projectSlug) as any)
    }
  }, [dispatch, projectSlug])

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                {currentProject?.name || 'Project Board'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Organize and track tasks across your project
              </p>
            </div>
            <Button onClick={() => setShowCreateTask(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <p className="text-muted-foreground">Loading board...</p>
            </div>
          ) : (
            <BoardContainer
              projectSlug={projectSlug}
              orgSlug={orgSlug}
              tasks={tasks}
              columns={currentProject?.columns || []}
              showCreateTask={showCreateTask}
              onCreateTaskClose={() => setShowCreateTask(false)}
            />
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
