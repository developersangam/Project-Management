# Component Architecture & Interaction Patterns

## Component Organization Strategy

```
Components follow a hierarchical organization:

1. Container Components (Smart)
   ├─ Connect to Redux
   ├─ Handle data fetching
   ├─ Manage complex business logic
   ├─ Dispatch actions
   ├─ Pass data to presentational children

2. Presentational Components (Dumb)
   ├─ Receive data as props
   ├─ Pure functions (no side effects)
   ├─ Reusable across different contexts
   ├─ Only render UI
   └─ Emit events via callbacks

3. UI Components (Design System)
   ├─ shadcn/ui or custom
   ├─ Primitives (Button, Input, etc)
   ├─ Fully controlled via props
   └─ No business logic
```

---

## Page-Level Component Architecture

### Dashboard Layout Structure

```
src/app/dashboard/layout.tsx (Root Dashboard)
├─ <AuthGuard>
│  └─ <DashboardLayout>
│     ├─ <Sidebar>
│     │  ├─ Logo
│     │  ├─ <OrganizationSwitcher>
│     │  ├─ <NavMenu>
│     │  └─ UserProfile
│     ├─ <Header>
│     │  ├─ <Breadcrumb>
│     │  ├─ <GlobalSearch>
│     │  ├─ <NotificationBell>
│     │  ├─ ThemeToggle
│     │  └─ UserMenu
│     ├─ Main Content Area
│     │  └─ {children}
│     └─ <Modals>
│        ├─ Task Details Modal
│        ├─ Create Task Modal
│        └─ Invite Modal
└─ Error boundaries
```

---

## Feature Component Hierarchies

### 1. Board View Hierarchy

```
<BoardContainer>
├─ <BoardHeader>
│  ├─ <BreadcrumbNav>
│  ├─ <ViewSwitcher>
│  ├─ <FilterBar>
│  │  ├─ StatusFilter
│  │  ├─ PriorityFilter
│  │  ├─ AssigneeFilter
│  │  └─ SearchInput
│  ├─ <SortDropdown>
│  └─ <Actions>
│     ├─ Refresh button
│     └─ More options
│
├─ <DragDropProvider>
│  └─ <BoardContent>
│     ├─ <Column> (for each status)
│     │  ├─ <ColumnHeader>
│     │  │  ├─ Status name
│     │  │  ├─ Task count badge
│     │  │  └─ <ColumnActions>
│     │  │     ├─ Settings
│     │  │     ├─ Add task
│     │  │     └─ Menu
│     │  ├─ <DroppableList>
│     │  │  └─ <TaskCard> (draggable)
│     │  │     ├─ Title
│     │  │     ├─ Metadata row
│     │  │     │  ├─ Priority badge
│     │  │     │  ├─ Assignee avatar
│     │  │     │  └─ Due date
│     │  │     ├─ Label badges
│     │  │     └─ QuickActions menu
│     │  ├─ <ColumnFooter>
│     │  │  └─ Add task button
│     │  └─ EmptyState
│     └─ <AddColumnButton>
│
├─ <TaskDrawer> (Right sidebar)
│  ├─ <TaskDetails>
│  │  ├─ <TaskHeader>
│  │  │  ├─ Task ID & title
│  │  │  ├─ Status badge
│  │  │  └─ Menu (delete, archive)
│  │  ├─ <Description>
│  │  ├─ <Metadata>
│  │  │  ├─ <StatusSelector>
│  │  │  ├─ <PrioritySelector>
│  │  │  ├─ <AssigneeSelector>
│  │  │  └─ <DueDatePicker>
│  │  ├─ <LabelList>
│  │  ├─ <SubtaskList>
│  │  ├─ <CommentSection>
│  │  │  ├─ <CommentInput>
│  │  │  └─ <CommentsList>
│  │  │     └─ <CommentItem>
│  │  └─ <ActivityFeed>
│  └─ <TaskDrawerActions>
│     └─ Delete, Archive, etc
│
└─ <LoadingState / ErrorState>
```

**Props Flow:**
```
BoardContainer (connects to Redux)
  ├─ tasks (from state)
  ├─ columns (from state)
  ├─ filters (from state)
  ├─ dispatch (actions)
  └─ passes data to children
     └─ Each child receives scoped data
        └─ Column receives { columnId, taskIds }
           └─ TaskCard receives { taskId }
              └─ Can dispatch click action to open drawer
```

---

### 2. List View Hierarchy

```
<TaskListContainer>
├─ <ListHeader>
│  ├─ <FilterBar>
│  ├─ <SortSelector>
│  ├─ <ColumnVisibilityToggle>
│  │  └─ Checkbox list of visible columns
│  └─ <BulkActionBar> (when items selected)
│     ├─ Selection count
│     ├─ Select all checkbox
│     └─ <BulkActions>
│        ├─ Change status
│        ├─ Change priority
│        ├─ Assign
│        └─ Delete
│
├─ <TaskTable>
│  ├─ <TableHeader>
│  │  ├─ <SortableColumn> (for each visible column)
│  │  │  └─ Click to sort
│  │  └─ <Checkbox> (select all)
│  │
│  ├─ <TableBody>
│  │  └─ <TableRow> (for each task)
│  │     ├─ <Checkbox> (select)
│  │     ├─ TaskID & title
│  │     ├─ Status badge
│  │     ├─ Priority badge
│  │     ├─ Assignee avatar
│  │     ├─ Due date
│  │     ├─ Labels
│  │     └─ Menu
│  │
│  └─ <TableFooter>
│     └─ <Pagination>
│        ├─ Previous/Next
│        ├─ Page selector
│        └─ Rows per page
│
└─ <EmptyState / ErrorState>
```

---

### 3. Organization Management Hierarchy

```
<OrganizationPageContainer>
├─ <PageHeader>
│  ├─ Title
│  ├─ Description
│  └─ <CreateOrgButton>
│
├─ <OrgListView>
│  ├─ <OrgGrid> or <OrgList>
│  │  ├─ <OrgCard> (for each org)
│  │  │  ├─ Logo
│  │  │  ├─ Name
│  │  │  ├─ Description
│  │  │  ├─ Member count
│  │  │  ├─ Project count
│  │  │  ├─ Menu (settings, delete)
│  │  │  └─ Click to switch org
│  │  └─ <NewOrgCard> (create new)
│  │
│  └─ <Pagination> (if many orgs)
│
└─ <CreateOrgDialog>
   ├─ <OrgForm>
   │  ├─ Name input
   │  ├─ Description textarea
   │  ├─ Logo upload
   │  └─ Settings
   └─ <FormActions>
      ├─ Cancel
      └─ Create
```

---

### 4. Task Creation/Editing Hierarchy

```
<TaskFormDialog>
├─ <FormHeader>
│  └─ Title (Create / Edit Task)
│
├─ <TaskForm>
│  ├─ <FormSection title="Basic Info">
│  │  ├─ <TextInput name="title" required />
│  │  └─ <TextAreaInput name="description" />
│  │
│  ├─ <FormSection title="Assignment">
│  │  ├─ <StatusSelector>
│  │  ├─ <PrioritySelector>
│  │  └─ <AssigneeSelector>
│  │
│  ├─ <FormSection title="Metadata">
│  │  ├─ <DueDatePicker>
│  │  ├─ <LabelSelector>
│  │  ├─ <EstimatePointsInput>
│  │  └─ <ComponentSelector>
│  │
│  ├─ <FormSection title="Details">
│  │  └─ <CustomFieldsRenderer>
│  │
│  └─ <FormActions>
│     ├─ Cancel
│     ├─ Save as draft (optional)
│     └─ Create/Update
│
└─ <FormErrors>
   └─ Display validation errors
```

---

## Component Communication Patterns

### 1. Parent to Child: Props Drilling

```typescript
// ✓ Use for: Simple data passing
// ✗ Avoid for: Deep nesting (>3 levels)

<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data} />
  </Child>
</Parent>

// Better: Extract to container component
<ParentContainer>
  <Parent />
</ParentContainer>

// Container fetches & provides data
const ParentContainer = () => {
  const data = useSelector(selectData);
  return <Parent data={data} />;
};
```

### 2. Child to Parent: Callbacks

```typescript
// Pass callback through props
<Parent>
  <Child onAction={() => {}} />
</Parent>

// In Redux: Use actions instead
const Child = () => {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(actionCreator())} />;
};
```

### 3. Sibling Communication: Redux

```typescript
// ✓ Preferred approach for sibling communication

Component A:
const ComponentA = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(updateState(value));
  };
  return <button onClick={handleClick}>Update</button>;
};

Component B:
const ComponentB = () => {
  const state = useSelector(selectState);
  return <div>{state}</div>;
};

Both live in same reducer slice
```

### 4. Context for UI State

```typescript
// Use Context for theme, locale, etc (not data)
<ThemeProvider>
  <App />
</ThemeProvider>

const Component = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
};
```

---

## Data Flow Patterns

### Pattern 1: Fetch on Mount

```typescript
const TaskListPage = ({ projectId }) => {
  const tasks = useSelector(selectProjectTasks);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjectTasks(projectId));
  }, [projectId, dispatch]);

  if (isLoading) return <Skeleton />;
  return <TaskList tasks={tasks} />;
};
```

### Pattern 2: Optimistic Updates

```typescript
const handleTaskMove = (taskId, newColumnId) => {
  // 1. Update UI immediately (optimistic)
  dispatch(moveTaskOptimistic({ taskId, newColumnId }));

  // 2. Make API call
  dispatch(moveTask({ taskId, newColumnId }))
    .unwrap()
    .then(() => {
      // Success: Keep optimistic update
      showSuccessToast('Task moved');
    })
    .catch((error) => {
      // Failure: Revert optimistic update
      dispatch(revertTaskMove({ taskId, originalColumnId }));
      showErrorToast(error.message);
    });
};
```

### Pattern 3: Polling

```typescript
const usePolling = (selector, interval = 5000) => {
  const dispatch = useDispatch();
  const data = useSelector(selector);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(refetchData());
    }, interval);

    return () => clearInterval(timer);
  }, [dispatch]);

  return data;
};

// Usage:
const tasks = usePolling(selectTasks, 5000);
```

### Pattern 4: Real-time Updates via WebSocket

```typescript
useEffect(() => {
  const handleTaskUpdate = (event) => {
    dispatch(updateTaskInState(event.data));
  };

  ws.subscribe('/projects/:projectId/tasks', handleTaskUpdate);

  return () => {
    ws.unsubscribe('/projects/:projectId/tasks', handleTaskUpdate);
  };
}, [dispatch, projectId]);
```

---

## Form Handling Patterns

### Controlled Components Pattern

```typescript
const TaskForm = ({ task, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate
    const validation = validateTask(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    // Submit
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />
      <button>Save</button>
    </form>
  );
};
```

### Form with Redux

```typescript
const TaskForm = ({ taskId }) => {
  const task = useSelector(state => selectTaskById(state, taskId));
  const isSubmitting = useSelector(selectIsSubmitting);
  const dispatch = useDispatch();

  const handleSubmit = (formData) => {
    dispatch(updateTask({ id: taskId, ...formData }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input defaultValue={task?.title} />
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};
```

---

## Error Boundary Pattern

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error tracking
    logToSentry(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorUI error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Usage in layout
<ErrorBoundary>
  <DashboardLayout />
</ErrorBoundary>
```

---

## Modal & Drawer Patterns

### Modal Pattern

```typescript
const TaskDetailsModal = () => {
  const isOpen = useSelector(selectTaskDetailsModalOpen);
  const taskId = useSelector(selectSelectedTaskId);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeTaskDetailsModal());
  };

  const handleSave = (data) => {
    dispatch(updateTask(data))
      .unwrap()
      .then(() => {
        showSuccessToast('Task updated');
        handleClose();
      });
  };

  if (!isOpen || !taskId) return null;

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <TaskForm taskId={taskId} onSubmit={handleSave} />
    </Modal>
  );
};
```

### Drawer Pattern (Right sidebar)

```typescript
const TaskDrawer = () => {
  const isOpen = useSelector(selectTaskDrawerOpen);
  const taskId = useSelector(selectSelectedTaskId);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeTaskDrawer());
  };

  return (
    <Drawer
      open={isOpen}
      side="right"
      onClose={handleClose}
      width="500px"
    >
      <TaskDetails taskId={taskId} />
    </Drawer>
  );
};
```

---

## Responsive & Adaptive Patterns

### Responsive Hook

```typescript
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Usage
const isMobile = useMediaQuery('(max-width: 640px)');
const isTablet = useMediaQuery('(max-width: 1024px)');

if (isMobile) return <MobileLayout />;
return <DesktopLayout />;
```

### Conditional Rendering

```typescript
const ResponsiveBoard = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <>
      {isMobile && <BoardMobileView />}
      {!isMobile && <BoardDesktopView />}
    </>
  );
};
```

---

## Loading State Patterns

### Skeleton Loading

```typescript
const TaskList = ({ tasks, isLoading }) => {
  if (isLoading) {
    return (
      <div>
        {Array(5).fill(0).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return tasks.map(task => <TaskCard key={task.id} task={task} />);
};
```

### Suspense Boundary

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <TaskList />
</Suspense>

// Component uses: const data = use(fetchPromise);
```

### Loading Button

```typescript
const SaveButton = ({ isLoading, onClick }) => (
  <button
    disabled={isLoading}
    onClick={onClick}
    className={isLoading ? 'opacity-50' : ''}
  >
    {isLoading ? (
      <>
        <Spinner size="sm" className="mr-2" />
        Saving...
      </>
    ) : (
      'Save'
    )}
  </button>
);
```

---

## Performance Optimization Patterns

### Memoization

```typescript
// Prevent unnecessary re-renders
const TaskCard = memo(({ task, onClick }) => {
  return <div onClick={onClick}>{task.title}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.task.id === nextProps.task.id;
});

// Or use useCallback for callbacks
const handleClick = useCallback((taskId) => {
  dispatch(selectTask(taskId));
}, [dispatch]);
```

### Code Splitting

```typescript
// Lazy load components
const TaskDetailsDialog = lazy(() => 
  import('./TaskDetailsDialog')
);

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <TaskDetailsDialog />
    </Suspense>
  );
}
```

### Virtual Scrolling (for large lists)

```typescript
import { FixedSizeList as List } from 'react-window';

const LargeTaskList = ({ tasks }) => (
  <List
    height={600}
    itemCount={tasks.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <TaskCard task={tasks[index]} />
      </div>
    )}
  </List>
);
```

---

## Testing Component Patterns

### Component Testing Template

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TaskCard from './TaskCard';

const mockStore = configureStore();

describe('TaskCard', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      task: {
        tasks: {
          'task-1': {
            id: 'task-1',
            title: 'Test Task',
            priority: 'high'
          }
        }
      }
    });
  });

  test('renders task card with title', () => {
    render(
      <Provider store={store}>
        <TaskCard taskId="task-1" />
      </Provider>
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(
      <Provider store={store}>
        <TaskCard taskId="task-1" onClick={handleClick} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Test Task'));
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledWith('task-1');
    });
  });
});
```

---

## Accessibility Patterns

```typescript
// Semantic HTML
<button aria-label="Close task details">✕</button>
<div role="status" aria-live="polite">Tasks updated</div>

// Keyboard navigation
const handleKeyDown = (e) => {
  if (e.key === 'Escape') closeDrawer();
  if (e.key === 'Enter') submitForm();
};

// Focus management
const focusRef = useRef(null);
useEffect(() => {
  focusRef.current?.focus();
}, [isOpen]);

<input ref={focusRef} autoFocus />

// Color contrast
// Use WCAG AA compliant colors from design system

// Reduced motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

return (
  <div
    className={prefersReducedMotion ? 'no-animation' : 'animate'}
  >
    Content
  </div>
);
```

