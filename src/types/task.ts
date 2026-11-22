export type Priority = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'completed' | 'uncompleted';

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    category: string;
}

export type TaskInput = Omit<Task, 'id' | 'completed'>;

export type ToastType = 'success' | 'info' | 'error';

export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
    duration?: number;
}