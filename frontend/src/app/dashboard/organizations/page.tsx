'use client'

import * as React from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks/redux'
import { fetchOrganizations, switchOrganization } from '../../../store/organization/organizationThunk'

export default function OrganizationsPage() {
  const dispatch = useAppDispatch()
  const { organizations, currentOrganization } = useAppSelector(state => state.organization)

  React.useEffect(() => {
    dispatch(fetchOrganizations())
  }, [dispatch])

  const handleSwitch = (orgId: string) => {
    dispatch(switchOrganization(orgId))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Organizations</h1>
      <div className="space-y-4">
        {organizations.map(org => (
          <div key={org.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{org.name}</h2>
              <p>Slug: {org.slug}</p>
            </div>
            <button
              onClick={() => handleSwitch(org.id)}
              className={`px-4 py-2 rounded ${
                currentOrganization?.id === org.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {currentOrganization?.id === org.id ? 'Current' : 'Switch'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}