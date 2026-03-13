# Visual Architecture & Data Flow Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      PRESENTATION LAYER                       │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │                                                              │   │
│  │  Pages (Next.js App Router)                                 │   │
│  │  ├─ /login, /register                                       │   │
│  │  ├─ /dashboard/*                                            │   │
│  │  ├─ /dashboard/organizations/*                              │   │
│  │  ├─ /dashboard/[orgId]/projects/*                           │   │
│  │  └─ /dashboard/[orgId]/projects/[projectSlug]/*             │   │
│  │                                                              │   │
│  │  Components (React)                                         │   │
│  │  ├─ Layout (Sidebar, Header, Main)                          │   │
│  │  ├─ Features (Board, TaskForm, OrgPanel, etc)               │   │
│  │  ├─ UI (shadcn/ui components)                               │   │
│  │  └─ Error Boundaries                                        │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│           ↓ (Props, Events, Hooks)                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    STATE MANAGEMENT LAYER                    │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │                                                              │   │
│  │  Redux Store                                                │   │
│  │  ├─ auth (user, token, isAuthenticated)                     │   │
│  │  ├─ organization (currentOrg, list, members)                │   │
│  │  ├─ project (currentProject, list, members)                 │   │
│  │  ├─ board (columns, tasks, filters, dragState)              │   │
│  │  ├─ task (tasks, currentTask, comments)                     │   │
│  │  ├─ ui (theme, modals, loading, notifications)              │   │
│  │  ├─ search (results, query, recentSearches)                 │   │
│  │  └─ notification (items, unreadCount)                       │   │
│  │                                                              │   │
│  │  Async Thunks (Redux Toolkit)                               │   │
│  │  ├─ Auth: loginUser, registerUser, logoutUser, etc          │   │
│  │  ├─ Organization: CRUD operations                           │   │
│  │  ├─ Project: CRUD operations                                │   │
│  │  ├─ Board: Reorder columns, manage filters                  │   │
│  │  ├─ Task: CRUD, move, assign, comment, etc                  │   │
│  │  └─ Others: Search, notifications                           │   │
│  │                                                              │   │
│  │  Selectors (Memoized)                                       │   │
│  │  └─ selectCurrentUser, selectProjectTasks, etc              │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│           ↓ (Service calls, data fetching)                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    API & SERVICE LAYER                       │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │                                                              │   │
│  │  Axios Instance + Interceptors                              │   │
│  │  ├─ Request: Add auth token, headers                        │   │
│  │  ├─ Response: Parse data, handle errors                     │   │
│  │  └─ Retry: Implement exponential backoff                    │   │
│  │                                                              │   │
│  │  Service Classes                                            │   │
│  │  ├─ auth.service.ts (login, register, verify)              │   │
│  │  ├─ organization.service.ts (CRUD + members)               │   │
│  │  ├─ project.service.ts (CRUD + members + columns)          │   │
│  │  ├─ task.service.ts (CRUD + comments + attachments)        │   │
│  │  ├─ search.service.ts (global search)                       │   │
│  │  ├─ notification.service.ts (notifications)                 │   │
│  │  ├─ upload.service.ts (file uploads)                        │   │
│  │  └─ ws.service.ts (WebSocket)                               │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│           ↓ (HTTP & WebSocket)                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    BACKEND API & SERVICES                     │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │                                                              │   │
│  │  REST Endpoints:                                            │   │
│  │  ├─ POST /auth/login, /auth/register, /auth/logout          │   │
│  │  ├─ GET /organizations, POST /organizations/*               │   │
│  │  ├─ GET /projects, POST /projects/*                         │   │
│  │  ├─ GET /tasks, POST /tasks/*                               │   │
│  │  ├─ GET /search                                             │   │
│  │  └─ GET /notifications, PUT /notifications/:id              │   │
│  │                                                              │   │
│  │  WebSocket:                                                 │   │
│  │  └─ wss://api/ws (Subscriptions: org, project, task)        │   │
│  │                                                              │   │
│  │  Database:                                                  │   │
│  │  ├─ Users                                                   │   │
│  │  ├─ Organizations                                           │   │
│  │  ├─ Projects                                                │   │
│  │  ├─ Tasks                                                   │   │
│  │  ├─ Comments                                                │   │
│  │  └─ Activity Log                                            │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Redux Data Flow Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    REDUX DATA FLOW                               │
└─────────────────────────────────────────────────────────────────┘

1. USER ACTION / COMPONENT TRIGGER
   │
   ├─ User clicks button
   ├─ Form submitted
   ├─ Component lifecycle event
   └─ WebSocket message received

2. DISPATCH ACTION / THUNK
   │
   └─→ dispatch(actionCreator) or dispatch(asyncThunk(params))

3. THUNK EXECUTION (if async)
   │
   ├─→ Call API via service layer
   ├─→ Handle API call lifecycle:
   │  ├─ Pending: isLoading = true
   │  ├─ Fulfilled: Update state with response
   │  └─ Rejected: Store error, set isLoading = false
   └─→ Return response or error

4. REDUCER UPDATES STATE
   │
   ├─→ Reducers handle action
   ├─→ Return new state (Immer + RTK = immutable)
   └─→ State is now updated

5. SELECTORS COMPUTE DERIVED DATA
   │
   └─→ Memoized selectors recompute only when dependencies change
       └─ Prevents unnecessary component re-renders

6. COMPONENTS RE-RENDER
   │
   ├─→ useSelector triggers re-render if selected state changed
   ├─→ Component receives new props
   └─→ Component renders new output

7. NEW UI DISPLAYED
   │
   └─→ User sees updated interface
       └─ Cycle continues with next user action

EXAMPLE FLOW: Fetching Tasks
────────────────────────────

User clicks "Load Tasks"
     ↓
dispatch(fetchProjectTasks(projectId))
     ↓
Thunk: Pending state
  - isLoading = true
  - error = null
     ↓
API Call: GET /projects/proj-123/tasks
     ↓
Response: 200 OK with task list
     ↓
Thunk: Fulfilled state
  - isLoading = false
  - tasks = [task1, task2, ...]
     ↓
Selector: selectProjectTasks recomputes
     ↓
Component: useSelector detects change
     ↓
Component: Re-renders with new tasks
     ↓
UI: Displays task list
```

---

## Component Hierarchy: Kanban Board

```
<DashboardLayout> (Container)
│
├─ <AuthGuard> (Wrapper)
│  │
│  ├─ <Sidebar>
│  │
│  ├─ <Header>
│  │
│  └─ <MainContent>
│     │
│     └─ <BoardPage> (Smart Component - connected to Redux)
│        │
│        ├─ Data from Redux:
│        │  ├─ tasks
│        │  ├─ columns
│        │  ├─ filters
│        │  └─ dispatch
│        │
│        ├─ <BoardHeader> (Dumb Component)
│        │  ├─ Receives: projectName, filters, dispatch
│        │  │
│        │  ├─ <Breadcrumb>
│        │  │  └─ Org > Project > Board
│        │  │
│        │  ├─ <ViewSwitcher>
│        │  │  ├─ onClick: Switch to List / Timeline
│        │  │  └─ dispatch(setView(...))
│        │  │
│        │  ├─ <FilterBar>
│        │  │  ├─ Inputs: status, priority, assignee
│        │  │  └─ onChange: dispatch(setFilters(...))
│        │  │
│        │  └─ <SortDropdown>
│        │     └─ onChange: dispatch(setSort(...))
│        │
│        ├─ <DragDropProvider> (From react-beautiful-dnd)
│        │  │
│        │  └─ <BoardContent> (Dumb Component)
│        │     │
│        │     ├─ Receives: columns, tasks, onDragEnd
│        │     │
│        │     ├─ {columns.map((column) => (
│        │     │    <Column key={column.id} column={column}>
│        │     │      │
│        │     │      ├─ <ColumnHeader>
│        │     │      │  ├─ Status name
│        │     │      │  ├─ Task count badge
│        │     │      │  └─ <ColumnMenu>
│        │     │      │
│        │     │      ├─ <Droppable key={column.id}>
│        │     │      │  └─ {tasks.map((task) => (
│        │     │      │     <Draggable key={task.id}>
│        │     │      │       <TaskCard
│        │     │      │         task={task}
│        │     │      │         onClick={() => dispatch(openTaskDrawer(task.id))}
│        │     │      │         onContextMenu={...}
│        │     │      │       >
│        │     │      │         ├─ <TaskCardTitle>
│        │     │      │         ├─ <PriorityBadge>
│        │     │      │         ├─ <AssigneeAvatar>
│        │     │      │         ├─ <DueDateLabel>
│        │     │      │         └─ <QuickActions>
│        │     │      │       </TaskCard>
│        │     │      │     ))}
│        │     │      │
│        │     │      └─ <ColumnFooter>
│        │     │         └─ <AddTaskButton
│        │     │            onClick={() => dispatch(openCreateTaskModal())}
│        │     │           />
│        │     │
│        │     └─ <AddColumnButton>
│        │        onClick={() => dispatch(openCreateColumnModal())}
│        │
│        ├─ <TaskDrawer> (Right Sidebar - Smart)
│        │  │ Receives: taskId, isOpen, dispatch
│        │  │
│        │  ├─ Condition: if (!isOpen) return null
│        │  │
│        │  └─ <DrawerContent>
│        │     ├─ <TaskDetails>
│        │     │  ├─ <TaskTitle>
│        │     │  │  └─ contentEditable on double-click
│        │     │  │
│        │     │  ├─ <TaskDescription>
│        │     │  │  └─ Edit modal on click
│        │     │  │
│        │     │  ├─ <MetadataSection>
│        │     │  │  ├─ <StatusSelector>
│        │     │  │  │  └─ onChange: dispatch(updateTask({status}))
│        │     │  │  ├─ <PrioritySelector>
│        │     │  │  ├─ <AssigneeSelector>
│        │     │  │  └─ <DueDatePicker>
│        │     │  │
│        │     │  ├─ <LabelList>
│        │     │  │  └─ onClick: dispatch(removeLabel(...))
│        │     │  │
│        │     │  ├─ <SubtaskList>
│        │     │  │  ├─ {subtasks.map((subtask) => (
│        │     │  │  │    <SubtaskItem
│        │     │  │  │      onChange={() => dispatch(updateSubtask(...))}
│        │     │  │  │    />
│        │     │  │  │  ))}
│        │     │  │  └─ <AddSubtaskButton>
│        │     │  │
│        │     │  ├─ <CommentSection>
│        │     │  │  ├─ <CommentInput>
│        │     │  │  │  └─ onSubmit: dispatch(addComment(...))
│        │     │  │  │
│        │     │  │  └─ <CommentsList>
│        │     │  │     └─ {comments.map((comment) => (
│        │     │  │        <CommentItem
│        │     │  │          onEdit: dispatch(updateComment(...))
│        │     │  │          onDelete: dispatch(deleteComment(...))
│        │     │  │        />
│        │     │  │      ))}
│        │     │  │
│        │     │  └─ <ActivityFeed>
│        │     │     └─ Display all changes chronologically
│        │     │
│        │     └─ <DrawerActions>
│        │        ├─ Delete button
│        │        ├─ Archive button
│        │        └─ More menu
│        │
│        ├─ <Modals>
│        │  ├─ <CreateTaskModal>
│        │  │  └─ <TaskForm onSubmit={...} />
│        │  │
│        │  ├─ <CreateColumnModal>
│        │  │  └─ <ColumnForm onSubmit={...} />
│        │  │
│        │  └─ <ConfirmDialog> (for delete operations)
│        │
│        └─ <ErrorState / EmptyState>
│
└─ <Notifications>
   └─ <Toast> components for feedback
```

---

## Data Flow: Creating a Task

```
┌─────────────────────────────────────────────────────┐
│          USER CREATES A TASK (KANBAN)               │
└─────────────────────────────────────────────────────┘

1. USER INTERACTION
   └─ Click "Add task" button in board column
        ↓
2. COMPONENT ACTION
   └─ dispatch(openCreateTaskModal())
        ↓
3. UI STATE UPDATE
   └─ boardSlice.ui.createTaskModalOpen = true
        ↓
4. MODAL RENDERS
   └─ <CreateTaskModal> becomes visible
        ↓
5. USER FILLS FORM
   ├─ Title
   ├─ Description
   ├─ Priority
   ├─ Assignee
   └─ Due date
        ↓
6. USER SUBMITS
   └─ Click "Create Task" button
        ↓
7. FORM VALIDATION
   ├─ Check: Title not empty
   ├─ Check: Valid assignee (if set)
   └─ If invalid: Show error message and return
        ↓
8. THUNK DISPATCH
   └─ dispatch(createTask({
        projectId,
        title,
        description,
        columnId,
        priority,
        assigneeId,
        dueDate
      }))
        ↓
9. THUNK EXECUTION (Pending)
   ├─ taskSlice.ui.isCreating = true
   └─ taskSlice.error = null
        ↓
10. API CALL
    └─ POST /api/v1/projects/proj-123/tasks
       {
         "title": "Fix bug in login",
         "description": "...",
         "priority": "high",
         "assigneeId": "user-456",
         "columnId": "col-1",
         "dueDate": "2024-03-20"
       }
        ↓
11a. SUCCESS RESPONSE (200)
    {
      "id": "task-789",
      "title": "Fix bug in login",
      "status": "todo",
      "priority": "high",
      "assigneeId": "user-456",
      "columnId": "col-1",
      "createdAt": "2024-03-11T10:30:00Z",
      ...
    }
        ↓
12a. THUNK FULFILLED
     ├─ taskSlice.tasks.byId['task-789'] = {...}
     ├─ boardSlice.columns['col-1'].taskIds.push('task-789')
     ├─ taskSlice.ui.isCreating = false
     └─ taskSlice.error = null
        ↓
13a. SELECTOR RECOMPUTES
     └─ selectProjectTasks selector recomputes
          └─ Includes new task in results
        ↓
14a. COMPONENTS RE-RENDER
     ├─ <Column> re-renders
     ├─ <TaskCard> for new task renders
     └─ <Modal> closes
        ↓
15a. UI UPDATED
     ├─ New task appears in column
     ├─ Toast: "Task created successfully"
     └─ User can interact with new task

11b. ERROR RESPONSE (400 or 500)
     {
       "code": "VALIDATION_ERROR",
       "message": "Title is required",
       "details": { "title": ["Required field"] }
     }
        ↓
12b. THUNK REJECTED
     ├─ taskSlice.ui.isCreating = false
     └─ taskSlice.error = {
          code: "VALIDATION_ERROR",
          message: "Title is required"
        }
        ↓
13b. SELECTOR RECOMPUTES
     └─ selectTaskError selector recomputes
        ↓
14b. COMPONENT RE-RENDERS
     └─ <CreateTaskModal> shows error message
        ↓
15b. ERROR DISPLAYED
     └─ User sees: "Title is required"
         └─ Can correct and retry

RESULT STATES:
───────────────
Success:
  ├─ Task visible in board
  ├─ Task count badge increases
  ├─ Can view/edit task immediately
  └─ Real-time update via WebSocket to other users

Failure:
  ├─ Modal stays open
  ├─ Error message displayed
  ├─ Form data preserved
  └─ User can fix and retry
```

---

## State Shape Diagram

```
Redux Store Tree
│
├─ auth (AuthState)
│  ├─ user
│  │  ├─ id: string
│  │  ├─ email: string
│  │  ├─ name: string
│  │  ├─ avatar: string
│  │  └─ createdAt: timestamp
│  ├─ token: string | null
│  ├─ refreshToken: string | null
│  ├─ isAuthenticated: boolean
│  ├─ isLoading: boolean
│  └─ error: string | null
│
├─ organization (OrganizationState)
│  ├─ currentOrganization: Organization | null
│  ├─ organizations: Organization[]
│  ├─ members: OrgMember[]
│  ├─ membersLoading: boolean
│  ├─ invitations: Invitation[]
│  ├─ isLoading: boolean
│  └─ error: string | null
│
├─ project (ProjectState)
│  ├─ currentProject: Project | null
│  ├─ projects: {
│  │  byId: { [id]: Project },
│  │  allIds: string[]
│  │}
│  ├─ projectMembers: ProjectMember[]
│  ├─ columns: TaskColumn[]
│  ├─ isLoading: boolean
│  └─ error: string | null
│
├─ board (BoardState)
│  ├─ projectId: string
│  ├─ columns: {
│  │  byId: { [id]: Column },
│  │  allIds: string[]
│  │}
│  ├─ tasks: {
│  │  byId: { [id]: Task },
│  │  allIds: string[]
│  │}
│  ├─ tasksByColumn: {
│  │  [columnId]: string[]  // taskIds
│  │}
│  ├─ filters: {
│  │  status: string[]
│  │  priority: string[]
│  │  assignee: string[]
│  │  search: string
│  │}
│  ├─ sort: {
│  │  field: string
│  │  order: 'asc' | 'desc'
│  │}
│  ├─ dragState: {
│  │  isDragging: boolean
│  │  draggedTaskId: string | null
│  │  sourceColumnId: string | null
│  │}
│  ├─ isLoading: boolean
│  └─ error: string | null
│
├─ task (TaskState)
│  ├─ currentTask: Task | null
│  ├─ tasks: {
│  │  byId: { [id]: Task },
│  │  allIds: string[]
│  │}
│  ├─ comments: {
│  │  byTaskId: {
│  │    [taskId]: Comment[]
│  │  }
│  │}
│  ├─ isLoading: boolean
│  ├─ isCreating: boolean
│  ├─ isUpdating: boolean
│  └─ error: string | null
│
├─ ui (UIState)
│  ├─ theme: 'light' | 'dark' | 'system'
│  ├─ sidebarOpen: boolean
│  ├─ sidebarCollapsed: boolean
│  ├─ modals: {
│  │  taskDetails: boolean
│  │  createTask: boolean
│  │  inviteMembers: boolean
│  │  settings: boolean
│  │}
│  ├─ drawers: {
│  │  taskDrawer: {
│  │    isOpen: boolean
│  │    taskId: string | null
│  │  }
│  │}
│  ├─ notifications: Notification[]
│  ├─ toasts: Toast[]
│  └─ loading: {
│     global: boolean
│     [key: string]: boolean
│  }
│
├─ search (SearchState)
│  ├─ query: string
│  ├─ results: {
│  │  tasks: Task[]
│  │  projects: Project[]
│  │  users: User[]
│  │}
│  ├─ isLoading: boolean
│  ├─ error: string | null
│  └─ recentSearches: string[]
│
└─ notification (NotificationState)
   ├─ items: Notification[]
   ├─ unreadCount: number
   ├─ isLoading: boolean
   └─ preferences: NotificationPreferences

Legend:
✓ = Required field
○ = Optional field
```

---

## API Communication Flow

```
FRONTEND                           BACKEND
   │                                  │
   │ 1. User Action                   │
   ├─────────────────────────────────>│
   │    POST /api/v1/auth/login       │
   │    { email, password }           │
   │                                  │
   │                                  │ 2. Validate
   │                                  ├─ Check credentials
   │                                  ├─ Generate tokens
   │                                  └─ Log activity
   │                                  │
   │ 3. Response                      │
   │<─────────────────────────────────┤
   │    200 OK                        │
   │    {                             │
   │      accessToken: "...",         │
   │      refreshToken: "...",        │
   │      user: {...},                │
   │      expiresIn: 3600             │
   │    }                             │
   │                                  │
   │ 4. Store token                   │
   ├─ localStorage                    │
   ├─ Update Redux state              │
   └─ Set auth header                 │
   │                                  │
   │ 5. Fetch protected resource      │
   ├─────────────────────────────────>│
   │    GET /api/v1/projects          │
   │    Header: Authorization: Bearer │
   │                                  │
   │                                  │ 6. Verify token
   │                                  ├─ Check signature
   │                                  ├─ Check expiration
   │                                  └─ Check permissions
   │                                  │
   │                                  │ 7. Fetch & process
   │                                  ├─ Query database
   │                                  ├─ Apply filters
   │                                  └─ Serialize response
   │                                  │
   │ 8. Response                      │
   │<─────────────────────────────────┤
   │    200 OK                        │
   │    { projects: [...] }           │
   │                                  │
   │ 9. Update Redux                  │
   ├─ Dispatch thunk.fulfilled        │
   ├─ Update selector values          │
   └─ Components re-render            │
   │                                  │
   │ 10. Later: Token expires         │
   │     (in ~1 hour)                 │
   │                                  │
   │ 11. Next request with expired    │
   ├─────────────────────────────────>│
   │    GET /api/v1/projects          │
   │    Header: Authorization: Bearer │
   │         (expired token)          │
   │                                  │
   │                                  │ 12. Detect expiration
   │                                  ├─ Return 401
   │                                  │ Unauthorized
   │                                  │
   │ 13. Interceptor catches 401      │
   ├─ Call refresh endpoint           │
   │                                  │
   │ 14. Refresh request              │
   ├─────────────────────────────────>│
   │    POST /api/v1/auth/refresh     │
   │    { refreshToken: "..." }       │
   │                                  │
   │                                  │ 15. Validate refresh
   │                                  ├─ Check signature
   │                                  └─ Generate new access token
   │                                  │
   │ 16. New token response           │
   │<─────────────────────────────────┤
   │    200 OK                        │
   │    { accessToken: "..." }        │
   │                                  │
   │ 17. Update Redux with new token  │
   ├─ Store in localStorage           │
   ├─ Retry original request          │
   │                                  │
   │ 18. Retry with new token         │
   ├─────────────────────────────────>│
   │    GET /api/v1/projects          │
   │    Header: Authorization: Bearer │
   │         (new token)              │
   │                                  │
   │                                  │ 19. Token valid
   │                                  └─ Proceed normally
   │                                  │
   │ 20. Response                     │
   │<─────────────────────────────────┤
   │    200 OK                        │
   │    { projects: [...] }           │
   │                                  │
   │ 21. Success path continues       │
   └─> Update Redux, re-render UI    │
                                      │
```

---

## WebSocket Real-time Flow

```
Connection Lifecycle
───────────────────

FRONTEND                           BACKEND (WebSocket Server)
   │                                  │
   │ 1. User logs in                  │
   ├─ Trigger: App init + auth token  │
   │                                  │
   │ 2. WebSocket Connect             │
   ├─────────────────────────────────>│
   │    wss://api.example.com/ws      │
   │    ?token=accessToken            │
   │                                  │
   │                                  │ 3. Verify token
   │                                  ├─ Validate JWT
   │                                  ├─ Get user ID
   │                                  └─ Create connection
   │                                  │
   │ 4. Connection opened             │
   │<─────────────────────────────────┤
   │    {                             │
   │      "type": "connected",        │
   │      "userId": "user-123"        │
   │    }                             │
   │                                  │
   │ 5. Subscribe to channels         │
   ├─────────────────────────────────>│
   │    {                             │
   │      "type": "subscribe",        │
   │      "channels": [               │
   │        "/organizations/org-1",   │
   │        "/projects/proj-1",       │
   │        "/user/user-123/notif"    │
   │      ]                           │
   │    }                             │
   │                                  │
   │                                  │ 6. Add subscriptions
   │                                  ├─ Track user subscriptions
   │                                  └─ Add to channel groups
   │                                  │
   │ 7. Event happens (user A)        │
   │    (Different user on backend)   │
   │                                  │
   │    User A: POST /api/tasks       │
   │             Create new task      │
   │                                  │
   │                                  │ 8. Database update
   │                                  └─ Task saved
   │                                  │
   │                                  │ 9. Broadcast event
   │                                  ├─ Find subscribers to
   │                                  │  /projects/proj-1
   │                                  ├─ Send WebSocket message
   │                                  │  to all connected clients
   │                                  │  (including FRONTEND)
   │                                  │
   │ 10. Receive broadcast            │
   │<─────────────────────────────────┤
   │    {                             │
   │      "type": "message",          │
   │      "channel": "/projects/1",   │
   │      "event": "task.created",    │
   │      "data": {                   │
   │        "taskId": "task-789",     │
   │        "title": "New task",      │
   │        "by": "user-456"          │
   │      }                           │
   │    }                             │
   │                                  │
   │ 11. Message handler executes     │
   ├─ Parse message                   │
   ├─ Dispatch Redux action           │
   ├─ Update board state              │
   └─ Components re-render            │
   │                                  │
   │ 12. Heartbeat (every 30s)        │
   ├─────────────────────────────────>│
   │    { "type": "ping" }            │
   │                                  │
   │ 13. Server responds              │
   │<─────────────────────────────────┤
   │    { "type": "pong" }            │
   │                                  │
   │ 14. User navigates away / logout │
   │                                  │
   │ 15. Unsubscribe                  │
   ├─────────────────────────────────>│
   │    {                             │
   │      "type": "unsubscribe",      │
   │      "channels": [...]           │
   │    }                             │
   │                                  │
   │ 16. Close connection             │
   ├─────────────────────────────────>│
   │    Close WebSocket               │
   │                                  │
   │                                  │ 17. Cleanup
   │                                  ├─ Remove subscriptions
   │                                  └─ Clean up connection
   │                                  │
   │ Connection closed                │

Error Handling
──────────────

Scenario: Network disconnection
──────────────────────────────

FRONTEND                           BACKEND
   │                                  │
   ├─ WebSocket connected            │
   ├─ Subscribing to channels        │
   │                                  │
   ├─ [Network interruption]         │
   │                                  │
   ├─ Connection timeout (30s)       │
   ├─ Trigger reconnection logic     │
   │                                  │
   ├─ Exponential backoff:           │
   │  Attempt 1: wait 1s             │
   │  Attempt 2: wait 2s             │
   │  Attempt 3: wait 4s             │
   │  Attempt 4: wait 8s             │
   │  Max wait: 60s                  │
   │                                  │
   ├─ Reconnect wss://...           →│ Accept connection
   ├─ Resubscribe to channels       →│ Add subscriptions
   ├─ Fetch missed updates          ├─ Resume service
   │  (poll API for delta)           │
   │                                  │
   ├─ Sync state                    │
   ├─ Continue operations            │
   │
```

---

## Component Lifecycle: Task Creation to Display

```
Timeline of Task Creation & Display
────────────────────────────────────

Time │ Action                          │ Redux State           │ UI
─────┼─────────────────────────────────┼──────────────────────┼──────────────────
  0  │ User clicks "Add" button        │ (no change)          │ Modal opens
     │                                  │                      │
  1  │ User fills form                 │ formData in component │ Form visible
     │ (local component state)         │ (not Redux)          │ with inputs
     │                                  │                      │
  2  │ User clicks "Create"            │ isCreating: true    │ Button disabled
     │ dispatch(createTask(...))       │ error: null         │ Shows "Creating..."
     │                                  │                      │
  3  │ API request sent                │ (pending state)      │ Loading state
     │ POST /api/v1/projects/.../     │                      │
     │ tasks                           │                      │
     │                                  │                      │
  4  │ [Network latency ~200ms]        │ (no change)          │ Still loading
     │                                  │                      │
  5  │ API responds: 201 Created       │ [Thunk payload]      │ (re-render pending)
     │ { id, title, ... }              │                      │
     │                                  │                      │
  6  │ Thunk fulfilled reducer called  │ isCreating: false   │ (re-render)
     │ - Add task to tasks.byId        │ tasks: {...+new}    │
     │ - Add taskId to column          │ columns: {...updated}│
     │ - Clear error                   │ error: null         │
     │                                  │                      │
  7  │ Selector recomputes:            │ (state unchanged)    │
     │ selectProjectTasks              │                      │
     │ selectTasksByColumn             │                      │
     │                                  │                      │
  8  │ Components detect change        │ (through useSelector)│
     │ - <Column> re-renders           │                      │ New TaskCard
     │ - <TaskCard> renders            │                      │ appears in
     │ - <Modal> closes                │                      │ column
     │                                  │                      │
  9  │ WebSocket broadcasts event to   │ (thunk triggered     │ Other users see
     │ other users in project          │ if subscribed)       │ task appear
     │                                  │                      │
 10  │ Success toast shown             │ notifications: [{...}]│ "Task created"
     │ Toast auto-dismisses after 3s   │                      │ toast shows
     │                                  │                      │
 11  │ User can interact with new task │ (normal state)       │ All features
     │ - Click to open drawer          │                      │ available
     │ - Drag to other column          │                      │
     │ - Assign etc                    │                      │
```

