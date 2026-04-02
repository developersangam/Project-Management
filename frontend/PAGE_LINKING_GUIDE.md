# Complete Page Linking Guide

## Overview
This document outlines all pages in the application and their linking structure, including navigation paths, functionality, and cross-page connections.

---

## Page Hierarchy & Navigation Map

### 🏠 Dashboard Pages

#### `/dashboard` - Main Dashboard
**Purpose**: Landing page after login, overview of projects and stats
**Key Components**:
- Statistics cards (Active Projects, Team Members, Tasks Completed, Productivity)
- Recent projects list
- Quick action buttons

**Links To**:
- `/dashboard/projects` - View all projects
- `/dashboard/organizations` - Manage organizations
- `/dashboard/analytics` - View analytics
- `/dashboard/projects/:projectSlug/board` - Open specific project board
- `/dashboard/tasks/create` - Create new task

**Accessible From**:
- Sidebar (Home icon)

---

### 📁 Projects Section

#### `/dashboard/projects` - Projects List
**Purpose**: View all projects in current organization
**Key Features**:
- List all projects with cards
- Project creation form (modal)
- Quick filters and search
- Links to project details and board

**Links To**:
- `/dashboard/projects/:projectSlug` - View project details
- `/dashboard/projects/:projectSlug/board` - Open Kanban board
- `/dashboard/projects/create` - Create new project (via modal or link)

**Accessible From**:
- Sidebar (Projects)
- Dashboard stats card
- Header breadcrumbs

**Data**:
- Redux State: `project.projects[]`
- Thunk Action: `fetchProjects(orgId)`

---

#### `/dashboard/projects/[projectSlug]` - Project Details
**Purpose**: View detailed information about a specific project
**Key Features**:
- Project information display
- Project metadata (created, updated dates)
- Quick action cards (Open Board, Analytics, Team)
- Navigation back to projects list

**Links To**:
- `/dashboard/projects/:projectSlug/board` - Open Kanban board
- `/dashboard/tasks/create` - Create task for project
- `/dashboard/projects` - Back to projects list
- `/dashboard/settings` - Project settings

**Accessible From**:
- Projects list page (View Details button)
- Breadcrumbs navigation
- Back navigation

**Data**:
- Redux State: `project.currentProject`
- Thunk Action: `fetchProjectDetails(projectSlug)`

---

#### `/dashboard/projects/[projectSlug]/board` - Kanban Board
**Purpose**: Main workspace for managing tasks with drag-and-drop
**Key Features**:
- Kanban columns (To Do, In Progress, Done)
- Drag-and-drop task management
- Task cards with priority badges
- Task drawer for details/editing
- Create task button
- Navigation header with project name

**Links To**:
- `/dashboard/tasks/create` - Create new task
- `/dashboard/projects/:projectSlug` - Back to project details
- `/dashboard/tasks/:taskId` - View task details (via task click)
- Back navigation (arrow button)

**Accessible From**:
- Projects list (Open Board button)
- Project details (Open Board button)
- Dashboard (via project card)
- Direct URL

**Data**:
- Redux State: `task.tasks[]`, `project.currentProject`
- Thunk Action: `fetchTasks(projectSlug)`
- Thunk Action: `updateTaskPosition()` (drag-drop)

**Special Component**: TaskDrawer - Opens on task click, allows quick edits

---

### 📊 Organization Management

#### `/dashboard/organizations` - Organizations List
**Purpose**: View and manage all organizations/workspaces
**Key Features**:
- Current organization highlight (with check mark)
- Organization cards with member count
- Switch organization functionality
- Create new organization button
- Views org-specific projects

**Links To**:
- `/dashboard/organizations/create` - Create new organization
- `/dashboard/:orgSlug/projects` - View org-specific projects
- `/dashboard/settings` - Organization settings
- Direct organization switch

**Accessible From**:
- Sidebar (Organizations)
- Dashboard stats card
- Header organization switcher dropdown

**Data**:
- Redux State: `organization.organizations[]`, `organization.currentOrganization`
- Thunk Action: `fetchOrganizations()`
- Thunk Action: `switchOrganization(orgId)`

---

#### `/dashboard/organizations/create` - Create Organization
**Purpose**: Form to create new organization/workspace
**Key Features**:
- Organization name input
- Description input
- Form validation
- Success notification

**Links To**:
- `/dashboard/organizations` - Back to organizations list (after creation)

**Accessible From**:
- Organizations page (New Organization button)
- Sidebar context menu (if implemented)

**Data**:
- Thunk Action: `createOrganization(orgData)`

---

### 🏢 Organization-Specific Pages

#### `/dashboard/[orgSlug]/projects` - Org-Specific Projects
**Purpose**: View projects within specific organization
**Key Features**:
- Projects list filtered by organization
- Organization context display
- Create project button
- Project cards with metadata

**Links To**:
- `/dashboard/:orgSlug/projects/:projectSlug/board` - Open project board
- `/dashboard/:orgSlug/projects/create` - Create project

**Accessible From**:
- Organizations page (View Projects button)
- Breadcrumbs navigation

**Data**:
- Redux State: `project.projects[]` (filtered by orgSlug)
- Thunk Action: `fetchProjects(orgSlug)`

---

#### `/dashboard/[orgSlug]/projects/create` - Create Project (Org-Specific)
**Purpose**: Form to create project within specific organization
**Key Features**:
- Project name, description, slug
- Organization context
- Form validation

**Links To**:
- `/dashboard/:orgSlug/projects` - Back to org projects (after creation)

**Accessible From**:
- Org-specific projects page (New Project button)

**Data**:
- Thunk Action: `createProject(projectData, orgSlug)`

---

#### `/dashboard/[orgSlug]/projects/[projectSlug]/board` - Org-Specific Board
**Purpose**: Kanban board within specific organization
**Key Features**: Same as global board but org-contextualized

**Links To**: Same as global board

**Accessible From**:
- Org-specific projects list

**Data**:
- Thunk Action: `fetchTasks(orgSlug/projectSlug)`

---

### 📋 Task Management

#### `/dashboard/tasks/create` - Create Task
**Purpose**: Form to create new task
**Key Features**:
- Task title, description
- Priority selector (Low, Medium, High)
- Status selector (To Do, In Progress, Done)
- Project selector
- Assignee selector
- Due date picker
- Labels management
- Form validation

**Links To**:
- `/dashboard/projects/:projectSlug/board` - Return to board (after creation)
- Can be accessed from multiple contexts

**Accessible From**:
- Kanban board (New Task button)
- Project details (Create Task button)
- Dashboard (Create Task button)
- Sidebar (if implemented)

**Data**:
- Thunk Action: `createTask(taskData)`
- Redux State: `project.projects[]` (for project selector)

---

#### `/dashboard/tasks/[taskId]` - Task Detail
**Purpose**: View and edit task details with full information
**Key Features**:
- Full task information display
- Edit mode for title/description
- Assignee management
- Due date picker
- Comments section
- Activity log
- Task history
- Delete option

**Links To**:
- `/dashboard/tasks/create` - Create related task
- Back navigation (via previous context)
- `/dashboard/projects/:projectSlug/board` - Return to board

**Accessible From**:
- Kanban board (click task card)
- Task drawer (View Full Details link)
- Direct URL
- Task search results (if implemented)

**Data**:
- Redux State: `task.currentTask`, `task.comments[]`
- Thunk Action: `fetchTaskById(taskId)`
- Thunk Action: `updateTaskThunk(taskData)`
- Thunk Action: `addComment(taskId, comment)`
- Thunk Action: `deleteComment(commentId)`

---

### 📈 Analytics & Settings

#### `/dashboard/analytics` - Analytics Dashboard
**Purpose**: Project and team analytics/insights
**Key Features**:
- Task statistics (completed, in progress, overdue)
- Project statistics
- Team member performance
- Weekly progress chart
- Priority distribution
- Task status breakdown
- Custom date range filtering

**Links To**:
- `/dashboard` - Back to main dashboard
- `/dashboard/projects` - View all projects
- `/dashboard/tasks/create` - Create task

**Accessible From**:
- Sidebar (Analytics)
- Dashboard (Productivity card)

**Data**:
- Redux State: Aggregated from task, project, organization states
- Thunk Action: `fetchAnalytics(filters)`

---

#### `/dashboard/settings` - Settings & Preferences
**Purpose**: User and organization settings
**Key Tabs/Sections**:
1. **Profile Settings**
   - Name, email, avatar
   - Profile update form
   - Password change (optional)

2. **Notification Preferences**
   - Email notifications toggle
   - Task assignment notifications
   - Task completion notifications
   - Weekly digest toggle
   - Notification scheduling

3. **Application Preferences**
   - Theme selector (light/dark)
   - Language selector
   - Timezone selector
   - Date format selector

4. **Organization Settings**
   - Organization name
   - Organization description
   - Member management (if org admin)
   - Billing (if applicable)

**Links To**:
- `/dashboard` - Back to dashboard (after save)
- `/dashboard/organizations` - Org settings redirect
- Account security pages (if nested)

**Accessible From**:
- Sidebar (Settings)
- Header user menu
- Project details (Project Settings)
- Organizations page (Organization Settings)

**Data**:
- Redux State: `auth.user`, `ui.theme`, `ui.preferences`
- Thunk Action: `updateUserProfile(userData)`
- Thunk Action: `updateUserPreferences(preferences)`

---

## 🔄 Navigation Patterns

### Sidebar Navigation
```
Dashboard Home
├── Projects → /dashboard/projects
├── Organizations → /dashboard/organizations
├── Analytics → /dashboard/analytics
└── Settings → /dashboard/settings
```

### Breadcrumb Navigation
Shows current location hierarchy:
- Home > Projects > ProjectName > Board
- Home > Organizations
- Home > Analytics
- Home > Settings

### Header Dropdown Menus
**Organization Switcher**: Switch between organizations
**User Menu**: Profile, Settings, Logout

### Quick Links
- Dashboard → New Project
- Dashboard → New Organization
- Projects → Project Details → Board
- Projects → Create New Project (modal)

---

## 🔐 Authorization & Routing

### Protected Routes
All dashboard routes require authentication via `AuthGuard` component:
- `/dashboard/**` - All require authenticated user

### Organization Context
Routes with `[orgSlug]` parameter require current organization selection:
- `/dashboard/[orgSlug]/projects`
- `/dashboard/[orgSlug]/projects/[projectSlug]/board`

---

## 🎯 Functional Workflows

### Creating a New Project
1. Start: `/dashboard`
2. Click "Create Project" → `/dashboard/projects` (New Project modal)
3. Fill form and submit
4. Redirect: `/dashboard/projects`
5. Option to click "Open Board" → `/dashboard/projects/[projectSlug]/board`

### Managing Tasks
1. View tasks on board: `/dashboard/projects/[projectSlug]/board`
2. Click task → Task Drawer opens
3. Click "View Full Details" → `/dashboard/tasks/[taskId]`
4. Edit or create new task → `/dashboard/tasks/create`
5. Return to board after save

### Switching Organizations
1. Click org switcher in header or `/dashboard/organizations`
2. Select organization
3. Redirect to org-specific projects: `/dashboard/[orgSlug]/projects`

### Viewing Analytics
1. Navigate to `/dashboard/analytics`
2. View statistics and charts
3. Filter by date range or project
4. Click project link to drill down

---

## 📊 Data Flow & Redux Integration

### Global vs Organization-Specific Data
- **Global Pages**: `/dashboard/projects`, `/dashboard/tasks/create`
- **Org-Specific Pages**: `/dashboard/[orgSlug]/projects`
- Current organization determines context for data fetching

### Thunk Actions by Feature
- **Organization**: `fetchOrganizations`, `switchOrganization`, `createOrganization`
- **Project**: `fetchProjects`, `fetchProjectDetails`, `createProject`, `updateProject`
- **Task**: `fetchTasks`, `fetchTaskById`, `createTask`, `updateTask`, `deleteTask`
- **Auth**: `login`, `logout`, `getMe`, `updateUserProfile`

---

## 🚀 Best Practices for Adding New Pages

1. **Create route folder**: `/dashboard/new-feature`
2. **Create page.tsx** with:
   - Client/Server designation (`'use client'`)
   - AuthGuard wrapper (if protected)
   - DashboardLayout wrapper
   - Breadcrumb support
   - Back navigation option

3. **Add to sidebar** (if main navigation)
4. **Link from relevant pages**
5. **Add Redux integration** (if data needed)
6. **Update this guide** with new page info

---

## 🔗 Complete Link Reference Matrix

| From Page | To Page | Link Type | Trigger |
|-----------|---------|-----------|---------|
| Dashboard | Projects | Button | "View Projects" / "Create Project" |
| Dashboard | Organizations | Card | Stats card click |
| Dashboard | Analytics | Card | Stats card click |
| Dashboard | Org Projects | Card | Project card click |
| Projects | Project Details | Button | "View Details" |
| Projects | Board | Button | "Open Board" |
| Projects | Create Project | Button/Modal | "New Project" |
| Project Details | Board | Button | "Open Board" |
| Project Details | Create Task | Button | "Create Task" |
| Project Details | Projects List | Button | "Back to Projects" |
| Board | Task Detail | Click | Task card click |
| Board | Create Task | Button | "New Task" |
| Board | Project Details | Button | "Project" |
| Task Detail | Board | Button | "Back to Board" |
| Task Detail | Create Task | Button | "Create Related" |
| Create Task | Board | Auto-redirect | After save |
| Organizations | Org Projects | Button | "View Projects" |
| Organizations | Create Org | Button | "New Organization" |
| Settings | Dashboard | Button | Home link |
| Analytics | Dashboard | Button | "Back" |

---

## ✅ Link Verification Checklist

- [x] Dashboard to Projects
- [x] Dashboard to Organizations  
- [x] Dashboard to Analytics
- [x] Projects to Project Details
- [x] Projects to Board
- [x] Projects to Create Project
- [x] Project Details to Board
- [x] Project Details to Create Task
- [x] Board to Task Detail (via drawer/click)
- [x] Board to Create Task
- [x] Task Detail to Comments/Edit
- [x] Organizations to Org Projects
- [x] Organizations to Create Org
- [x] Settings accessible from all pages
- [x] Breadcrumbs working correctly
- [x] Back navigation implemented
- [x] Sidebar links responsive

---

## 🎓 Testing Your Links

### Manual Testing Steps:
1. Start at `/dashboard`
2. Navigate to each sidebar item
3. Test breadcrumb navigation
4. Test back buttons
5. Create test objects (org, project, task)
6. Verify redirects after creation
7. Test deep linking (paste URLs directly)
8. Verify authentication on protected routes

### Expected Behavior:
- All links load relevant pages
- Breadcrumbs reflect current path
- Data loads correctly for context
- Redirects work after operations
- No 404 errors on valid routes
