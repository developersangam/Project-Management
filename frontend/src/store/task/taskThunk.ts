import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setTasks,
  updateTask,
  deleteTask,
  setLoading,
  setColumns,
  setCurrentTask,
} from "./taskSlice";
import { Task, Comment } from "../../types";
import {
  createTaskAPI,
  getAllColumnsAPI,
  getTasksAPI,
  moveTaskAPI,
  updateTaskAPI,
} from "@/service/task.service";
import { toast } from "sonner";

export const fetchAllColumns = createAsyncThunk(
  "project/fetchProjects",
  async (projectSlug: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const columns = await getAllColumnsAPI(projectSlug);
      dispatch(setColumns(columns.data));
      return columns.data;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

const deleteTaskAPI = async (id: string): Promise<void> => {
  // Placeholder
  await new Promise((resolve) => setTimeout(resolve, 500));
};

const fetchTaskByIdAPI = async (id: string): Promise<Task> => {
  // Placeholder
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id,
    title: "Sample Task",
    description: "This is a sample task description",
    priority: "medium",
    status: "todo",
    assigneeId: "1",
    dueDate: "2024-01-01",
    projectId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [
      {
        id: "1",
        content: "This is a sample comment",
        authorId: "1",
        author: { id: "1", name: "John Doe", email: "john@example.com" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
};

const addCommentAPI = async (
  taskId: string,
  content: string,
  authorId: string,
): Promise<Comment> => {
  // Placeholder
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: Date.now().toString(),
    content,
    authorId,
    author: { id: authorId, name: "Current User", email: "user@example.com" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const deleteCommentAPI = async (
  taskId: string,
  commentId: string,
): Promise<void> => {
  // Placeholder
  await new Promise((resolve) => setTimeout(resolve, 500));
};

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (
    params: { projectSlug: string; view: string; limit: number },
    { dispatch },
  ) => {
    dispatch(setLoading(true));
    try {
      const response = await getTasksAPI(params);
      const columns = response.data.reduce((acc: any, record: any) => {
        const column = record.column;
        acc.push(column);
        return acc;
      }, []);

      const tasks = response.data.reduce((acc: any, record: any) => {
        acc.push(...record.tasks);
        return acc;
      }, []);
      dispatch(setColumns(columns));
      dispatch(setTasks(tasks));
      return response.data;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (data: Omit<Task, "id" | "createdAt" | "updatedAt">, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await createTaskAPI(data);
      toast.success(
        response.message ||
          response.data.message ||
          "Task created successfully",
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create task. Please try again.",
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const moveTask = createAsyncThunk(
  "task/moveTask",
  async (
    params: {
      projectSlug: string;
      taskId: string;
      columnId: string;
      payload: Partial<Task>;
    },
    { dispatch },
  ) => {
    try {
      const updatedTask = await moveTaskAPI(params);
      dispatch(updateTask(params.payload as Task));
      return updatedTask;
    } catch (error) {
      console.error("Error moving task:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const deleteTaskThunk = createAsyncThunk(
  "task/deleteTask",
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      await deleteTaskAPI(id);
      dispatch(deleteTask(id));
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const fetchTaskById = createAsyncThunk(
  "task/fetchTaskById",
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const task = await fetchTaskByIdAPI(id);
      dispatch(setCurrentTask(task));
      return task;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const addComment = createAsyncThunk(
  "task/addComment",
  async (
    {
      taskId,
      content,
      authorId,
    }: { taskId: string; content: string; authorId: string },
    { dispatch, getState },
  ) => {
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
  },
);

export const deleteComment = createAsyncThunk(
  "task/deleteComment",
  async (
    { taskId, commentId }: { taskId: string; commentId: string },
    { dispatch, getState },
  ) => {
    dispatch(setLoading(true));
    try {
      await deleteCommentAPI(taskId, commentId);
      const state = getState() as any;
      const currentTask = state.task.currentTask;
      if (currentTask) {
        const updatedTask = {
          ...currentTask,
          comments:
            currentTask.comments?.filter((c: Comment) => c.id !== commentId) ||
            [],
        };
        dispatch(setCurrentTask(updatedTask));
      }
    } finally {
      dispatch(setLoading(false));
    }
  },
);
