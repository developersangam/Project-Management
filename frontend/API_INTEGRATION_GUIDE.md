# API Integration & Service Layer Guide

## API Service Layer Architecture

```
services/
├── api.ts                    # Axios instance + interceptors
├── auth.service.ts           # Authentication endpoints
├── organization.service.ts   # Organization endpoints
├── project.service.ts        # Project endpoints
├── task.service.ts           # Task endpoints
├── column.service.ts         # Board column endpoints
├── search.service.ts         # Search endpoints
├── notification.service.ts   # Notifications endpoints
├── upload.service.ts         # File upload handling
├── ws.service.ts             # WebSocket service
└── constants.ts              # URLs, timeouts, etc.
```

---

## Base API Configuration

```typescript
// File: src/services/api.ts

Key Elements:
├─ Axios instance creation
│  ├─ Base URL from environment
│  ├─ Default headers
│  ├─ Timeout configuration (e.g., 30s)
│  └─ Default error handling
│
├─ Request interceptors
│  ├─ Add authentication token to headers
│  ├─ Add content-type headers
│  ├─ Add request ID for tracking
│  ├─ Transform request payload (optional)
│  └─ Log requests in development
│
├─ Response interceptors
│  ├─ Parse response data
│  ├─ Handle HTTP error codes
│  ├─ Refresh token on 401
│  ├─ Format error responses
│  └─ Log responses in development
│
└─ Error handling
   ├─ Network errors
   ├─ Timeout errors
   ├─ HTTP status errors (4xx, 5xx)
   └─ Unknown errors fallback
```

**Interceptor Pattern:**
```typescript
// Request interceptor adds auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor handles refresh token
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        const newToken = await refreshToken();
        localStorage.setItem('accessToken', newToken);
        // Retry original request
        return api(error.config);
      } catch {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Service Pattern

### Each service follows this structure:

```typescript
// File: src/services/[domain].service.ts

Pattern:
├─ Import types from types/[domain].types.ts
├─ Import api instance
├─ Define endpoint constants
├─ Export service class/object with methods
├─ Each method:
│  ├─ One responsibility (CRUD or action)
│  ├─ Proper TypeScript types
│  ├─ Error transformation
│  ├─ Request/response logging (dev only)
│  └─ Optional: request cancellation support
└─ Example method:
   ├─ Receives typed parameters
   ├─ Makes API call
   ├─ Transforms response
   ├─ Thrown typed error
   └─ Returns typed result
```

---

## Complete Endpoint Mapping

### 1. AUTHENTICATION ENDPOINTS

```typescript
// File: src/services/auth.service.ts
// Base: /api/v1/auth

Endpoints:
├─ POST /login
│  ├─ Input: { email, password }
│  ├─ Output: { accessToken, refreshToken, user, expiresIn }
│  ├─ Error codes: INVALID_CREDENTIALS, TOO_MANY_ATTEMPTS
│  └─ Thunk: loginUser
│
├─ POST /register
│  ├─ Input: { email, password, username, name }
│  ├─ Output: { user, accessToken, refreshToken }
│  ├─ Validation: Email format, password strength, username uniqueness
│  └─ Thunk: registerUser
│
├─ POST /logout
│  ├─ Input: { refreshToken }
│  ├─ Output: { success: true }
│  └─ Thunk: logoutUser
│
├─ POST /refresh
│  ├─ Input: { refreshToken }
│  ├─ Output: { accessToken, expiresIn }
│  ├─ Used by: Response interceptor for token refresh
│  └─ Automatic retry logic
│
├─ GET /me
│  ├─ Input: (requires authorization header)
│  ├─ Output: Current user object
│  ├─ Cache: Store in Redux
│  ├─ Refresh: On app init
│  └─ Thunk: getCurrentUser
│
├─ POST /verify
│  ├─ Input: { token }
│  ├─ Output: { valid, expiresAt }
│  └─ Used for: Token validation before action
│
├─ POST /verify-2fa
│  ├─ Input: { email, code }
│  ├─ Output: { accessToken, refreshToken }
│  └─ Thunk: verify2FA
│
├─ POST /password-reset
│  ├─ Input: { email }
│  ├─ Output: { success, message }
│  ├─ Rate limit: 3 per hour
│  └─ Thunk: requestPasswordReset
│
├─ POST /password-reset/confirm
│  ├─ Input: { token, newPassword }
│  ├─ Output: { success }
│  └─ Thunk: resetPassword
│
└─ POST /oauth/[provider]/callback
   ├─ Input: { code, state }
   ├─ Providers: google, github, microsoft
   └─ Output: Same as login response
```

---

### 2. ORGANIZATION ENDPOINTS

```typescript
// File: src/services/organization.service.ts
// Base: /api/v1/organizations

Core CRUD:
├─ GET /
│  ├─ Query params: page, pageSize, sort, search
│  ├─ Output: { items: Organization[], pagination }
│  ├─ Cached: Yes (invalidated on update/create)
│  └─ Thunk: fetchOrganizations
│
├─ GET /:id
│  ├─ Output: Organization with stats
│  ├─ Includes: memberCount, projectCount
│  └─ Thunk: fetchOrganizationById
│
├─ POST /
│  ├─ Input: { name, description, logo, settings }
│  ├─ Output: Organization
│  ├─ Auth: Required
│  ├─ Creates user as owner
│  └─ Thunk: createOrganization
│
├─ PUT /:id
│  ├─ Input: { name, description, logo, settings }
│  ├─ Output: Organization
│  ├─ Auth: Owner or Admin
│  ├─ Invalidates: Cache for this org
│  └─ Thunk: updateOrganization
│
├─ DELETE /:id
│  ├─ Auth: Owner only
│  ├─ Side effect: Delete all projects, tasks
│  ├─ Side effect: Notify members
│  ├─ Confirmation: Require org name
│  └─ Thunk: deleteOrganization
│
└─ PATCH /:id/settings
   ├─ Input: Settings subset
   ├─ Output: Organization with new settings
   ├─ Auth: Owner or Admin
   └─ Thunk: updateOrganizationSettings

Member Management:
├─ GET /:id/members
│  ├─ Output: { members: OrgMember[], total }
│  ├─ Pagination: Yes
│  └─ Thunk: fetchOrganizationMembers
│
├─ POST /:id/members
│  ├─ Input: { userIds: string[] }
│  ├─ Output: { added: OrgMember[], errors }
│  ├─ Auth: Admin or Owner
│  ├─ Default role: Member
│  ├─ Emit: WebSocket event for new members
│  └─ Thunk: addOrganizationMembers
│
├─ PUT /:id/members/:memberId/role
│  ├─ Input: { role: 'owner' | 'admin' | 'member' | 'guest' }
│  ├─ Output: OrgMember
│  ├─ Auth: Owner only (for role escalation)
│  ├─ Auth: Admin (for downgrade)
│  ├─ Validation: Must have >1 owner
│  └─ Thunk: updateOrgMemberRole
│
├─ DELETE /:id/members/:memberId
│  ├─ Auth: Member can leave, Admin can remove
│  ├─ Emit: WebSocket event
│  ├─ Special: Owner cannot be removed, must transfer first
│  └─ Thunk: removeOrganizationMember
│
└─ POST /:id/members/bulk-invite
   ├─ Input: { emails: string[], roleId: string }
   ├─ Output: { invited, existing, invalid }
   ├─ Email: Send invitations
   ├─ Auth: Admin or Owner
   └─ Thunk: bulkInviteMembers

Invitations:
├─ POST /:id/invitations
│  ├─ Input: { email, role }
│  ├─ Output: Invitation
│  ├─ Email: Send invitation link
│  └─ Thunk: inviteOrganizationMember
│
├─ GET /invitations/:token
│  ├─ Output: Invitation details
│  ├─ Validation: Check expiration (7 days)
│  ├─ Public: No auth required
│  └─ Used by: Accept/reject pages
│
├─ POST /invitations/:token/accept
│  ├─ Output: Organization
│  ├─ Side effect: Add user to org
│  ├─ Side effect: Delete invitation
│  └─ Redirect: To org dashboard
│
├─ POST /invitations/:token/reject
│  ├─ Side effect: Delete invitation
│  └─ Redirect: To home/login
│
└─ GET /invitations/pending
   ├─ Output: Pending invitations for user
   └─ Used by: Invitation notifications
```

---

### 3. PROJECT ENDPOINTS

```typescript
// File: src/services/project.service.ts
// Base: /api/v1/projects or /api/v1/organizations/:orgId/projects

Core CRUD:
├─ GET /organizations/:orgId/projects
│  ├─ Query: page, pageSize, sort, filter
│  ├─ Output: { projects: Project[], pagination, stats }
│  ├─ Stats: totalProjects, activeProjects, archivedProjects
│  └─ Thunk: fetchProjectsByOrganization
│
├─ GET /projects/:id
│  ├─ Output: Project with metadata
│  ├─ Includes: members, members count, board columns
│  │           task counts by status, recent activity
│  └─ Thunk: fetchProjectById
│
├─ POST /organizations/:orgId/projects
│  ├─ Input: {
│  │   name, description, key (unique prefix),
│  │   visibility ('private' | 'internal' | 'public'),
│  │   templateId (optional), settings
│  │ }
│  ├─ Output: Project
│  ├─ Default: Creates default columns (todo, in-progress, done)
│  ├─ Creator: Made owner/lead
│  ├─ Emit: WebSocket event to org members
│  └─ Thunk: createProject
│
├─ PUT /projects/:id
│  ├─ Input: { name, description, key, visibility, settings }
│  ├─ Output: Project
│  ├─ Auth: Owner or Admin
│  ├─ Invalidates: Cache
│  ├─ Emit: WebSocket event
│  └─ Thunk: updateProject
│
├─ DELETE /projects/:id
│  ├─ Auth: Owner only
│  ├─ Side effects: Archive (configurable as soft delete)
│  ├─ Alternative: Permanently delete (confirmation required)
│  ├─ Email: Notify members
│  └─ Thunk: deleteProject
│
└─ PATCH /projects/:id/archive
   ├─ Input: { archived: boolean }
   ├─ Output: Project
   └─ Soft delete for recovery

Member Management:
├─ GET /projects/:id/members
│  ├─ Output: { members: ProjectMember[], total }
│  ├─ Includes role, joinedAt, lastActivity
│  └─ Thunk: fetchProjectMembers
│
├─ POST /projects/:id/members
│  ├─ Input: { userIds: string[] }
│  ├─ Output: { added: ProjectMember[] }
│  ├─ Auth: Owner or Admin
│  ├─ Default role: Developer
│  ├─ Emit: WebSocket event
│  └─ Thunk: addProjectMembers
│
├─ PUT /projects/:id/members/:memberId/role
│  ├─ Input: { role: 'lead' | 'developer' | 'viewer' }
│  ├─ Output: ProjectMember
│  ├─ Auth: Admin or Lead
│  ├─ Emit: WebSocket event
│  └─ Thunk: updateProjectMemberRole
│
│
├─ DELETE /projects/:id/members/:memberId
│  ├─ Auth: Can leave own, or Admin to remove
│  ├─ Emit: WebSocket event
│  └─ Thunk: removeProjectMember
│
└─ POST /projects/:id/members/bulk-invite
   ├─ Input: { orgMemberIds: string[], role: string }
   ├─ Output: { invited: ProjectMember[] }
   ├─ Auth: Admin or Lead
   ├─ Emit: WebSocket event
   └─ Thunk: bulkInviteProjectMembers

Settings & Columns:
├─ GET /projects/:id/columns
│  ├─ Output: TaskColumn[]
│  ├─ Ordered by: position
│  ├─ Includes: taskCount in each column
│  └─ Thunk: fetchProjectColumns
│
├─ POST /projects/:id/columns
│  ├─ Input: { name, color }
│  ├─ Output: TaskColumn
│  ├─ Auth: Admin or Lead
│  ├─ Emit: WebSocket event (new column)
│  └─ Thunk: createProjectColumn
│
├─ PUT /projects/:id/columns/:columnId
│  ├─ Input: { name, color, position }
│  ├─ Output: TaskColumn
│  ├─ Auth: Admin or Lead
│  ├─ Emit: WebSocket event (column updated)
│  └─ Thunk: updateProjectColumn
│
├─ DELETE /projects/:id/columns/:columnId
│  ├─ Input: { moveTasksTo: columnId }
│  ├─ Auth: Admin or Lead
│  ├─ Validation: Cannot delete if tasks exist
│  ├─ Emit: WebSocket event (column deleted)
│  └─ Thunk: deleteProjectColumn
│
└─ PUT /projects/:id/columns/reorder
   ├─ Input: { columnIds: string[] }
   ├─ Output: TaskColumn[]
   ├─ Emit: WebSocket event (columns reordered)
   └─ Thunk: reorderProjectColumns

Project Settings:
├─ GET /projects/:id/settings
│  ├─ Output: ProjectSettings
│  ├─ Includes: Visibility, features, notifications
│  └─ Thunk: fetchProjectSettings
│
└─ PUT /projects/:id/settings
   ├─ Input: Partial ProjectSettings
   ├─ Output: ProjectSettings
   ├─ Auth: Admin or Owner
   ├─ Features: Enable/disable comments, subtasks, etc
   ├─ Emit: WebSocket event
   └─ Thunk: updateProjectSettings
```

---

### 4. TASK ENDPOINTS

```typescript
// File: src/services/task.service.ts
// Base: /api/v1/tasks or /api/v1/projects/:projectId/tasks

Core CRUD:
├─ GET /projects/:projectId/tasks
│  ├─ Query: page, pageSize, sort, filter, status, priority
│  ├─ Output: { tasks: Task[], pagination, stats }
│  ├─ Stats: totalTasks, byStatus, byPriority, byAssignee
│  ├─ Cached: Yes
│  └─ Thunk: fetchProjectTasks
│
├─ GET /tasks/:id
│  ├─ Output: Task with full details
│  ├─ Includes: Comments, subtasks, activity, attachments
│  ├─ Subscription: WebSocket for real-time updates
│  └─ Thunk: fetchTaskById
│
├─ POST /projects/:projectId/tasks
│  ├─ Input: {
│  │   title, description, columnId, priority,
│  │   assigneeId, dueDate, labels, estimatedPoints
│  │ }
│  ├─ Output: Task
│  ├─ Auto: Set creatorId, createdAt
│  ├─ Auto: Generate task number (e.g., PROJ-123)
│  ├─ Emit: WebSocket (task created)
│  └─ Thunk: createTask
│
├─ PUT /tasks/:id
│  ├─ Input: Partial Task (any field)
│  ├─ Output: Task
│  ├─ Auth: Creator, Assignee, or Admin
│  ├─ Track: Changes in activity log
│  ├─ Emit: WebSocket (task updated)
│  └─ Thunk: updateTask
│
├─ DELETE /tasks/:id
│  ├─ Auth: Creator or Admin (configurable)
│  ├─ Soft delete or hard (configurable)
│  ├─ Emit: WebSocket (task deleted)
│  └─ Thunk: deleteTask
│
└─ PATCH /tasks/:id/bulk-update
   ├─ Input: { updates: object }
   ├─ Used for: Bulk operations from CLI or API
   └─ Auth: Admin only

Task Status & Priority:
├─ PUT /tasks/:id/status
│  ├─ Input: { status: string | { columnId, position } }
│  ├─ Output: Task
│  ├─ Validation: Valid column for project
│  ├─ Emit: WebSocket (task moved)
│  └─ Thunk: moveTask
│
├─ PUT /tasks/:id/priority
│  ├─ Input: { priority: 'critical' | 'high' | 'medium' | 'low' }
│  ├─ Output: Task
│  ├─ Emit: WebSocket event
│  └─ Thunk: updateTaskPriority
│
└─ PUT /tasks/:id/due-date
   ├─ Input: { dueDate: ISO datetime | null }
   ├─ Output: Task
   ├─ Reminder: Set if dueDate is set
   └─ Thunk: setTaskDueDate

Assignments:
├─ PUT /tasks/:id/assignee
│  ├─ Input: { assigneeId }
│  ├─ Output: Task
│  ├─ Validation: User is project member
│  ├─ Email: Notify assignee
│  ├─ Emit: WebSocket event
│  └─ Thunk: assignTask
│
└─ DELETE /tasks/:id/assignee
   ├─ Output: Task with assignee cleared
   ├─ Emit: WebSocket event
   └─ Thunk: unassignTask

Labels & Tags:
├─ POST /tasks/:id/labels
│  ├─ Input: { labelIds: string[] }
│  ├─ Output: Task
│  ├─ Append: Add to existing labels
│  ├─ Emit: WebSocket event
│  └─ Thunk: addTaskLabels
│
├─ DELETE /tasks/:id/labels/:labelId
│  ├─ Output: Task
│  ├─ Emit: WebSocket event
│  └─ Thunk: removeTaskLabel
│
└─ PUT /tasks/:id/labels
   ├─ Input: { labelIds: string[] }
   ├─ Output: Task
   ├─ Replace: All labels
   ├─ Emit: WebSocket event
   └─ Thunk: updateTaskLabels

Subtasks:
├─ POST /tasks/:id/subtasks
│  ├─ Input: { title, description }
│  ├─ Output: Subtask
│  ├─ Emit: WebSocket event
│  └─ Thunk: createSubtask
│
├─ PUT /tasks/:id/subtasks/:subtaskId
│  ├─ Input: { title, description, completed }
│  ├─ Output: Subtask
│  ├─ Emit: WebSocket event
│  └─ Thunk: updateSubtask
│
├─ DELETE /tasks/:id/subtasks/:subtaskId
│  ├─ Emit: WebSocket event
│  └─ Thunk: deleteSubtask
│
└─ POST /tasks/:id/subtasks/reorder
   ├─ Input: { subtaskIds: string[] }
   ├─ Output: Subtask[]
   ├─ Emit: WebSocket event
   └─ Thunk: reorderSubtasks

Comments & Discussion:
├─ GET /tasks/:id/comments
│  ├─ Query: page, pageSize (pagination)
│  ├─ Output: { comments: Comment[], pagination }
│  ├─ Ordered: Most recent first
│  └─ Thunk: fetchTaskComments
│
├─ POST /tasks/:id/comments
│  ├─ Input: { content, mentions: string[] }
│  ├─ Output: Comment
│  ├─ Email: Notify mentioned users
│  ├─ Email: Notify watchers
│  ├─ Emit: WebSocket event (real-time)
│  └─ Thunk: addTaskComment
│
├─ PUT /tasks/:id/comments/:commentId
│  ├─ Input: { content, mentions }
│  ├─ Output: Comment
│  ├─ Auth: Comment author or Admin
│  ├─ Track: Edit history
│  ├─ Emit: WebSocket event
│  └─ Thunk: updateTaskComment
│
├─ DELETE /tasks/:id/comments/:commentId
│  ├─ Auth: Author or Admin
│  ├─ Soft delete: Keep for audit
│  ├─ Emit: WebSocket event
│  └─ Thunk: deleteTaskComment
│
├─ POST /tasks/:id/comments/:commentId/replies
│  ├─ Input: { content, mentions }
│  ├─ Output: Comment (reply)
│  ├─ Email: Thread participants
│  ├─ Emit: WebSocket event
│  └─ Thunk: addCommentReply
│
└─ PUT /tasks/:id/comments/:commentId/reactions
   ├─ Input: { emoji }
   ├─ Add/remove reaction on comment
   ├─ Emit: WebSocket event
   └─ Thunk: toggleCommentReaction

Attachments & Files:
├─ POST /tasks/:id/attachments
│  ├─ Input: FormData with file
│  ├─ Upload to: S3 or storage service
│  ├─ Output: Attachment metadata
│  ├─ Size limit: 25MB per file, 100MB per task
│  ├─ Virus scan: Yes
│  ├─ Emit: WebSocket event
│  └─ Thunk: uploadTaskAttachment
│
├─ GET /tasks/:id/attachments/:attachmentId
│  ├─ Download: File from storage
│  └─ Auth: Task watchers/members only
│
├─ DELETE /tasks/:id/attachments/:attachmentId
│  ├─ Auth: Creator or Admin
│  ├─ Delete: From storage
│  ├─ Emit: WebSocket event
│  └─ Thunk: deleteTaskAttachment
│
└─ GET /tasks/:id/attachments
   ├─ Output: Attachment[]
   └─ Used by: Attachments list component

Activity & Audit:
├─ GET /tasks/:id/activity
│  ├─ Output: ActivityLog[]
│  ├─ Includes: Changes, comments, assignments
│  ├─ Timeline: Chronological order
│  └─ Used by: Activity tab in drawer
│
└─ GET /tasks/:id/changes
   ├─ Query: field, startDate, endDate
   ├─ Output: FieldChange[]
   └─ Audit trail for specific fields
```

---

### 5. SEARCH ENDPOINTS

```typescript
// File: src/services/search.service.ts
// Base: /api/v1/search

Global Search:
├─ GET /search
│  ├─ Query: q (search term), scope (tasks|projects|team)
│  ├─ Output: {
│  │   tasks: Task[],
│  │   projects: Project[],
│  │   users: User[],
│  │   organizations: Organization[]
│  │ }
│  ├─ Filter by: User's accessible items
│  ├─ Limit: 10 results per category (for perf)
│  ├─ Cached: 5 minutes
│  └─ Thunk: globalSearch
│
├─ GET /search/tasks
│  ├─ Query: q, projectId, status, priority, assignee
│  ├─ Output: { tasks: Task[], pagination }
│  ├─ Filter by: Project + user access
│  └─ Thunk: searchTasks
│
├─ GET /search/projects
│  ├─ Query: q, orgId
│  ├─ Output: { projects: Project[], pagination }
│  ├─ Filter by: User is org member
│  └─ Thunk: searchProjects
│
├─ GET /search/users
│  ├─ Query: q, orgId (optional)
│  ├─ Output: User[]
│  ├─ Filter: Active users only
│  ├─ Limit: 20 results
│  └─ Thunk: searchUsers
│
└─ GET /search/suggestions
   ├─ Recent searches: For current user
   ├─ Trending: Across org
   ├─ Output: string[]
   └─ Limit: 10 items
```

---

### 6. NOTIFICATION ENDPOINTS

```typescript
// File: src/services/notification.service.ts
// Base: /api/v1/notifications

Fetching:
├─ GET /notifications
│  ├─ Query: page, pageSize, filter (read/unread)
│  ├─ Output: { notifications: Notification[], unreadCount }
│  ├─ Ordered: Most recent first
│  └─ Thunk: fetchNotifications
│
├─ GET /notifications/unread-count
│  ├─ Output: { unreadCount: number }
│  ├─ Used by: Badge on notification bell
│  └─ Poll: Every 30 seconds or use WebSocket
│
└─ GET /notifications/:id
   ├─ Output: Single notification
   └─ Used for: Loading details in modal

Actions:
├─ PUT /notifications/:id/read
│  ├─ Output: Notification (marked as read)
│  ├─ Thunk: markNotificationAsRead
│  └─ Batch: Multiple ids in single call
│
├─ PUT /notifications/read-all
│  ├─ Output: { success }
│  └─ Thunk: markAllNotificationsRead
│
├─ DELETE /notifications/:id
│  ├─ Output: { success }
│  ├─ Soft delete: Removed from user view
│  └─ Thunk: deleteNotification
│
└─ DELETE /notifications
   ├─ Query: filter (read, older than N days)
   ├─ Output: { deleted: number }
   └─ Bulk cleanup

Preferences:
├─ GET /notifications/preferences
│  ├─ Output: NotificationPreferences
│  ├─ Includes: Email frequency, in-app alerts
│  └─ Thunk: fetchNotificationPreferences
│
└─ PUT /notifications/preferences
   ├─ Input: Partial NotificationPreferences
   ├─ Output: NotificationPreferences
   └─ Thunk: updateNotificationPreferences

WebSocket Events:
├─ notification.created
│  ├─ Payload: Notification
│  └─ Action: Show toast, update badge
│
├─ notification.read
│  ├─ Payload: { notificationId }
│  └─ Action: Update in-memory list
│
└─ notification.deleted
   ├─ Payload: { notificationId }
   └─ Action: Remove from list
```

---

### 7. REAL-TIME UPDATES (WebSocket)

```typescript
// File: src/services/ws.service.ts

Connection Management:
├─ Connect on: App init (after auth)
├─ URL: wss://api.example.com/ws
├─ Auth: Include accessToken as query param
├─ Reconnect: Exponential backoff (1s, 2s, 4s, 8s, max 60s)
├─ Heartbeat: Send ping every 30s, server sends pong
├─ Disconnect on: Logout or permission change
└─ Handle: Connection lost, server restart

Channel Subscriptions:

Global Channels:
├─ /user/:userId/notifications
│  ├─ Events: notification.created, notification.read, notification.deleted
│  └─ Update: Notification list, bell badge
├─ /user/:userId/invitations
│  ├─ Events: invitation.created, invitation.accepted, invitation.rejected
│  └─ Update: Pending invitations
└─ /user/:userId/presence
   ├─ Event: user.online, user.offline
   └─ Update: Online status indicators

Organization Channels:
├─ /organizations/:orgId/members
│  ├─ Events: member.added, member.removed, member.role_changed
│  └─ Update: Members list, roles
├─ /organizations/:orgId/projects
│  ├─ Events: project.created, project.updated, project.deleted
│  └─ Update: Projects list
└─ /organizations/:orgId/activity
   ├─ Event: activity.created
   └─ Update: Activity feed

Project Channels:
├─ /projects/:projectId/board
│  ├─ Events: column.created, column.updated, column.deleted, column.reordered
│  ├─ Events: task.created, task.updated, task.deleted, task.moved
│  └─ Update: Kanban board in real-time
├─ /projects/:projectId/members
│  ├─ Events: member.added, member.removed, member.role_changed
│  └─ Update: Project members list
└─ /projects/:projectId/activity
   ├─ Event: activity.created
   └─ Update: Activity feed

Task Channels:
├─ /tasks/:taskId/updates
│  ├─ Events: task.updated, task.deleted, task.moved
│  └─ Update: Task details in drawer
├─ /tasks/:taskId/comments
│  ├─ Events: comment.created, comment.updated, comment.deleted
│  └─ Update: Comments list in real-time
└─ /tasks/:taskId/activity
   ├─ Event: activity.created
   └─ Update: Activity timeline

Message Format:
{
  "type": "message",
  "channel": "/projects/proj-123/board",
  "event": "task.moved",
  "data": {
    "taskId": "task-456",
    "fromColumnId": "col-1",
    "toColumnId": "col-2",
    "position": 3,
    "movedBy": { userId, name, avatar },
    "timestamp": "2024-03-11T10:30:00Z"
  }
}

Error Handling:
├─ Connection error: Retry with backoff
├─ Message parsing error: Log, don't crash
├─ Server closes: Reconnect
├─ Token expired: Refresh and reconnect
└─ Unauthorized: Redirect to login
```

---

## Error Response Format

```typescript
// Standard API error response
interface ApiErrorResponse {
  code: string;              // Machine-readable code
  message: string;           // User-friendly message
  details?: {
    [field: string]: string[]  // Field-specific errors
  };
  internalId?: string;       // For support debugging
  timestamp: string;         // ISO timestamp
  path: string;              // Request path
}

Examples:
├─ 400 Bad Request
│  └─ VALIDATION_ERROR: "Validation failed"
│     └─ details: { email: ["Invalid format"], password: ["Too short"] }
│
├─ 401 Unauthorized
│  ├─ INVALID_CREDENTIALS: "Email or password is incorrect"
│  ├─ TOKEN_EXPIRED: "Your session has expired"
│  └─ TOKEN_INVALID: "Invalid or malformed token"
│
├─ 403 Forbidden
│  ├─ INSUFFICIENT_PERMISSIONS: "You don't have permission for this action"
│  ├─ ORG_ACCESS_DENIED: "You are not a member of this organization"
│  └─ PROJECT_ACCESS_DENIED: "You don't have access to this project"
│
├─ 404 Not Found
│  └─ RESOURCE_NOT_FOUND: "Project not found"
│
├─ 409 Conflict
│  ├─ RESOURCE_ALREADY_EXISTS: "Email already registered"
│  └─ STATE_CONFLICT: "Task is locked for editing"
│
├─ 429 Too Many Requests
│  └─ RATE_LIMIT_EXCEEDED: "Too many requests. Try again later"
│
└─ 500 Internal Server Error
   └─ INTERNAL_ERROR: "An unexpected error occurred (ID: xxx)"
```

---

## Request Retry Strategy

```typescript
// Automatically retry on:
├─ Network errors (ECONNREFUSED, ENOTFOUND, etc.)
├─ 408 Request Timeout
├─ 429 Too Many Requests
├─ 500-599 Server Errors
└─ Exponential backoff: 1s, 2s, 4s (max retries: 3)

// Do NOT retry:
├─ 400-417 Client errors (except 408, 429)
├─ 401/403 Auth errors
├─ 404 Not found
└─ User cancellation

// Special cases:
├─ 401: Attempt token refresh, then retry once
├─ 429: Respect Retry-After header
└─ 5xx: Exponent backoff with jitter
```

---

## Request Cancellation

```typescript
// Cancel requests when:
├─ User navigates away (page unmount)
├─ User triggers new request (replace previous)
├─ Request timeout exceeded
└─ User explicitly cancels (close modal, etc)

// Axios CancelToken:
const source = axios.CancelToken.source();
api.get('/items', { cancelToken: source.token });
source.cancel('Request cancelled by user');

// In thunks:
export const fetchItems = createAsyncThunk(
  'items/fetch',
  async (payload, { signal }) => {
    // Signal already available from Redux
    return api.get('/items', { signal });
  }
);
```

---

## Caching Strategy

```typescript
// Cache levels:
├─ HTTP response caching (if backend provides Cache-Control)
├─ Redux state (managed by thunks)
├─ localStorage for user preferences
└─ Memory cache for recent searches

// Cache invalidation:
├─ On mutation: Immediately invalidate related queries
├─ On navigation: Keep cache (user may navigate back)
├─ Manual: Refresh button in UI
└─ Time-based: Re-fetch if older than X minutes

// Example invalidation:
dispatch(updateTask(payload)).then(() => {
  // Invalidate task list
  dispatch(fetchProjectTasks({ projectId }));
  // Invalidate board
  dispatch(fetchBoardData({ projectId }));
});
```

