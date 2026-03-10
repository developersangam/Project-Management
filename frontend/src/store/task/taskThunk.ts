import { createAsyncThunk } from '@reduxjs/toolkit';
import { setTasks, addTask, updateTask, deleteTask, setCurrentTask, setLoading } from './taskSlice';
import { Task, Comment } from '../../types';

const getTasksAPI = async (projectId: string): Promise<Task[]> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      id: '1',
      title: 'Task 1',
      description: 'Desc',
      priority: 'high',
      status: 'todo',
      assigneeId: '1',
      dueDate: '2024-01-01',
      projectId,
      createdAt: '',
      updatedAt: '',
    },
  ];
};

const createTaskAPI = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const updateTaskAPI = async (task: Task): Promise<Task> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { ...task, updatedAt: new Date().toISOString() };
};

const deleteTaskAPI = async (id: string): Promise<void> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 500));
};

const fetchTaskByIdAPI = async (id: string): Promise<Task> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id,
    title: 'Sample Task',
    description: 'This is a sample task description',
    priority: 'medium',
    status: 'todo',
    assigneeId: '1',
    dueDate: '2024-01-01',
    projectId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [
      {
        id: '1',
        content: 'This is a sample comment',
        authorId: '1',
        author: { id: '1', name: 'John Doe', email: 'john@example.com' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
  };
};

const addCommentAPI = async (taskId: string, content: string, authorId: string): Promise<Comment> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: Date.now().toString(),
    content,
    authorId,
    author: { id: authorId, name: 'Current User', email: 'user@example.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const deleteCommentAPI = async (taskId: string, commentId: string): Promise<void> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (projectId: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const tasks = await getTasksAPI(projectId);
      dispatch(setTasks(tasks));
      return tasks;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const task = await createTaskAPI(data);
      dispatch(addTask(task));
      return task;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  'task/updateTask',
  async (task: Task, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const updatedTask = await updateTaskAPI(task);
      dispatch(updateTask(updatedTask));
      return updatedTask;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteTaskThunk = createAsyncThunk(
  'task/deleteTask',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      await deleteTaskAPI(id);
      dispatch(deleteTask(id));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'task/fetchTaskById',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const task = await fetchTaskByIdAPI(id);
      dispatch(setCurrentTask(task));
      return task;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const addComment = createAsyncThunk(
  'task/addComment',
  async ({ taskId, content, authorId }: { taskId: string; content: string; authorId: string }, { dispatch, getState }) => {
    dispatch(setLoading(true));
    try {
      const comment = await addCommentAPI(taskId, content, authorId);
      const state = getState() as any;
      const currentTask = state.task.currentTask;
      if (currentTask) {
        const updatedTask = {
          ...currentTask,
          comments: [...(currentTask.comments || []), comment],
        };
        dispatch(setCurrentTask(updatedTask));
      }
      return comment;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteComment = createAsyncThunk(
  'task/deleteComment',
  async ({ taskId, commentId }: { taskId: string; commentId: string }, { dispatch, getState }) => {
    dispatch(setLoading(true));
    try {
      await deleteCommentAPI(taskId, commentId);
      const state = getState() as any;
      const currentTask = state.task.currentTask;
      if (currentTask) {
        const updatedTask = {
          ...currentTask,
          comments: currentTask.comments?.filter((c: Comment) => c.id !== commentId) || [],
        };
        dispatch(setCurrentTask(updatedTask));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }
);