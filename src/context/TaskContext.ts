import { createContext } from 'react';
import type {
    FilterType,
    Task,
    TaskInput,
    ToastMessage,
} from '../types/task';

export interface TaskContextValue {
    tasks: Task[];
    pendingDeleteId: number | null;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    editingTask: Task | null;
    startEditing: (task: Task) => void;
    cancelEditing: () => void;
    addTask: (data: TaskInput) => void;
    updateTask: (id: number, data: TaskInput) => void;
    toggleTask: (id: number) => void;
    requestDelete: (id: number) => void;
    undoDelete: () => void;
    resetTasks: () => void;
    toast: ToastMessage | null;
    dismissToast: () => void;
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined);