'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchProjects } from '@/store/project/projectThunk';
import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardLayout } from '@/components/layout/dashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  const router = useRouter()
  const params = useParams()
  const orgSlug = params.orgSlug as string
  const dispatch = useAppDispatch()
  const { projects, loading } = useAppSelector(state => state.project)

  useEffect(() => {
    if (orgSlug) {
      dispatch(fetchProjects(orgSlug) as any)
    }
  }, [dispatch, orgSlug])

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground mt-2">Manage your projects for {orgSlug}</p>
            </div>
            <Button asChild>
              <Link href={`/dashboard/${orgSlug}/projects/create`}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <Button asChild>
                  <Link href={`/dashboard/${orgSlug}/projects/create`}>
                    Create your first project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow group cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/${orgSlug}/projects/${project.slug}/board`)
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span>{project.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {project.columns?.length || 0} columns
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      {project.description || 'No description'}
                    </p>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.members?.length || 0} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/${orgSlug}/projects/${project.slug}/board`)
                        }}
                        className="w-full gap-2 group-hover:translate-x-1 transition-transform"
                      >
                        Open Board <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
