// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

// Organization Types
export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  avatar?: string
  createdBy: string
  createdAt: string
  members: OrganizationMember[]
}

export interface OrganizationMember {
  id: string
  userId: string
  organizationId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  user: User
}

// Column Types
export interface Column {
  id: string
  name: string
  position: number
  projectId: string
  tasks: Task[]
}

// Project Types
export interface Project {
  id: string
  name: string
  slug: string
  description?: string
  organizationId: string
  createdBy: string
  createdAt: string
  members: ProjectMember[]
  columns: Column[]
}

export interface ProjectMember {
  id: string
  userId: string
  projectId: string
  role: 'OWNER' | 'MAINTAINER' | 'CONTRIBUTOR'
  user: User
}

// Comment Types
export interface Comment {
  id: string
  content: string
  authorId: string
  author: User
  createdAt: string
  updatedAt: string
}

// Task Types
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  assigneeId?: string
  assignee?: User
  createdBy: string
  creator?: User
  dueDate?: string
  columnId: string
  projectId: string
  position: number
  createdAt: string
  updatedAt: string
  labels?: string[]
  comments?: Comment[]
  attachments?: number
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  loading: boolean;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
}

export interface UiState {
  sidebarOpen: boolean;
  taskDrawerOpen: boolean;
  selectedTask: Task | null;
}