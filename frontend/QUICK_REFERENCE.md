# Quick Reference Card - Frontend Architecture

Print this page or bookmark it for quick access during development.

---

## 📍 Quick Navigation

| Need | Document | Section |
|------|----------|---------|
| System overview | [ARCHITECTURE.md](ARCHITECTURE.md) | § 1-3 |
| Redux setup | [REDUX_GUIDE.md](REDUX_GUIDE.md) | § Store Configuration |
| API endpoints | [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) | § Complete Endpoint Mapping |
| Component structure | [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) | § Feature Component Hierarchies |
| Data flows | [VISUAL_DIAGRAMS.md](VISUAL_DIAGRAMS.md) | § Redux Data Flow Cycle |
| Implementation phases | [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) | § Phase breakdown |

---

## 🗂️ Directory Structure Cheat Sheet

```
src/
├── app/dashboard/                    # Protected routes
├── components/                       # UI components
│   ├── board/                        # Kanban board
│   ├── task/                         # Task management
│   ├── organization/                 # Org screens
│   ├── project/                      # Project screens
│   └── ui/                           # shadcn/ui
├── store/                            # Redux slices + thunks
│   ├── auth/, organization/, etc.
│   └── index.ts                      # Store config
├── services/                         # API calls
│   ├── api.ts                        # Axios config
│   ├── auth.service.ts, etc.
│   └── ws.service.ts                 # WebSocket
├── types/                            # TypeScript types
├── hooks/                            # Custom hooks
└── constants/                        # App constants
```

---

## 🔄 Redux Pattern Template

```typescript
// 1. Create types/feature.types.ts
interface FeatureState { ... }

// 2. Create store/feature/featureSlice.ts
const initialState: FeatureState = { ... }
const slice = createSlice({
  name: 'feature',
  initialState,
  reducers: { ... },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeature.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchFeature.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  }
});

// 3. Create store/feature/featureThunk.ts
export const fetchFeature = createAsyncThunk(
  'feature/fetch',
  async (params, { rejectWithValue }) => {
    try {
      return await featureService.fetch(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Use in component
const Component = () => {
  const data = useSelector(selectData);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchFeature());
  }, [dispatch]);
  
  return <div>{data}</div>;
};
```

---

## 🛣️ Routing Pattern

```typescript
// Page structure
src/app/dashboard/
├── layout.tsx                        # Dashboard wrapper
├── page.tsx                          # Dashboard home
├── organizations/
│   ├── page.tsx                      # List orgs
│   ├── create/page.tsx               # Create org
│   └── [orgSlug]/
│       ├── settings/page.tsx
│       ├── members/page.tsx
│       └── projects/
│           ├── page.tsx              # List projects
│           ├── create/page.tsx       # Create project
│           └── [projectSlug]/
│               ├── page.tsx          # Project overview
│               ├── board/page.tsx    # Kanban board
│               ├── list/page.tsx     # Table view
│               ├── tasks/
│               │   ├── create/page.tsx
│               │   └── [taskId]/page.tsx
│               └── settings/page.tsx

// Dynamic routes
[orgId] = organization ID (URL param)
[projectSlug] = project slug (URL param)
[taskId] = task ID (URL param)
```

---

## 📡 API Call Pattern

```typescript
// 1. Create service (services/feature.service.ts)
export const featureService = {
  fetch: (params) => 
    api.get('/features', { params }),
  
  create: (data) => 
    api.post('/features', data),
  
  update: (id, data) => 
    api.put(`/features/${id}`, data),
  
  delete: (id) => 
    api.delete(`/features/${id}`)
};

// 2. Use in thunk
export const fetchFeatures = createAsyncThunk(
  'features/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await featureService.fetch(params);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code
      });
    }
  }
);

// 3. Use in component
const { data, isLoading, error } = useAppState();
```

---

## 🎨 Component Pattern

```typescript
// Container (Smart) Component
export const FeatureContainer = ({ id }: Props) => {
  const feature = useSelector(selectFeatureById(id));
  const dispatch = useDispatch();
  
  const handle Action = (data) => {
    dispatch(updateFeature({ id, ...data }));
  };
  
  return <Feature data={feature} onAction={handleAction} />;
};

// Presentational (Dumb) Component
export const Feature = ({ data, onAction }: Props) => {
  return (
    <div>
      <h1>{data.title}</h1>
      <button onClick={() => onAction({ status: 'done' })}>
        Mark Done
      </button>
    </div>
  );
};
```

---

## 🔐 Protected Routes

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}

// components/auth/AuthGuard.tsx
export const AuthGuard = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  if (!user) return <div>Loading...</div>;
  return children;
};
```

---

## 🧩 Redux Store Structure

```
┌─ auth                           User & tokens
├─ organization                   Org state + list
├─ project                        Project state + list
├─ board                          Columns, tasks, filters
├─ task                           Tasks + comments
├─ ui                             Theme, modals, loading
├─ search                         Search results
└─ notification                   Notifications list
```

---

## 🌐 API Base URL Pattern

```typescript
// services/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - refresh token
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const newToken = await refreshAccessToken();
      if (newToken) {
        return api(error.config);
      }
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📊 Redux Middleware Setup

```typescript
// store/index.ts
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    organization: organizationSlice.reducer,
    project: projectSlice.reducer,
    board: boardSlice.reducer,
    task: taskSlice.reducer,
    ui: uiSlice.reducer,
    search: searchSlice.reducer,
    notification: notificationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginUser/fulfilled'],
        ignoredPaths: ['auth.token'],
      },
    })
    .concat(loggingMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 🪝 Custom Hooks Pattern

```typescript
// hooks/useFeature.ts
export const useFeature = (featureId: string) => {
  const dispatch = useAppDispatch();
  const feature = useAppSelector(selectFeatureById(featureId));
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const updateFeature = useCallback(
    (data: Partial<Feature>) => {
      dispatch(updateFeatureThunk({ id: featureId, ...data }))
        .unwrap()
        .catch((error) => {
          console.error('Update failed:', error);
        });
    },
    [dispatch, featureId]
  );

  return { feature, isLoading, error, updateFeature };
};

// Usage in component
const { feature, updateFeature } = useFeature('feature-123');
```

---

## ⚠️ Error Handling

```typescript
// In thunk
try {
  const response = await api.get('/endpoint');
  return response;
} catch (error) {
  return rejectWithValue({
    code: error.response?.data?.code || 'UNKNOWN_ERROR',
    message: error.response?.data?.message || error.message,
    statusCode: error.response?.status,
    details: error.response?.data?.details,
  });
}

// In component
useEffect(() => {
  dispatch(fetchData())
    .unwrap()
    .then(() => {
      toast.success('Data loaded');
    })
    .catch((error) => {
      toast.error(error.message);
      logToSentry(error);
    });
}, [dispatch]);

// Error boundary
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 🔄 Async Operation Pattern

```typescript
const handleAsyncOperation = async () => {
  try {
    // 1. Dispatch async thunk
    const result = await dispatch(asyncThunk(params))
      .unwrap();
    
    // 2. Success handling
    toast.success('Operation successful');
    
    // 3. Redirect or update UI
    router.push('/dashboard');
    
  } catch (error) {
    // 4. Error handling
    toast.error(error.message);
    
    // 5. Log if needed
    if (error.statusCode === 500) {
      logToSentry(error);
    }
  }
};
```

---

## ⏱️ Loading States Pattern

```typescript
const Component = () => {
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const data = useSelector(selectData);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
};
```

---

## 🔄 WebSocket Pattern

```typescript
// Connect on mount
useEffect(() => {
  ws.connect();
  
  // Subscribe to channels
  ws.subscribe('/projects/proj-1', handleUpdate);
  
  // Cleanup on unmount
  return () => {
    ws.unsubscribe('/projects/proj-1', handleUpdate);
    ws.disconnect();
  };
}, []);

// Handle updates
const handleUpdate = (event) => {
  dispatch(updateStateFromWebSocket(event.data));
};
```

---

## 🧪 Testing Pattern

```typescript
describe('Feature', () => {
  test('should render', () => {
    const { getByText } = render(<Feature />);
    expect(getByText('Text')).toBeInTheDocument();
  });

  test('should dispatch action on click', () => {
    const dispatch = jest.fn();
    const { getByRole } = render(
      <Feature dispatch={dispatch} />
    );
    fireEvent.click(getByRole('button'));
    expect(dispatch).toHaveBeenCalled();
  });
});
```

---

## 📋 Development Checklist per Phase

**Phase 1: Auth**
- [ ] Redux store set up
- [ ] Auth thunks created
- [ ] Services configured
- [ ] Login/register pages done
- [ ] AuthGuard working

**Phase 2-3: Org & Projects**
- [ ] Redux slices created
- [ ] CRUD operations done
- [ ] Member management UI
- [ ] Listing pages done

**Phase 4-5: Board & Tasks**
- [ ] Board layout created
- [ ] Drag-drop working
- [ ] Task CRUD done
- [ ] Comments working

**Phase 6+: Polish**
- [ ] All views created
- [ ] Real-time working
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Responsive design done
- [ ] Tests written

---

## 🎯 Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Run linter
npm run format                 # Format code

# Testing
npm test                       # Run tests
npm test -- --coverage        # With coverage
npm test -- --watch           # Watch mode

# Types
npm run type-check             # Check TypeScript

# Build analyze
npm run analyze                # Analyze bundle
```

---

## 📚 Documentation Links

- **Redux:** redux.js.org
- **Redux Toolkit:** redux-toolkit.js.org
- **Next.js:** nextjs.org/docs
- **React:** react.dev
- **TypeScript:** typescriptlang.org/docs
- **Tailwind:** tailwindcss.com

---

## 🚀 Phase Quick Links

| Phase | Duration | Focus | Guide |
|-------|----------|-------|-------|
| 1 | Days 1-3 | Foundation | [Checklist](IMPLEMENTATION_CHECKLIST.md) § Phase 1 |
| 2 | Days 4-5 | Organization | [Checklist](IMPLEMENTATION_CHECKLIST.md) § Phase 2 |
| 3 | Days 6-7 | Projects | [Checklist](IMPLEMENTATION_CHECKLIST.md) § Phase 3 |
| 4-5 | Days 8-15 | Board & Tasks | [Checklist](IMPLEMENTATION_CHECKLIST.md) § Phases 4-5 |
| 6 | Days 16-17 | Views | [Checklist](IMPLEMENTATION_CHECKLIST.md) § Phase 6 |
| 7-11 | Days 18-27 | Polish & Deploy | [Checklist](IMPLEMENTATION_CHECKLIST.md) § Phases 7-11 |

---

## 📞 Need Help?

1. Check the relevant document (see Quick Navigation above)
2. Search for your specific question in the guides
3. Review VISUAL_DIAGRAMS for flow understanding
4. Check IMPLEMENTATION_CHECKLIST for gotchas
5. Reference API_INTEGRATION_GUIDE for endpoint details

---

**Bookmark this page for quick reference! 📌**

**Start here:** [README_FIRST.md](README_FIRST.md)

