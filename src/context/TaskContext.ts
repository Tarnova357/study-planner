import { createContext } from 'react';
import type {
    Task,
    TaskInput,
    ToastMessage,
    ToastType,
} from '../types/task';

export interface TaskContextValue {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    isSubmitting: boolean;
    mutatingTaskId: number | null;
    setPage: (page: number) => void;
    retryFetch: () => void;
    addTask: (data: TaskInput) => Promise<Task | null>;
    updateTask: (id: number, data: TaskInput) => Promise<Task | null>;
    toggleTask: (task: Task) => Promise<boolean>;
    deleteTask: (id: number) => Promise<boolean>;
    toast: ToastMessage | null;
    showToast: (message: string, type?: ToastType) => void;
    dismissToast: () => void;
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined);