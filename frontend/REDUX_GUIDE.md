# Redux & State Management Deep Dive

## Store Configuration

```typescript
// File: src/store/index.ts

Configuration Points:
├─ Redux middleware setup
│  ├─ redux-thunk (async operations)
│  ├─ Custom logging middleware
│  ├─ Error handling middleware
│  └─ Offline persistence middleware
├─ DevTools integration (development only)
├─ Store persistence strategy
│  ├─ localStorage for auth tokens
│  ├─ sessionStorage for UI state
│  └─ In-memory for transient data
└─ Hydration strategy
   └─ Load persisted state on app init
```

---

## Slice Architecture Pattern

### Each slice follows this structure:

```typescript
// File: src/store/[feature]/[feature]Slice.ts

Pattern:
├─ Initial state definition
│  └─ Typed with TypeScript interface
├─ Reducers (synchronous)
│  ├─ Pure functions
│  ├─ Update state directly (Redux Toolkit uses Immer)
│  ├─ No API calls or side effects
│  └─ Examples:
│     ├─ setState
│     ├─ addItem
│     ├─ updateItem
│     ├─ removeItem
│     ├─ clearState
│     └─ setError
├─ Extra reducers (handle thunk actions)
│  ├─ Handle pending state
│  ├─ Handle fulfilled state
│  ├─ Handle rejected state
│  └─ Update loading/error flags
└─ Selectors (optional)
   ├─ selectState
   ├─ selectItems
   ├─ selectIsLoading
   ├─ selectError
   └─ Memoized selectors for computed values
```

**Example pattern:**
```typescript
export const [featureName]Slice = createSlice({
  name: 'featureName',
  initialState,
  reducers: {
    // Synchronous actions
    setState: (state, action) => { /* ... */ },
    setError: (state, action) => { state.error = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(asyncThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(asyncThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});
```

---

## Thunk Architecture Pattern

```typescript
// File: src/store/[feature]/[feature]Thunk.ts

Pattern:
├─ Each thunk represents ONE API operation
├─ Thunk signature:
│  ├─ Define input type
│  ├─ Define response type
│  ├─ Strongly typed with TypeScript
│  └─ Always handle errors
├─ Implementation:
│  ├─ Call corresponding service method
│  ├─ Handle response transformation
│  ├─ Return data or throw error
│  ├─ Log significant events
│  └─ Track metrics if needed
└─ Naming convention:
   └─ [action]Request / [action]Operation
      Examples:
      ├─ loginUserRequest
      ├─ fetchOrganizationsRequest
      ├─ createProjectOperation
      ├─ updateTaskOperation
      └─ moveTaskOperation
```

**Example pattern:**
```typescript
export const fetchItemsRequest = createAsyncThunk(
  'feature/fetchItems',
  async (payload: FetchPayload, { rejectWithValue }) => {
    try {
      const response = await featureService.getItems(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## Selector Pattern

```typescript
// File: src/store/[feature]/[feature]Selector.ts (Optional)

Types of Selectors:
├─ Basic selectors (access single state property)
│  └─ selectFeatureState
│  └─ selectItems
│  └─ selectIsLoading
│  └─ selectError
│
├─ Derived selectors (compute values from state)
│  └─ selectItemCount
│  └─ selectHasErrors
│  └─ selectIsEmpty
│
├─ Filtered selectors (with parameters)
│  └─ selectItemById(id)
│  └─ selectItemsByStatus(status)
│  └─ selectFilteredItems(filter)
│
└─ Memoized selectors (recomputeonly on dependency change)
   └─ selectSortedItems = useSelector(selectSortedItems)
   └─ selectGroupedItems = useSelector(selectGroupedItems)
```

---

## Handling Async Operations

### Thunk Action Lifecycle:

```
1. Action Dispatched
   └─ dispatch(fetchItemsRequest(params))

2. Pending State
   └─ isLoading = true
   └─ error = null
   └─ UI shows loading spinner

3. API Call
   └─ axios call to /api/items
   └─ Potential outcomes: success, failure, timeout

4a. Fulfilled (Success)
   └─ isLoading = false
   └─ data = response payload
   └─ error = null
   └─ UI renders data

4b. Rejected (Failure)
   └─ isLoading = false
   └─ error = error message
   └─ data = unchanged
   └─ UI shows error state

5. Cleanup
   └─ Clear loading/error after user action
   └─ Or keep for next attempt
```

---

## Common Patterns

### 1. Normalized State (for complex data)

```typescript
// Instead of nested arrays:
{
  projects: [
    { id: 1, name: 'P1', tasks: [
      { id: 1, title: 'T1' },
      { id: 2, title: 'T2' }
    ]}
  ]
}

// Use normalized structure:
{
  projects: {
    byId: {
      '1': { id: 1, name: 'P1', taskIds: [1, 2] }
    },
    allIds: [1]
  },
  tasks: {
    byId: {
      '1': { id: 1, title: 'T1', projectId: 1 },
      '2': { id: 2, title: 'T2', projectId: 1 }
    },
    allIds: [1, 2]
  }
}

Benefits:
├─ Easier updates (update once, reference everywhere)
├─ No duplicate data
├─ Better performance for large datasets
├─ Simpler denormalization in selectors
```

### 2. Loading States

```typescript
// Option 1: Boolean flag
isLoading: boolean
└─ Simple but can't distinguish between operations

// Option 2: String status (recommended)
status: 'idle' | 'pending' | 'succeeded' | 'error'
└─ More explicit, easier to track state

// Option 3: Loading by ID
loading: {
  global: boolean,
  byId: { [id]: boolean }
}
└─ Track loading for specific items
```

### 3. Error Handling

```typescript
// Option 1: Single error field
error: string | null
└─ Only one error at a time

// Option 2: Error by operation
errors: {
  fetch: null,
  create: 'Failed to create item',
  update: null
}
└─ Track multiple operation failures

// Option 3: Rich error object (recommended)
error: {
  code: 'VALIDATION_ERROR',
  message: 'Email already exists',
  details: { email: ['Already in use'] },
  statusCode: 400
} | null
```

### 4. Filtering & Sorting

```typescript
// Store filters separately from data
board: {
  tasks: [ /* all tasks */ ],
  filters: {
    status: ['todo', 'in-progress'],
    priority: ['high', 'critical'],
    assignee: ['user-1'],
    search: 'bug',
    dueDateRange: { start, end }
  },
  sort: {
    field: 'dueDate',
    order: 'asc' | 'desc'
  }
}

// Compute filtered tasks in selector
selectFilteredTasks = createSelector(
  selectTasks,
  selectFilters,
  selectSort,
  (tasks, filters, sort) => {
    let filtered = tasks.filter(task => {
      // Apply filters
    });
    filtered.sort((a, b) => {
      // Apply sort
    });
    return filtered;
  }
);
```

### 5. Pagination

```typescript
list: {
  items: [],
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalItems: 150,
    totalPages: 8
  },
  hasMore: true,
  isLoadingMore: false
}

Thunk payload includes pagination params:
fetchItems(params: {
  page: number,
  pageSize: number,
  sort?: string,
  filter?: object
})
```

---

## Error Handling Strategy

### Centralized Error Handling:

```typescript
// API Error Response Pattern:
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
  timestamp?: string;
}

// Thunk error handling:
export const fetchItems = createAsyncThunk(
  'items/fetch',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.get('/items', payload);
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      return rejectWithValue({
        code: apiError.code,
        message: apiError.message,
        statusCode: apiError.statusCode,
        details: apiError.details
      });
    }
  }
);

// In reducer:
.addCase(fetchItems.rejected, (state, action) => {
  state.error = action.payload;
  state.isLoading = false;
})
```

---

## Performance Optimization

### 1. Selector Memoization
```typescript
// Without memoization (causes unnecessary renders)
const items = useSelector(state => 
  state.items.filter(i => i.status === 'active')
);

// With memoization (only recomputes on dependency change)
const selectActiveItems = createSelector(
  state => state.items,
  items => items.filter(i => i.status === 'active')
);
const activeItems = useSelector(selectActiveItems);
```

### 2. Normalized State
```typescript
// Reduces duplication, faster updates
// Instead of updating nested arrays, update once in normalized structure
```

### 3. Subscription Optimization
```typescript
// Use Redux subscribe for WebSocket updates wisely
// Debounce high-frequency updates
// Batch updates together
```

---

## Testing Redux

### Unit Testing Pattern:

```typescript
describe('itemSlice', () => {
  describe('reducers', () => {
    test('should handle setItems', () => {
      const initialState = { items: [] };
      const action = { type: 'items/setItems', payload: [{ id: 1 }] };
      const result = itemsSlice.reducer(initialState, action);
      expect(result.items).toEqual([{ id: 1 }]);
    });
  });

  describe('thunks', () => {
    test('should handle fetchItems.fulfilled', async () => {
      const mockData = [{ id: 1, title: 'Item' }];
      jest.mock('services/itemService', () => ({
        getItems: jest.fn().mockResolvedValue(mockData)
      }));

      const result = await dispatch(fetchItems({}));
      expect(result.payload).toEqual(mockData);
    });
  });

  describe('selectors', () => {
    test('selectItems should return items', () => {
      const state = { items: { items: [{ id: 1 }] } };
      expect(selectItems(state)).toEqual([{ id: 1 }]);
    });
  });
});
```

---

## Debugging Redux

### Redux DevTools Integration:

1. **Installation**: Already configured in store/index.ts
2. **Usage**: 
   - Install Redux DevTools extension in browser
   - Time-travel debugging
   - Inspect state/actions
   - Dispatch actions manually

### Logging Middleware:

```typescript
// Add custom logging middleware to track state changes
const loggingMiddleware = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};
```

---

## State Persistence

### Save to localStorage:

```typescript
// Persist specific reducers
const persistConfig = {
  key: 'root',
  storage: localStorage,
  whitelist: ['auth', 'ui'] // only persist these
};

// Load persisted state on app init
if (process.env.NODE_ENV === 'production') {
  const persistedState = localStorage.getItem('state');
  if (persistedState) {
    initialState = JSON.parse(persistedState);
  }
}
```

---

## Migration & Updates

### Handling state shape changes:

```typescript
// Versioned state migration
const migrateState = (state) => {
  if (!state.version || state.version < 2) {
    // Migration logic for v1 -> v2
    state.newField = defaultValue;
  }
  if (state.version < 3) {
    // Migration logic for v2 -> v3
    delete state.oldField;
  }
  state.version = CURRENT_VERSION;
  return state;
};
```

