import { createContext } from 'react';
import type {
    FilterType,
    Task,
    TaskInput,
    ToastMessage,
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
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    setPage: (page: number) => void;
    retryFetch: () => void;
    editingTask: Task | null;
    startEditing: (task: Task) => void;
    cancelEditing: () => void;
    selectedTaskId: number | null;
    selectTask: (id: number) => void;
    closeTaskDetails: () => void;
    addTask: (data: TaskInput) => Promise<boolean>;
    updateTask: (id: number, data: TaskInput) => Promise<boolean>;
    toggleTask: (task: Task) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    toast: ToastMessage | null;
    dismissToast: () => void;
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined);