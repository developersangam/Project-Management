'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { fetchOrganizations } from '@/store/organization/organizationThunk'
import { fetchProjects } from '@/store/project/projectThunk'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FolderOpen, BarChart3, Plus, ArrowRight, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { currentOrganization } = useAppSelector(state => state.organization)
  const { projects } = useAppSelector(state => state.project)

  React.useEffect(() => {
    dispatch(fetchOrganizations())
  }, [dispatch])

  React.useEffect(() => {
    if (currentOrganization) {
      dispatch(fetchProjects(currentOrganization.id))
    }
  }, [currentOrganization, dispatch])

  const stats = [
    {
      title: 'Active Projects',
      value: projects.length,
      description: 'Projects you can work on',
      icon: FolderOpen,
      href: '/dashboard/projects',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Team Members',
      value: currentOrganization?.members?.length || 0,
      description: 'People in your workspace',
      icon: Users,
      href: '/dashboard/organizations',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Tasks Completed',
      value: '24', // Placeholder
      description: 'This week',
      icon: CheckCircle,
      href: '/dashboard/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Productivity',
      value: '+12%', // Placeholder
      description: 'vs last week',
      icon: TrendingUp,
      href: '/dashboard/analytics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Good morning! 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Button size="lg" className="shadow-sm w-full sm:w-auto" asChild>
          <Link href="/dashboard/projects">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-card">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground mb-1 truncate">{stat.title}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{stat.description}</p>
                  </div>
                  <div className={cn("p-2 lg:p-3 rounded-lg flex-shrink-0", stat.bgColor)}>
                    <Icon className={cn("h-4 w-4 lg:h-6 lg:w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
          <div>
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">Recent Projects</h2>
            <p className="text-sm text-muted-foreground mt-1">Jump back into your work</p>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/projects">
              View all
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all duration-200 group cursor-pointer border-0 shadow-sm bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base lg:text-lg group-hover:text-primary transition-colors truncate">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2 text-sm">
                        {project.description || 'No description available'}
                      </CardDescription>
                    </div>
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs lg:text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="truncate">Updated recently</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors h-8 px-3" asChild>
                      <Link href={`/dashboard/projects/${project.slug}/board`}>
                        <span className="hidden sm:inline">Open</span>
                        <ArrowRight className="w-3 h-3 sm:ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-muted-foreground/25 bg-card">
            <CardContent className="flex flex-col items-center justify-center py-8 lg:py-16">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground" />
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center mb-4 lg:mb-6 max-w-sm text-sm lg:text-base">
                Create your first project to start organizing your work and collaborating with your team.
              </p>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/dashboard/projects">
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first project
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}