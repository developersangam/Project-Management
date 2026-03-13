'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '../../../hooks/redux'
import { fetchOrganizations, switchOrganization } from '../../../store/organization/organizationThunk'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, FolderOpen, Settings, ArrowRight, Check } from 'lucide-react'

export default function OrganizationsPage() {
  const dispatch = useAppDispatch()
  const { organizations, currentOrganization, loading } = useAppSelector(state => state.organization)

  React.useEffect(() => {
    dispatch(fetchOrganizations())
  }, [dispatch])

  const handleSwitch = (orgId: string) => {
    dispatch(switchOrganization(orgId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Manage your workspaces and collaborate with your team
          </p>
        </div>
        <Button size="lg" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/organizations/create">
            <Plus className="w-4 h-4 mr-2" />
            New Organization
          </Link>
        </Button>
      </div>

      {/* Current Organization Highlight */}
      {currentOrganization && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Current Organization
                </CardTitle>
                <CardDescription className="mt-2">{currentOrganization.name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/${currentOrganization.slug}/projects`}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  View Projects
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Organization Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organizations List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Workspaces</h2>
        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No organizations yet</h3>
            <p className="text-muted-foreground mb-6">Get started by creating your first organization.</p>
            <Button asChild>
              <Link href="/dashboard/organizations/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Organization
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map(org => {
              const isCurrentOrg = currentOrganization?.id === org.id
              return (
                <Card 
                  key={org.id} 
                  className={`hover:shadow-lg transition-all duration-200 ${isCurrentOrg ? 'border-primary bg-primary/2' : ''}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="line-clamp-1">{org.name}</span>
                      {isCurrentOrg && <Check className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {org.members?.length || 0} member{org.members?.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {isCurrentOrg ? (
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/dashboard/${org.slug}/projects`}>
                            <FolderOpen className="w-4 h-4 mr-2" />
                            View Projects
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleSwitch(org.id)}
                        >
                          Switch Organization
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}