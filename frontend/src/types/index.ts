export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  members: User[];
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  assigneeId?: string;
  assignee?: User;
  dueDate?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  labels?: string[];
  comments?: Comment[];
  attachments?: number;
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