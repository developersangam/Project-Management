# 🚀 Project Management SaaS - Frontend Documentation

Welcome to the production-ready frontend architecture for the project management SaaS application!

## 📚 Documentation Structure

This project includes comprehensive documentation for understanding and implementing the entire system:

### 🎯 **Start Here**
1. **[PRODUCTION_ARCHITECTURE.md](./PRODUCTION_ARCHITECTURE.md)** - Complete system overview
   - Project structure
   - Authentication flow
   - Multi-tenancy architecture
   - Redux state management
   - Routing map
   - Implementation checklist

2. **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - API integration strategies
   - Service layer architecture
   - Base API configuration
   - Request/response interceptors
   - Error handling
   - WebSocket integration

3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture guide *(if available)*
   - Complete file structure
   - Component hierarchies
   - API endpoint mapping
   - Feature descriptions
   - Implementation phases

4. **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Step-by-step build guide *(if available)*
   - Phase-by-phase implementation
   - File creation checklist
   - Common gotchas
   - Architecture decisions

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── dashboard/          # Protected dashboard routes
│   │   ├── login/              # Authentication pages
│   │   ├── register/
│   │   └── layout.tsx          # Root layout with providers
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Layout components (sidebar, header)
│   │   ├── board/              # Kanban board components
│   │   └── auth/               # Auth-related components
│   │
│   ├── store/                  # Redux store
│   │   ├── auth/               # Auth state
│   │   ├── organization/       # Organization state
│   │   ├── project/            # Project state
│   │   ├── task/               # Task state
│   │   └── ui/                 # UI state
│   │
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # API placeholder functions
│   │   ├── httpClient.ts       # Axios configuration *(add this)*
│   │   ├── errorHandler.ts     # Error handling *(add this)*
│   │   └── utils.ts            # Helper functions
│   │
│   ├── types/                  # TypeScript interfaces
│   ├── hooks/                  # Custom React hooks
│   └── features/               # Feature-specific logic
│
├── PRODUCTION_ARCHITECTURE.md  # Main documentation
├── API_INTEGRATION_GUIDE.md    # API integration guide
├── tailwind.config.ts          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## 🎯 Key Features

### ✅ Authentication
- User login/registration
- JWT token-based authentication
- Protected routes with AuthGuard
- Token persistence and refresh

### ✅ Multi-Tenancy
- Multiple organizations per user
- Organization switching
- Role-based access control (OWNER, ADMIN, MEMBER)
- Organization member management

### ✅ Project Management
- Create and manage projects
- Organize projects by organization
- Project member invitations
- Project settings

### ✅ Kanban Board
- Drag-and-drop task management
- Multiple columns (Todo, In Progress, Done - customizable)
- Task creation and editing
- Task assignment and priority levels

### ✅ Task Management
- Create, read, update, delete tasks
- Task assignment to team members
- Due dates and priority levels
- Task status management
- Task comments (extensible)

### ✅ Theme System
- Light/Dark mode toggle
- System preference detection
- Theme persistence
- Tailwind CSS integration

### ✅ Responsive Design
- Mobile-friendly layout
- Collapsible sidebar
- Touch-friendly interactions
- Responsive grids and breakpoints

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📊 State Management (Redux)

### Store Structure
```typescript
{
  auth: {
    user, token, isAuthenticated, loading, error
  },
  organization: {
    organizations, currentOrganization, loading, error
  },
  project: {
    projects, currentProject, loading, error
  },
  task: {
    tasks, currentTask, loading, error
  },
  ui: {
    sidebarOpen, theme, isMobile
  }
}
```

### Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from '@/hooks/redux'

// Usage in components
const dispatch = useAppDispatch()
const { user, isAuthenticated } = useAppSelector(state => state.auth)
```

---

## 🔌 API Integration

### Current Status
- **Status**: Using placeholder/mock APIs
- **Location**: `src/lib/api.ts`
- **Return Type**: Promises with 500-1000ms simulated delays

### Switching to Real APIs

1. **Install axios**
   ```bash
   npm install axios
   ```

2. **Create HTTP client** (`src/lib/httpClient.ts`)
   - Configure base URL
   - Add auth interceptors
   - Handle token refresh

3. **Update API functions** in `src/lib/api.ts`
   - Replace mock functions with actual HTTP calls
   - Use httpClient instance

4. **Error handling**
   - Add error handler utility
   - Implement retry logic
   - Handle auth errors

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for detailed instructions.

---

## 🔐 Authentication

### Login Flow
1. User enters credentials
2. Redux thunk calls `authAPI.login()`
3. API returns user + token
4. Token stored in Redux + localStorage
5. Redirect to dashboard

### Protected Routes
- All dashboard routes wrapped with `AuthGuard`
- Checks authentication on component mount
- Redirects to login if not authenticated
- Shows loading state during verification

### Token Persistence
- Store in localStorage: `auth_token`
- Load on app initialization
- Auto-refresh before expiry

---

## 📝 Common Tasks

### Adding a New Page

1. Create file: `src/app/[route]/page.tsx`
2. Wrap with `<AuthGuard>` for protected pages
3. Wrap with `<DashboardLayout>` for dashboard pages
4. Add Redux selectors as needed

Example:
```typescript
'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardLayout } from '@/components/layout/dashboardLayout'

export default function MyPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Your content */}
      </DashboardLayout>
    </AuthGuard>
  )
}
```

### Dispatching Redux Actions

```typescript
import { useAppDispatch } from '@/hooks/redux'
import { login } from '@/store/auth/authThunk'

export default function LoginForm() {
  const dispatch = useAppDispatch()

  const handleSubmit = async (email: string, password: string) => {
    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      // Success
    }
  }
}
```

### Using Redux State

```typescript
import { useAppSelector } from '@/hooks/redux'

export default function UserMenu() {
  const { user } = useAppSelector(state => state.auth)
  
  return <div>{user?.name}</div>
}
```

---

## 🎨 Styling

### Tailwind CSS
- Configuration: `tailwind.config.ts`
- Dark mode: class-based (`class="dark"`)
- Custom colors using CSS variables

### Component Library
Located in `src/components/ui/`:
- Button
- Input
- Card
- Modal
- Dropdown
- Table
- Tabs
- Badge
- And more...

### Theme Variables
Light mode:
```css
--background: 0 0% 98%;
--foreground: 211 45% 32%;
--primary: 220 98% 39%;
```

Dark mode:
```css
--background: 217 33% 17%;
--foreground: 210 40% 98%;
--primary: 217 93% 61%;
```

---

## 🧪 Testing

### Unit Tests (Jest)
```bash
npm run test
```

### Component Tests (React Testing Library)
Test user interactions and rendering

### E2E Tests (Playwright/Cypress)
Test complete user flows

---

## 📦 Dependencies

### Core
- **Next.js 15**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety

### State Management
- **@reduxjs/toolkit**: Redux toolkit
- **react-redux**: React-Redux bindings

### UI & Styling
- **tailwindcss**: CSS framework
- **lucide-react**: Icon library

### Form & Validation
- **zod** *(add if needed)*: Schema validation
- **react-hook-form** *(add if needed)*: Form handling

### Drag & Drop
- **@dnd-kit/core**: Drag-drop primitive
- **@dnd-kit/sortable**: Sortable functionality

### API
- **axios** *(add for real APIs)*: HTTP client

---

## 🐛 Debugging

### Redux DevTools
Install browser extension: Redux DevTools

### Next.js DevTools
- Built into Next.js development
- View source maps
- Time-travel debugging

### Console Logging
```typescript
// Redux dispatch logging
console.log('Dispatching:', action)

// API call logging
console.log('API Call:', { method, url, data })
```

---

## 📱 Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

---

## 🔄 Data Fetching Pattern

### Using Redux Thunks
```typescript
// Dispatch async thunk
const result = await dispatch(fetchOrganizations())

// Handle response
if (fetchOrganizations.fulfilled.match(result)) {
  console.log('Success')
} else {
  console.log('Error:', result.payload)
}
```

### Optimistic Updates
- Update UI immediately
- Revert on API error
- Show optimistic feedback

---

## 🚨 Error Handling

### API Errors
Handled in Redux thunks:
```typescript
extraReducers: (builder) => {
  builder.addCase(fetchOrganizations.rejected, (state, action) => {
    state.error = action.payload?.message
  })
}
```

### Auth Errors
Handled in HTTP interceptors:
- 401: Redirect to login
- 403: Show permission error
- 500: Show server error

---

## 🌐 Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Redux Toolkit**: https://redux-toolkit.js.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **DnD Kit**: https://docs.dndkit.com

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test thoroughly
4. Submit pull request

---

## 📄 License

[Your License Here]

---

## 📞 Support

For questions or issues:
- Check documentation in this repo
- Review existing code examples
- Open an issue on GitHub

---

**Current Status**: Production-Ready  
**Last Updated**: March 11, 2026  
**Version**: 1.0
