'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux'
import { fetchProjectDetails } from '../../../../store/project/projectThunk'
import { Button } from '../../../../components/ui/button'

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectSlug = params.projectSlug as string
  const dispatch = useAppDispatch()
  const { currentProject } = useAppSelector(state => state.project)

  React.useEffect(() => {
    // Assume project id from slug, but for simplicity, use slug as id
    dispatch(fetchProjectDetails(projectSlug))
  }, [projectSlug, dispatch])

  if (!currentProject) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{currentProject.name}</h1>
      <p className="mb-4">{currentProject.description}</p>
      <Link href={`/dashboard/projects/${projectSlug}/board`}>
        <Button>View Board</Button>
      </Link>
    </div>
  )
}