// Simplified Types with minimal constraints to reduce TypeScript issues

// Basic entity types - using [key: string]: any to allow flexible API responses
export interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: any;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  [key: string]: any;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  [key: string]: any;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
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
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

export interface Column {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Task {
  id: string;
  title?: string;
  columnId: string;
  [key: string]: any;
  column?: any;
  tasks?: any[];
}

export interface Comment {
  id: string;
  content: string;
  [key: string]: any;
}

// Redux State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

export interface OrganizationState {
  organizations: any[];
  currentOrganization: Organization | null;
  loading: boolean;
  error?: string;
}

export interface ProjectState {
  projects: {
    data : any[];
    meta: {}
  };
  currentProject: Project | null;
  loading: boolean;
  error?: string;
  projectMembers: any[];  
}

export interface TaskState {
  tasks: any[];
  currentTask: Task | null;
  columns: any[];
  loading: boolean;
  error?: string;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  isMobile: boolean;
  taskDrawerOpen: boolean;
  selectedTask: any;
}

// Form Input Types
export interface LoginFormInput {
  email: string;
  password: string;
}

export interface RegisterFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateOrganizationFormInput {
  name: string;
  slug: string;
  [key: string]: any;
}

export interface CreateProjectFormInput {
  name: string;
  slug: string;
  [key: string]: any;
}

export interface CreateTaskFormInput {
  title: string;
  [key: string]: any;
}

export interface CreateColumnFormInput {
  name: string;
  [key: string]: any;
}

export interface InviteMemberFormInput {
  email: string;
  role: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// Type aliases for enums
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';