'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '../../../hooks/redux'
import { fetchProjects, createProject } from '../../../store/project/projectThunk'
import { Button } from '../../../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/modal'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FolderOpen } from 'lucide-react'

export default function ProjectsPage() {
  const dispatch = useAppDispatch()
  const { projects, loading } = useAppSelector(state => state.project)
  const { currentOrganization } = useAppSelector(state => state.organization)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [projectName, setProjectName] = React.useState('')
  const [projectDescription, setProjectDescription] = React.useState('')

  React.useEffect(() => {
    if (currentOrganization) {
      dispatch(fetchProjects(currentOrganization.id))
    }
  }, [currentOrganization, dispatch])

  const handleCreate = async () => {
    if (currentOrganization && projectName) {
      await dispatch(createProject({
        name: projectName,
        description: projectDescription,
        organizationId: currentOrganization.id
      }))
      setIsModalOpen(false)
      setProjectName('')
      setProjectDescription('')
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1 lg:mt-2 text-sm lg:text-base">
            Manage and organize your team's projects
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 lg:py-12">
          <FolderOpen className="mx-auto h-12 w-12 lg:h-16 lg:w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg lg:text-xl font-medium text-foreground mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4 lg:mb-6 max-w-sm mx-auto text-sm lg:text-base">
            Get started by creating your first project.
          </p>
          <Button className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                      <FolderOpen className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{project.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2 text-sm">
                      {project.description || 'No description available'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1 h-9" asChild>
                    <Link href={`/dashboard/projects/${project.slug}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button className="flex-1 h-9" asChild>
                    <Link href={`/dashboard/projects/${project.slug}/board`}>
                      Open Board
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Project Name</label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <Input
                id="description"
                placeholder="Enter project description (optional)"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={loading || !projectName}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}