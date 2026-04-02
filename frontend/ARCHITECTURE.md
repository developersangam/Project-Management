# Project Management SaaS - Frontend Architecture Roadmap

## 1. PROJECT STRUCTURE OVERVIEW

```
src/
├── app/                          # Next.js App Router
├── components/                   # Reusable UI components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions & helpers
├── services/                     # API service layer
├── store/                        # Redux state management
├── types/                        # TypeScript type definitions
├── middleware/                   # Next.js middleware
└── constants/                    # App constants & config
```

---

## 2. PAGE STRUCTURE & ROUTING ARCHITECTURE

### 2.1 Authentication Routes
```
src/app/
├── login/
│   └── page.tsx              # Login page
├── register/
│   └── page.tsx              # Registration page
└── auth-callback/
    └── page.tsx              # OAuth callback handler
```

**Features:**
- Email/password authentication
- Social login integration
- Session management
- Redirect to dashboard on success

---

### 2.2 Dashboard Routes (Protected)

#### Main Dashboard Structure
```
src/app/dashboard/
├── layout.tsx                # Dashboard wrapper layout
├── page.tsx                  # Dashboard home/redirect
├── (sidebar-routes)/         # Route group for sidebar navigation
│   ├── organizations/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── [orgSlug]/
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── members/
│   │   │   │   └── page.tsx
│   │   │   └── invite/
│   │   │       └── page.tsx
│   │   └── [orgId]/
│   │       └── projects/
│   │           ├── page.tsx           # Projects list for org
│   │           ├── create/
│   │           │   └── page.tsx
│   │           └── [projectSlug]/
│   │               ├── layout.tsx
│   │               ├── page.tsx       # Project overview
│   │               ├── board/
│   │               │   ├── page.tsx   # Kanban board view
│   │               │   └── layout.tsx
│   │               ├── list/
│   │               │   └── page.tsx   # Table/list view
│   │               ├── timeline/
│   │               │   └── page.tsx   # Gantt chart view
│   │               ├── members/
│   │               │   └── page.tsx
│   │               ├── settings/
│   │               │   └── page.tsx
│   │               └── tasks/
│   │                   ├── [taskId]/
│   │                   │   ├── page.tsx
│   │                   │   └── layout.tsx
│   │                   └── create/
│   │                       └── page.tsx
│   ├── my-tasks/
│   │   ├── page.tsx              # Assigned to me
│   │   └── layout.tsx
│   ├── search/
│   │   └── page.tsx              # Global search results
│   ├── notifications/
│   │   └── page.tsx
│   └── settings/
│       ├── page.tsx              # Account settings
│       ├── profile/
│       │   └── page.tsx
│       ├── preferences/
│       │   ├── page.tsx
│       │   └── notifications/
│       │       └── page.tsx
│       └── api/
│           └── page.tsx
└── _modal-routes/             # Intercepting routes for modals
    ├── task-details/
    │   └── [taskId]/
    │       └── page.tsx
    └── invite-modal/
        └── page.tsx
```

---

## 3. COMPONENT HIERARCHY

### 3.1 Layout Components
```
components/
├── layout/
│   ├── dashboardLayout.tsx
│   │   ├── Sidebar (persistent nav)
│   │   │   ├── Logo
│   │   │   ├── OrganizationSwitcher
│   │   │   ├── NavMenu
│   │   │   │   ├── Dashboard
│   │   │   │   ├── My Tasks
│   │   │   │   ├── Projects
│   │   │   │   └── Settings
│   │   │   └── CollapsibleToggle
│   │   ├── Header
│   │   │   ├── BreadcrumbNav
│   │   │   ├── SearchBar (global search)
│   │   │   ├── NotificationBell
│   │   │   ├── ThemeToggle
│   │   │   ├── UserAvatar
│   │   │   └── DropdownMenu
│   │   │       ├── Profile
│   │   │       ├── Settings
│   │   │       └── Logout
│   │   └── MainContent
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── breadcrumb.tsx
```

---

### 3.2 Feature Components

#### Authentication
```
components/
├── auth/
│   ├── AuthGuard.tsx          # Route protection wrapper
│   ├── LoginForm.tsx          # Email/password login
│   ├── RegisterForm.tsx       # Registration form
│   ├── SocialLogin.tsx        # OAuth providers
│   └── VerificationCode.tsx   # 2FA/email verification
```

#### Organization Management
```
components/
├── organization/
│   ├── OrganizationSelector.tsx      # Dropdown selector in sidebar
│   ├── OrganizationGrid.tsx          # List of orgs
│   ├── OrganizationCard.tsx          # Single org preview
│   ├── CreateOrgDialog.tsx           # Creation modal
│   ├── OrgSettingsForm.tsx           # Edit org details
│   ├── MembersList.tsx               # Org members table
│   ├── InviteMembersModal.tsx        # Bulk invite
│   ├── RoleSelector.tsx              # Role assignment
│   └── LeaveOrgConfirm.tsx           # Confirmation dialog
```

#### Project Management
```
components/
├── project/
│   ├── ProjectGrid.tsx               # Projects list view
│   ├── ProjectCard.tsx               # Project preview card
│   ├── CreateProjectDialog.tsx       # Creation form
│   ├── ProjectBanner.tsx             # Project header/info
│   ├── ProjectSettingsForm.tsx       # Edit form
│   ├── ProjectMembersList.tsx        # Project team
│   ├── ViewSwitcher.tsx              # Board/List/Timeline toggle
│   └── ProjectMenu.tsx               # Project context menu
```

#### Kanban Board
```
components/
├── board/
│   ├── boardContainer.tsx            # Main board layout
│   │   ├── Column (for each status)
│   │   │   ├── ColumnHeader
│   │   │   │   ├── Status name
│   │   │   │   ├── Task count
│   │   │   │   ├── Settings icon
│   │   │   │   └── Add task button
│   │   │   ├── TaskList (droppable zone)
│   │   │   │   └── TaskCard (draggable)
│   │   │   │       ├── Task title
│   │   │   │       ├── Priority badge
│   │   │   │       ├── Assignee avatar
│   │   │   │       ├── Due date
│   │   │   │       └── Quick actions menu
│   │   │   ├── ColumnSettings (add/edit/delete column)
│   │   │   └── EmptyState
│   │   ├── BoardHeader
│   │   │   ├── Project title
│   │   │   ├── Filter bar
│   │   │   └── Sort options
│   │   └── DragDropContext (dnd library setup)
│   ├── column.tsx
│   ├── taskCard.tsx
│   ├── taskDrawer.tsx                # Task detail sidebar
│   │   └── TaskDetails
│   │       ├── Title & description
│   │       ├── Status selector
│   │       ├── Priority selector
│   │       ├── Assignee selector
│   │       ├── Due date picker
│   │       ├── Labels
│   │       ├── Subtasks list
│   │       ├── Comments section
│   │       ├── Activity log
│   │       └── Delete button
│   ├── taskCreateForm.tsx
│   ├── boardFilters.tsx              # Advanced filtering
│   └── boardContextMenu.tsx          # Right-click menu
```

#### Task Management
```
components/
├── task/
│   ├── TaskDetailsModal.tsx          # Full task view (modal)
│   ├── TaskForm.tsx                  # Create/edit form
│   ├── TaskHeader.tsx                # Title & status
│   ├── TaskMetadata.tsx              # Priority, dates, assignee
│   ├── AssigneeSelector.tsx          # User selector dropdown
│   ├── PrioritySelector.tsx          # Priority dropdown
│   ├── DueDatePicker.tsx             # Date picker
│   ├── LabelSelector.tsx             # Multi-select labels
│   ├── SubtaskList.tsx               # Nested tasks
│   ├── CommentSection.tsx            # Comments & activity
│   │   ├── CommentInput
│   │   ├── CommentItem
│   │   └── CommentThread
│   ├── ActivityFeed.tsx              # Change history
│   └── TaskAttachments.tsx           # File uploads
```

#### List View
```
components/
├── table/
│   ├── TaskTable.tsx                 # Main table component
│   ├── TableHeader.tsx               # Sortable columns
│   ├── TableRow.tsx                  # Task row
│   ├── TableFilters.tsx              # Advanced filters
│   ├── ColumnVisibilityToggle.tsx    # Show/hide columns
│   ├── BulkActions.tsx               # Checkbox & actions
│   └── Pagination.tsx                # Page controls
```

#### Search & Navigation
```
components/
├── search/
│   ├── GlobalSearch.tsx              # Command palette style
│   ├── SearchInput.tsx
│   ├── SearchResults.tsx
│   └── SearchFilters.tsx
├── breadcrumb/
│   └── BreadcrumbNav.tsx             # Org > Project > View
└── navigation/
    ├── SidebarNav.tsx
    ├── NavItem.tsx
    └── NavCollapse.tsx
```

#### Forms & Dialogs
```
components/
├── forms/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── OrganizationForm.tsx
│   ├── ProjectForm.tsx
│   ├── TaskForm.tsx
│   ├── InvitationForm.tsx
│   └── SettingsForm.tsx
└── dialogs/
    ├── ConfirmDialog.tsx
    ├── AlertDialog.tsx
    └── PromptDialog.tsx
```

#### Common UI
```
components/
└── ui/ (shadcn/ui or similar)
    ├── button.tsx
    ├── input.tsx
    ├── textarea.tsx
    ├── select.tsx
    ├── checkbox.tsx
    ├── radio.tsx
    ├── toggle.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── avatar.tsx
    ├── dropdown.tsx
    ├── modal.tsx
    ├── popover.tsx
    ├── tooltip.tsx
    ├── tabs.tsx
    ├── accordion.tsx
    ├── progress.tsx
    ├── skeleton.tsx
    ├── spinner.tsx
    ├── alert.tsx
    ├── toast.tsx
    └── ...other shadcn components
```

---

## 4. REDUX STATE MANAGEMENT ARCHITECTURE

### 4.1 Store Structure
```
store/
├── index.ts                  # Store configuration, middleware setup
├── auth/
│   ├── authSlice.ts         # State + reducers
│   ├── authThunk.ts         # Async operations
│   └── authSelector.ts      # Selectors (optional)
├── organization/
│   ├── organizationSlice.ts
│   ├── organizationThunk.ts
│   └── organizationSelector.ts
├── project/
│   ├── projectSlice.ts
│   ├── projectThunk.ts
│   └── projectSelector.ts
├── task/
│   ├── taskSlice.ts
│   ├── taskThunk.ts
│   └── taskSelector.ts
├── board/
│   ├── boardSlice.ts        # Board state (columns, filters)
│   ├── boardThunk.ts        # Column operations
│   └── boardSelector.ts
├── ui/
│   ├── uiSlice.ts           # UI state (theme, sidebar, modals)
│   └── uiSelector.ts
├── search/
│   ├── searchSlice.ts       # Search results cache
│   └── searchThunk.ts
└── notification/
    ├── notificationSlice.ts # Toast/notification queue
    └── notificationThunk.ts
```

---

### 4.2 Auth State Management
```typescript
// State Structure (authSlice)
{
  auth: {
    user: {
      id, email, name, avatar, createdAt
    },
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null,
    token: string | null,
    refreshToken: string | null,
    expiresAt: number | null,
    2faRequired: boolean
  }
}

// Thunks (authThunk)
- loginUser(email, password)           → POST /auth/login
- registerUser(email, password, name)  → POST /auth/register
- logoutUser()                         → POST /auth/logout
- verifyToken()                        → POST /auth/verify
- getMe()                              → GET /auth/me
- refreshTokenUser()                   → POST /auth/refresh
- verify2FA(code)                      → POST /auth/verify-2fa
- requestPasswordReset(email)          → POST /auth/password-reset
- resetPassword(token, newPassword)    → POST /auth/password-reset/confirm
```

---

### 4.3 Organization State Management
```typescript
// State Structure (organizationSlice)
{
  organization: {
    currentOrganization: {
      id, name, slug, logo, createdAt, owner, members[]
    },
    organizations: [],      // List of user's orgs
    members: [],           // Current org members
    membersLoading: boolean,
    invitations: [],       // Pending invites
    isLoading: boolean,
    error: string | null
  }
}

// Thunks (organizationThunk)
- fetchOrganizations()                 → GET /organizations
- fetchOrganizationById(id)           → GET /organizations/:id
- createOrganization(data)            → POST /organizations
- updateOrganization(id, data)        → PUT /organizations/:id
- deleteOrganization(id)              → DELETE /organizations/:id
- switchOrganization(id)              → Update currentOrganization
- getOrganizationMembers(id)          → GET /organizations/:id/members
- inviteMembers(id, emails, role)     → POST /organizations/:id/invitations
- updateMemberRole(id, memberId, role) → PUT /organizations/:id/members/:memberId/role
- removeMember(id, memberId)          → DELETE /organizations/:id/members/:memberId
- acceptInvitation(inviteToken)       → POST /invitations/:token/accept
- rejectInvitation(inviteToken)       → POST /invitations/:token/reject
```

---

### 4.4 Project State Management
```typescript
// State Structure (projectSlice)
{
  project: {
    currentProject: {
      id, name, slug, description, org_id, visibility,
      owner, members[], columns[], settings{}
    },
    projects: [],          // List filtered by org
    projectMembers: [],
    columns: [],           // Task columns (statuses)
    isLoading: boolean,
    error: string | null
  }
}

// Thunks (projectThunk)
- fetchProjectsByOrg(orgId)           → GET /organizations/:orgId/projects
- fetchProjectById(projectId)         → GET /projects/:projectId
- createProject(orgId, data)          → POST /organizations/:orgId/projects
- updateProject(projectId, data)      → PUT /projects/:projectId
- deleteProject(projectId)            → DELETE /projects/:projectId
- switchProject(projectId)            → Update currentProject
- getProjectMembers(projectId)        → GET /projects/:projectId/members
- addProjectMembers(projectId, userIds) → POST /projects/:projectId/members
- updateProjectMemberRole(projectId, userId, role) → PUT /projects/:projectId/members/:userId/role
- removeProjectMember(projectId, userId) → DELETE /projects/:projectId/members/:userId
- getProjectColumns(projectId)        → GET /projects/:projectId/columns
- updateColumnSettings(projectId, columnId, data) → PUT /projects/:projectId/columns/:columnId
- fetchProjectSettings(projectId)     → GET /projects/:projectId/settings
```

---

### 4.5 Task State Management
```typescript
// State Structure (taskSlice)
{
  task: {
    tasks: {                           // Indexed by projectId
      [projectId]: [
        { id, title, description, status, priority, assignee,
          dueDate, labels[], subtasks[], comments[], files[] }
      ]
    },
    currentTask: { ...taskData, comments[], activity[] },
    taskFilters: {
      status: [], priority: [], assignee: [], search: ""
    },
    isLoading: boolean,
    error: string | null
  }
}

// Thunks (taskThunk)
- fetchProjectTasks(projectId, filters)     → GET /projects/:projectId/tasks
- fetchTaskById(projectId, taskId)          → GET /tasks/:taskId
- createTask(projectId, data)               → POST /projects/:projectId/tasks
- updateTask(taskId, data)                  → PUT /tasks/:taskId
- deleteTask(taskId)                        → DELETE /tasks/:taskId
- moveTaskToColumn(taskId, columnId)        → PUT /tasks/:taskId/status
- assignTask(taskId, userId)                → PUT /tasks/:taskId/assignee
- unassignTask(taskId)                      → DELETE /tasks/:taskId/assignee
- updateTaskPriority(taskId, priority)      → PUT /tasks/:taskId/priority
- setTaskDueDate(taskId, dueDate)           → PUT /tasks/:taskId/due-date
- addTaskLabel(taskId, labelId)             → POST /tasks/:taskId/labels
- removeTaskLabel(taskId, labelId)          → DELETE /tasks/:taskId/labels/:labelId
- addSubtask(taskId, title)                 → POST /tasks/:taskId/subtasks
- updateSubtask(taskId, subtaskId, data)    → PUT /tasks/:taskId/subtasks/:subtaskId
- deleteSubtask(taskId, subtaskId)          → DELETE /tasks/:taskId/subtasks/:subtaskId
- addComment(taskId, content, mentions)     → POST /tasks/:taskId/comments
- updateComment(taskId, commentId, content) → PUT /tasks/:taskId/comments/:commentId
- deleteComment(taskId, commentId)          → DELETE /tasks/:taskId/comments/:commentId
- replyToComment(taskId, commentId, reply)  → POST /tasks/:taskId/comments/:commentId/replies
- uploadTaskAttachment(taskId, file)        → POST /tasks/:taskId/attachments
- deleteTaskAttachment(taskId, attachmentId) → DELETE /tasks/:taskId/attachments/:attachmentId
```

---

### 4.6 Board State Management
```typescript
// State Structure (boardSlice)
{
  board: {
    projectId: string,
    columns: [
      { id, name, status, taskIds[], settings{} }
    ],
    columnOrder: [],        // For reordering
    tasks: {},              // Normalized task data
    filters: {
      status: [],
      priority: [],
      assignee: [],
      labels: [],
      search: ""
    },
    view: 'board' | 'list' | 'timeline',
    selectedView: 'board',
    isLoading: boolean,
    dragState: {
      isDragging: boolean,
      draggedTaskId: string | null,
      sourceColumnId: string | null
    }
  }
}

// Thunks (boardThunk)
- reorderColumns(projectId, columnIds)     → PUT /projects/:projectId/columns/reorder
- reorderTasks(columnId, taskIds)          → PUT /columns/:columnId/tasks/reorder
- moveTaskBetweenColumns(taskId, toColumnId, position)
                                           → PUT /tasks/:taskId/move
- createColumn(projectId, name)            → POST /projects/:projectId/columns
- updateColumn(columnId, name)             → PUT /columns/:columnId
- deleteColumn(columnId)                   → DELETE /columns/:columnId
- setBoardFilters(filters)                 → Local state update (no API call)
- fetchBoardData(projectId)                → GET /projects/:projectId/board
```

---

### 4.7 UI State Management
```typescript
// State Structure (uiSlice)
{
  ui: {
    theme: 'light' | 'dark' | 'system',
    sidebarOpen: boolean,
    sidebarCollapsed: boolean,
    modals: {
      taskDetailsOpen: boolean,
      createTaskOpen: boolean,
      inviteModalOpen: boolean,
      settingsModalOpen: boolean
    },
    notifications: [],
    toasts: [],
    loading: {
      global: boolean,
      [key: string]: boolean   // Component-specific loading states
    }
  }
}

// Actions (uiSlice - no thunks needed)
- toggleTheme()
- setTheme(theme)
- toggleSidebar()
- toggleSidebarCollapse()
- openModal(modalName)
- closeModal(modalName)
- addNotification(notification)
- removeNotification(id)
- addToast(toast)
- removeToast(id)
- setLoading(key, loading)
```

---

### 4.8 Search State Management
```typescript
// State Structure (searchSlice)
{
  search: {
    query: string,
    results: {
      tasks: [],
      projects: [],
      organizations: [],
      users: []
    },
    isLoading: boolean,
    error: string | null,
    recentSearches: []
  }
}

// Thunks (searchThunk)
- globalSearch(query)          → GET /search?q=query
- searchTasks(projectId, query) → GET /projects/:projectId/tasks/search
- searchUsers(query)           → GET /users/search
```

---

### 4.9 Notification State Management
```typescript
// State Structure (notificationSlice)
{
  notifications: {
    items: [],
    unreadCount: number,
    isLoading: boolean
  }
}

// Thunks (notificationThunk)
- fetchNotifications()         → GET /notifications
- markAsRead(notificationId)   → PUT /notifications/:id/read
- markAllAsRead()              → PUT /notifications/read-all
- deleteNotification(id)       → DELETE /notifications/:id
- subscribe()                  → WebSocket connection for real-time
```

---

## 5. HOOKS ARCHITECTURE

```
hooks/
├── redux.ts                      # useAppDispatch, useAppSelector
├── useAuth.ts                    # Auth state + actions
├── useOrganization.ts            # Organization state + actions
├── useProject.ts                 # Project state + actions
├── useTask.ts                    # Task state + actions
├── useBoard.ts                   # Board filtering + drag state
├── useSearch.ts                  # Search functionality
├── useNotifications.ts           # Notification management
├── useLocalStorage.ts            # Persist preferences
├── useDebounce.ts                # Debounce values
├── useIntersectionObserver.ts    # Infinite scroll
├── useDragAndDrop.ts             # Drag-drop logic
├── useEventListener.ts           # Window/DOM events
├── useMediaQuery.ts              # Responsive breakpoints
├── useAsync.ts                   # Generic async handler
└── useForm.ts                    # Form state management
```

---

## 6. API SERVICE LAYER

```
services/
├── api.ts                        # Axios instance configuration
├── auth.service.ts               # /auth/* endpoints
├── organization.service.ts       # /organizations/* endpoints
├── project.service.ts            # /projects/* endpoints
├── task.service.ts               # /tasks/* endpoints
├── search.service.ts             # /search/* endpoints
├── notification.service.ts       # /notifications/* endpoints
├── upload.service.ts             # File upload handling
├── ws.service.ts                 # WebSocket for real-time
└── constants.ts                  # API URLs, timeouts, retry config
```

**Key Features:**
- Request/response interceptors
- Authentication token injection
- Error handling & retry logic
- Request throttling/debouncing
- Request cancellation tokens
- Timeout management
- Base URL management for environments

---

## 7. TYPE DEFINITIONS

```
types/
├── index.ts                      # Re-exports
├── auth.types.ts
│   ├── User, LoginRequest, RegisterRequest
│   ├── AuthResponse, TokenResponse
│   └── LoginCredentials, PasswordResetRequest
├── organization.types.ts
│   ├── Organization, OrganizationMember
│   ├── CreateOrgRequest, UpdateOrgRequest
│   ├── InvitationPayload, MemberRole
│   └── OrganizationSettings
├── project.types.ts
│   ├── Project, ProjectMember
│   ├── CreateProjectRequest, UpdateProjectRequest
│   ├── ProjectSettings, ProjectVisibility
│   └── TaskColumn
├── task.types.ts
│   ├── Task, TaskStatus, Priority
│   ├── CreateTaskRequest, UpdateTaskRequest
│   ├── Subtask, Comment, CommentReply
│   ├── TaskLabel, TaskAttachment
│   ├── TaskFilter, TaskSort
│   └── TaskActivityLog
├── board.types.ts
│   ├── BoardColumn, BoardData
│   ├── DragDropState, DragDropResult
│   └── BoardFilters
├── api.types.ts
│   ├── ApiResponse, PaginatedResponse
│   ├── ApiError, ErrorResponse
│   └── RequestConfig
├── ui.types.ts
│   ├── Modal, Toast, Notification
│   ├── FormField, FormError
│   └── Theme
└── common.types.ts
    ├── EntityStatus (pending, success, error)
    ├── PaginationParams, PaginationMeta
    ├── SortOrder, FilterOperator
    └── Timestamps (createdAt, updatedAt)
```

---

## 8. MIDDLEWARE & INTERCEPTORS

```
middleware/
├── authMiddleware.ts             # Token validation, auto-refresh
├── errorMiddleware.ts            # Error handling, retry logic
├── loggingMiddleware.ts          # Request/response logging
├── rateLimitMiddleware.ts        # Rate limit handling
└── websocketMiddleware.ts        # Real-time updates
```

---

## 9. ROUTE PROTECTION & AUTHENTICATION FLOW

### 9.1 Protected Routes Strategy
```
1. Root layout checks authentication
   └─ If no token, redirect to /login
   
2. Dashboard layout (AuthGuard)
   └─ Verifies token validity
   └─ Refreshes if needed
   └─ Redirects to login if invalid
   
3. Organization routes require:
   └─ Valid auth
   └─ Membership in org
   
4. Project routes require:
   └─ Valid auth
   └─ Project membership
   └─ Organization membership
```

### 9.2 AuthGuard Implementation Points
```
- app/dashboard/layout.tsx wraps all protected routes
- Route-specific checks:
  - /dashboard/organizations/[orgSlug]/* → Verify org membership
  - /dashboard/[orgId]/projects/[projectSlug]/* → Verify project access
  - /dashboard/[orgId]/projects/[projectSlug]/settings/* → Verify admin role
```

---

## 10. KEY FEATURES & INTEGRATION POINTS

### 10.1 Authentication Flow
```
Login Page
  ├─ Email/password input
  ├─ Social OAuth (Google, GitHub, MS)
  ├─ Remember device option
  ├─ API Call: POST /auth/login
  ├─ Store tokens: Access + Refresh
  ├─ Redirect to /dashboard or last visited URL
  └─ 2FA verification if enabled
     └─ API Call: POST /auth/verify-2fa
```

### 10.2 Organization Switcher
```
Location: Sidebar header
Features:
  ├─ Dropdown list of user's organizations
  ├─ "+ Create Organization" button
  ├─ Search within orgs
  ├─ Recent orgs pinning
  ├─ Current org highlight
  └─ On Selection: Switch context + reload projects
     └─ Persist preference to localStorage
     └─ Update Redux state
```

### 10.3 Project Board View
```
Container: boardContainer.tsx
Layout:
  ├─ Header
  │  ├─ Breadcrumb (Org > Project > Board)
  │  ├─ View toggle (Board/List/Timeline)
  │  ├─ Filter bar
  │  └─ Sort dropdown
  ├─ Main area (drag-drop enabled)
  │  ├─ Multiple columns (Status-based)
  │  │  ├─ Column header (count, options)
  │  │  ├─ Task cards (draggable)
  │  │  └─ Add task button
  │  └─ Add column option
  └─ Task drawer (right sidebar)
     └─ Opens on task card click
     └─ Full task details + editing
     └─ Smooth animation transitions
```

### 10.4 Task Drawer Features
```
When task clicked from board:
  ├─ Slide-in drawer from right
  ├─ Show rich task details
  ├─ Enable inline editing
  ├─ Assignee selector
  ├─ Status/Priority dropdowns
  ├─ Comments section
  ├─ Activity timeline
  ├─ Subtask list
  ├─ File attachments
  ├─ Audit log
  └─ ESC or click outside to close
```

### 10.5 Responsive Design
```
Breakpoints:
  ├─ Mobile (< 640px): Single column, hamburger menu
  ├─ Tablet (640px - 1024px): Sidebar collapses on toggle
  ├─ Desktop (> 1024px): Full layout
  
Responsive Components:
  ├─ Sidebar: Collapsible on mobile/tablet
  ├─ Board: Horizontal scroll on mobile
  ├─ Table: Card view on mobile
  ├─ Modals: Full-screen on mobile
  └─ Header: Responsive button grouping
```

### 10.6 Error Handling
```
Global Error Handler:
  ├─ Intercept API errors
  ├─ Show toast notifications
  ├─ Log to error tracking (Sentry)
  ├─ Retry logic for specific errors
  └─ Graceful fallbacks
  
Error Boundaries:
  ├─ Root boundary (entire app)
  ├─ Page-level boundaries
  ├─ Component-level boundaries
  └─ Show error UI with retry option
```

### 10.7 Loading States
```
Global Loading:
  ├─ Show spinner during initial load
  ├─ Skeleton screens for data views
  ├─ Blur existing content with overlay
  
Component Loading:
  ├─ Individual button loading states
  ├─ Inline spinners
  ├─ Disabled state while loading
  ├─ "Loading..." text in buttons
  
Data Fetching:
  ├─ Show skeletons while fetching
  ├─ Maintain scroll position
  ├─ Preserve form input during fetch
```

### 10.8 Real-time Features
```
WebSocket Connection:
  ├─ Connect on auth
  ├─ Subscribe to relevant channels:
  │  ├─ /organizations/:orgId
  │  ├─ /projects/:projectId
  │  ├─ /tasks/:taskId
  │  ├─ /user/:userId/notifications
  │  └─ /user/:userId/invitations
  ├─ Handle disconnection + reconnection
  ├─ Merge socket updates with Redux
  ├─ Debounce high-frequency updates
  └─ Disconnect on logout
  
Real-time Updates:
  ├─ Task moved: Broadcast to watchers
  ├─ Task updated: Live sync across users
  ├─ Comments added: Instant delivery
  ├─ Members joined: Live user list update
  └─ Notifications: Push to users in real-time
```

### 10.9 Performance Optimization
```
Code Splitting:
  ├─ Dynamic imports for pages
  ├─ Lazy load components
  ├─ Suspense boundaries for async components
  
Caching:
  ├─ Redux for state persistence
  ├─ localStorage for preferences
  ├─ HTTP response caching
  ├─ Service worker for offline support
  
Image & Assets:
  ├─ Next.js Image optimization
  ├─ SVG inlining for icons
  ├─ Lazy load images below fold
  ├─ WebP format with fallbacks
  
Bundle Optimization:
  ├─ Tree-shaking for unused code
  ├─ Minification (built-in)
  ├─ CSS extraction and minification
  └─ Remove console logs in production
```

---

## 11. CONSTANTS & CONFIG

```
constants/
├── api.constants.ts
│   ├── API_BASE_URL, API_TIMEOUT
│   ├── Endpoint paths
│   └── HTTP status codes
├── roles.constants.ts
│   ├── Organization roles: Owner, Admin, Member, Guest
│   ├── Project roles: Manager, Lead, Developer, Viewer
│   └── Permission mappings
├── taskPriority.constants.ts
│   ├── Critical, High, Medium, Low, None
│   └── Color mappings
├── taskStatus.constants.ts
│   ├─ Common statuses: Todo, In Progress, In Review, Done, Blocked
│   └── Custom statuses per project
├── ui.constants.ts
│   ├── Breakpoints, colors, spacing
│   ├── Animation durations
│   └── Toast/modal timeouts
└── validation.constants.ts
    ├── Email regex, password requirements
    ├── Name/title length limits
    └── Form field validators
```

---

## 12. ENVIRONMENT CONFIGURATION

```
.env.local / .env.example
├── NEXT_PUBLIC_API_URL=https://api.example.com
├── NEXT_PUBLIC_WS_URL=wss://api.example.com/ws
├── NEXT_PUBLIC_SENTRY_DSN=...
├── NEXT_PUBLIC_ENVIRONMENT=production|development
├── NEXT_PUBLIC_GOOGLE_OAUTH_ID=...
└── NEXT_PUBLIC_GITHUB_OAUTH_ID=...
```

---

## 13. IMPLEMENTATION ROADMAP PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] Setup Redux store structure
- [ ] Implement auth thunks & state
- [ ] Create AuthGuard & login/register pages
- [ ] Setup API service layer
- [ ] Create basic layout components
- [ ] Implement theme toggle

### Phase 2: Organization Management (Week 3)
- [ ] Organization CRUD operations
- [ ] Organization state management
- [ ] Organization switcher component
- [ ] Member management UI
- [ ] Invitation system

### Phase 3: Project Management (Week 4)
- [ ] Project CRUD operations
- [ ] Project state management
- [ ] Projects list/grid view
- [ ] Project settings
- [ ] Member roles & permissions

### Phase 4: Kanban Board (Week 5-6)
- [ ] Task state management
- [ ] Board state & filters
- [ ] Kanban board layout
- [ ] Drag-and-drop functionality
- [ ] Task card components
- [ ] Task drawer/details view

### Phase 5: Task Management (Week 7)
- [ ] Create/edit tasks
- [ ] Task metadata (priority, due date, etc.)
- [ ] Comments & activity log
- [ ] Subtasks
- [ ] File attachments
- [ ] Inline task editing

### Phase 6: List View & Advanced Features (Week 8)
- [ ] Table component for list view
- [ ] Advanced filtering
- [ ] Bulk actions
- [ ] Sorting & column visibility
- [ ] Task timeline/Gantt view

### Phase 7: Polish & Optimization (Week 9-10)
- [ ] Error boundaries
- [ ] Loading states
- [ ] Responsive design refinement
- [ ] Performance optimization
- [ ] Real-time features (WebSocket)
- [ ] Testing (unit & integration)

### Phase 8: Deployment & DevOps (Week 11+)
- [ ] CI/CD pipeline setup
- [ ] Error tracking (Sentry)
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] Security audit
- [ ] Production deployment

---

## 14. TECHNOLOGY STACK RECOMMENDATIONS

**Core:**
- Next.js 14+ (App Router)
- TypeScript
- React 18+
- Redux Toolkit
- Redux Thunk

**Styling:**
- Tailwind CSS
- shadcn/ui components
- Framer Motion (animations)

**UI/UX:**
- Drag-drop: react-beautiful-dnd or dnd-kit
- Date picker: react-day-picker
- Rich text: TipTap or Slate
- Code highlighting: Prism.js

**Utilities:**
- Axios (HTTP client)
- Zod (validation)
- date-fns (date manipulation)
- React Query (optional, for caching)

**Developer Tools:**
- ESLint + Prettier
- Storybook (component docs)
- Jest + React Testing Library
- Vitest (fast unit testing)

**Monitoring:**
- Sentry (error tracking)
- LogRocket (session replay)
- Google Analytics (usage tracking)

---

## 15. SECURITY CONSIDERATIONS

```
Authentication:
  ├─ Secure token storage (HttpOnly cookies or sessionStorage)
  ├─ CSRF protection
  ├─ Token refresh logic
  └─ 2FA support

Authorization:
  ├─ Role-based access control (RBAC)
  ├─ Organization-scoped permissions
  ├─ Resource-level authorization
  └─ Audit logging of sensitive actions

Data:
  ├─ HTTPS only
  ├─ Input sanitization & validation
  ├─ XSS prevention (React built-in)
  ├─ CORS configuration
  └─ File upload validation

Secrets:
  ├─ Environment variables (no hardcoded secrets)
  ├─ API key rotation
  └─ OAuth client secrets management
```

---

## 16. MONITORING & DEBUGGING

```
Development:
  ├─ Redux DevTools integration
  ├─ React DevTools
  ├─ Network tab debugging
  ├─ Console error logging
  └─ Verbose logging for thunks

Production:
  ├─ Error tracking: Sentry
  ├─ Session replay: LogRocket
  ├─ Performance: Vercel Analytics
  ├─ User behavior: Mixpanel/Amplitude
  └─ API health: Uptime monitoring
```

---

## 17. TESTING STRATEGY

```
Unit Tests:
  ├─ Reducers & selectors
  ├─ Thunks (mocking API calls)
  ├─ Utility functions
  └─ Hooks logic

Component Tests:
  ├─ Render with Redux store
  ├─ User interactions
  ├─ Props variations
  └─ Error states

Integration Tests:
  ├─ Redux + component interaction
  ├─ Navigation flows
  ├─ Form submission
  └─ Authentication flows

E2E Tests:
  ├─ Critical user journeys
  ├─ Authentication flow
  ├─ Board interactions
  ├─ Task creation/editing
  └─ Cross-browser testing (Playwright/Cypress)
```

---

## NEXT STEPS

1. **Set up Redux store** with all slices and thunks
2. **Create API service layer** with proper error handling
3. **Build layout structure** with sidebar, header, and auth guard
4. **Implement authentication** (login/register pages and flows)
5. **Create organization management** UI and state
6. **Build project management** pages and components
7. **Develop kanban board** with drag-and-drop
8. **Add task management** features (create, edit, comments)
9. **Implement additional views** (list, timeline, search)
10. **Polish and optimize** for production deployment

This roadmap provides a complete blueprint for a production-ready SaaS frontend. Each section can be implemented incrementally, and dependencies are clearly marked.
