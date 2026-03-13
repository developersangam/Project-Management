export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user?: User;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user?: User;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  members: User[];
  description?: string;
  createdBy?: string;
  createdAt?: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
  members?: User[];
  columns?: Column[];
  createdBy?: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Column {
  id: string;
  name: string;
  color?: string;
  position?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId?: string;
  assignee?: User;
  dueDate?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  labels?: string[];
  comments?: Comment[];
  attachments?: number;
  columnId?: string;
  position?: number;
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error?: string
}

export interface OrganizationState {
  organizations: Organization[]
  currentOrganization: Organization | null
  loading: boolean
  error?: string
}

export interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error?: string
}

export interface TaskState {
  tasks: Task[]
  currentTask: Task | null
  loading: boolean
  error?: string
}

export interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  isMobile: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

// Form Types
export interface LoginFormInput {
  email: string
  password: string
}

export interface RegisterFormInput {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface CreateOrganizationFormInput {
  name: string
  slug: string
  description?: string
}

export interface CreateProjectFormInput {
  name: string
  slug: string
  description?: string
}

export interface CreateTaskFormInput {
  title: string
  description?: string
  priority: TaskPriority
  assigneeId?: string
  dueDate?: string
}

export interface CreateColumnFormInput {
  name: string
}

export interface InviteMemberFormInput {
  email: string
  role: 'MEMBER' | 'ADMIN'
}