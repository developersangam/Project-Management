/**
 * API Placeholder Functions
 * These are mock functions that simulate API calls.
 * They should be replaced with actual API endpoints later.
 */

import {
  User,
  Organization,
  Project,
  Task,
  Column,
  OrganizationMember,
  ProjectMember,
  LoginFormInput,
  RegisterFormInput,
  CreateOrganizationFormInput,
  CreateProjectFormInput,
  CreateTaskFormInput,
  CreateColumnFormInput,
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// ===== AUTH ENDPOINTS =====

export const authAPI = {
  async login(credentials: LoginFormInput): Promise<{ user: User; token: string }> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // })
    // return response.json()

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            email: credentials.email,
            name: 'John Doe',
            avatar: '',
            createdAt: new Date().toISOString(),
          },
          token: 'fake-jwt-token',
        })
      }, 1000)
    })
  },

  async register(data: RegisterFormInput): Promise<{ user: User; token: string }> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            email: data.email,
            name: data.name,
            avatar: '',
            createdAt: new Date().toISOString(),
          },
          token: 'fake-jwt-token',
        })
      }, 1000)
    })
  },

  async logout(): Promise<void> {
    // TODO: Replace with actual API call
    return Promise.resolve()
  },

  async getMe(): Promise<User> {
    // TODO: Replace with actual API call
    return {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      avatar: '',
      createdAt: new Date().toISOString(),
    }
  },
}

// ===== ORGANIZATION ENDPOINTS =====

export const organizationAPI = {
  async getOrganizations(): Promise<Organization[]> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Acme Corp',
            slug: 'acme-corp',
            description: 'Our main organization',
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            avatar: '',
            members: [],
          },
        ])
      }, 500)
    })
  },

  async getOrganization(slug: string): Promise<Organization> {
    // TODO: Replace with actual API call
    return {
      id: '1',
      name: 'Acme Corp',
      slug,
      description: 'Our main organization',
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      avatar: '',
      members: [],
    }
  },

  async createOrganization(data: CreateOrganizationFormInput): Promise<Organization> {
    // TODO: Replace with actual API call
    return {
      id: Date.now().toString(),
      ...data,
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      avatar: '',
      members: [],
    }
  },

  async getMembers(organizationId: string): Promise<OrganizationMember[]> {
    // TODO: Replace with actual API call
    return []
  },

  async inviteMember(organizationId: string, email: string, role: string): Promise<OrganizationMember> {
    // TODO: Replace with actual API call
    return {
      id: Date.now().toString(),
      userId: '',
      organizationId,
      role: role as any,
      user: {
        id: '',
        email,
        name: '',
        createdAt: new Date().toISOString(),
      },
    }
  },

  async removeMember(organizationId: string, userId: string): Promise<void> {
    // TODO: Replace with actual API call
    return Promise.resolve()
  },
}

// ===== PROJECT ENDPOINTS =====

export const projectAPI = {
  async getProjects(organizationId: string): Promise<Project[]> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Website Redesign',
            slug: 'website-redesign',
            description: 'Redesign the marketing website',
            organizationId,
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            members: [],
            columns: [],
          },
        ])
      }, 500)
    })
  },

  async getProject(projectId: string): Promise<Project> {
    // TODO: Replace with actual API call
    return {
      id: projectId,
      name: 'Website Redesign',
      slug: 'website-redesign',
      description: 'Redesign the marketing website',
      organizationId: '',
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      members: [],
      columns: [
        { id: '1', name: 'Todo', position: 0, projectId, tasks: [] },
        { id: '2', name: 'In Progress', position: 1, projectId, tasks: [] },
        { id: '3', name: 'Done', position: 2, projectId, tasks: [] },
      ],
    }
  },

  async createProject(organizationId: string, data: CreateProjectFormInput): Promise<Project> {
    // TODO: Replace with actual API call
    return {
      id: Date.now().toString(),
      ...data,
      organizationId,
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      members: [],
      columns: [
        { id: '1', name: 'Todo', position: 0, projectId: Date.now().toString(), tasks: [] },
        { id: '2', name: 'In Progress', position: 1, projectId: Date.now().toString(), tasks: [] },
        { id: '3', name: 'Done', position: 2, projectId: Date.now().toString(), tasks: [] },
      ],
    }
  },

  async updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
    // TODO: Replace with actual API call
    return { ...data } as Project
  },

  async deleteProject(projectId: string): Promise<void> {
    // TODO: Replace with actual API call
    return Promise.resolve()
  },

  async getMembers(projectId: string): Promise<ProjectMember[]> {
    // TODO: Replace with actual API call
    return []
  },

  async inviteMember(projectId: string, email: string, role: string): Promise<ProjectMember> {
    // TODO: Replace with actual API call
    return {
      id: Date.now().toString(),
      userId: '',
      projectId,
      role: role as any,
      user: {
        id: '',
        email,
        name: '',
        createdAt: new Date().toISOString(),
      },
    }
  },
}

// ===== COLUMN ENDPOINTS =====

export const columnAPI = {
  async getColumns(projectId: string): Promise<Column[]> {
    // TODO: Replace with actual API call
    return [
      { id: '1', name: 'Todo', position: 0, projectId, tasks: [] },
      { id: '2', name: 'In Progress', position: 1, projectId, tasks: [] },
      { id: '3', name: 'Done', position: 2, projectId, tasks: [] },
    ]
  },

  async createColumn(projectId: string, data: CreateColumnFormInput): Promise<Column> {
    // TODO: Replace with actual API call
    return {
      id: Date.now().toString(),
      ...data,
      position: 0,
      projectId,
      tasks: [],
    }
  },

  async updateColumn(columnId: string, data: Partial<Column>): Promise<Column> {
    // TODO: Replace with actual API call
    return { ...data } as Column
  },

  async deleteColumn(columnId: string): Promise<void> {
    // TODO: Replace with actual API call
    return Promise.resolve()
  },

  async reorderColumns(projectId: string, columnIds: string[]): Promise<void> {
    // TODO: Replace with actual API call
    return Promise.resolve()
  },
}

// ===== TASK ENDPOINTS =====

export const taskAPI = {
  async getTasks(projectId: string): Promise<Task[]> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Design homepage mockups',
            description: 'Create high-fidelity mockups for the new homepage',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            columnId: '1',
            projectId,
            position: 0,
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ])
      }, 500)
    })
  },

  async getTask(taskId: string): Promise<Task> {
    // TODO: Replace with actual API call
    return {
      id: taskId,
      title: 'Design homepage mockups',
      description: 'Create high-fidelity mockups for the new homepage',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      columnId: '1',
      projectId: '',
      position: 0,
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  },

  async createTask(projectId: string, columnId: string, data: CreateTaskFormInput): Promise<Task> {
    // TODO: Replace with actual API call
    return {
      id: Date.now().toString(),
      ...data,
      status: 'TODO',
      columnId,
      projectId,
      position: 0,
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  async updateTask(taskId: string, data: Partial<Task>): Promise<Task> {
    // TODO: Replace with actual API call
    return { ...data } as Task
  },

  async deleteTask(taskId: string): Promise<void> {
    // TODO: Replace with actual API call
    return Promise.resolve()
  },

  async moveTask(taskId: string, columnId: string, position: number): Promise<Task> {
    // TODO: Replace with actual API call
    return {
      id: taskId,
      title: '',
      priority: 'MEDIUM',
      status: 'TODO',
      columnId,
      projectId: '',
      position,
      createdBy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  async assignTask(taskId: string, userId: string): Promise<Task> {
    // TODO: Replace with actual API call
    return {
      id: taskId,
      title: '',
      priority: 'MEDIUM',
      status: 'TODO',
      assigneeId: userId,
      columnId: '',
      projectId: '',
      position: 0,
      createdBy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  async updateTaskStatus(taskId: string, status: string): Promise<Task> {
    // TODO: Replace with actual API call
    return {
      id: taskId,
      title: '',
      priority: 'MEDIUM',
      status: status as any,
      columnId: '',
      projectId: '',
      position: 0,
      createdBy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
}

export default {
  auth: authAPI,
  organization: organizationAPI,
  project: projectAPI,
  column: columnAPI,
  task: taskAPI,
}
