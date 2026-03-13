'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux'
import { fetchProjectDetails } from '../../../../store/project/projectThunk'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { AlertCircle, ArrowLeft, FolderOpen, BarChart3, Settings, Plus, Users } from 'lucide-react'

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectSlug = params.projectSlug as string
  const dispatch = useAppDispatch()
  const { currentProject, loading } = useAppSelector(state => state.project)

  React.useEffect(() => {
    if (projectSlug) {
      dispatch(fetchProjectDetails(projectSlug))
    }
  }, [projectSlug, dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading project details...</h2>
        </div>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Project Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been deleted.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">{currentProject.name}</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            {currentProject.description || 'No description available'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button size="lg" className="h-auto py-4" asChild>
          <Link href={`/dashboard/projects/${projectSlug}/board`}>
            <FolderOpen className="w-5 h-5 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Open Board</div>
              <div className="text-xs opacity-90">View Kanban board</div>
            </div>
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-auto py-4">
          <BarChart3 className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Analytics</div>
            <div className="text-xs">Project insights</div>
          </div>
        </Button>
        <Button size="lg" variant="outline" className="h-auto py-4">
          <Users className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Team</div>
            <div className="text-xs">Members & roles</div>
          </div>
        </Button>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project Name</label>
              <p className="text-lg font-semibold">{currentProject.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project Slug</label>
              <Badge variant="outline">{currentProject.slug}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-sm">{new Date(currentProject.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="text-sm">{new Date(currentProject.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" asChild>
              <Link href={`/dashboard/projects/${projectSlug}/board`}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Open Kanban Board
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/tasks/create">
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}