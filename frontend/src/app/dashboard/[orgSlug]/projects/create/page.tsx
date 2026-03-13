'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/dashboardLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function CreateProjectPage() {
  const router = useRouter()
  const params = useParams()
  const orgSlug = params.orgSlug as string
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Call API to create project
      // await createProject(orgSlug, formData)
      router.push(`/dashboard/${orgSlug}/projects`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-8 max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create Project</h1>
            <p className="text-muted-foreground mt-2">Start a new project and organize your work</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Choose a name and description for your project</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Project Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Website Redesign"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">
                    Slug *
                  </label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="e.g., website-redesign"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in URLs: jiraclone.com/dashboard/{orgSlug}/projects/{formData.slug}
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about your project..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading || !formData.name || !formData.slug}>
                    {loading ? 'Creating...' : 'Create Project'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
