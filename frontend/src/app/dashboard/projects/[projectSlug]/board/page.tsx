'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { fetchTasks } from '@/store/task/taskThunk'
import { openTaskDrawer } from '@/store/ui/uiSlice'
import { BoardContainer } from '@/components/board/boardContainer'
import { TaskDrawer } from '@/components/board/taskDrawer'

export default function BoardPage() {
  const params = useParams()
  const projectSlug = params.projectSlug as string
  const dispatch = useAppDispatch()
  const { tasks } = useAppSelector(state => state.task)
  const { taskDrawerOpen, selectedTask } = useAppSelector(state => state.ui)

  React.useEffect(() => {
    // Assume project id from slug
    dispatch(fetchTasks(projectSlug))
  }, [projectSlug, dispatch])

  const handleTaskClick = (task: any) => {
    dispatch(openTaskDrawer(task))
  }

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      <BoardContainer tasks={tasks} onTaskClick={handleTaskClick} />
      <TaskDrawer task={selectedTask} isOpen={taskDrawerOpen} />
    </div>
  )
}