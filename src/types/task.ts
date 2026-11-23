export type Priority = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'completed' | 'uncompleted';

export type PriorityFilterType = 'all' | Priority;

export interface TaskClientMetadata {
    createdBy: string;
    createdAt: string;
    isClientOwnedMetadata: true;
}

export interface Task extends TaskClientMetadata {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    category: string;
}

export type TaskInput = Omit<Task, 'id' | 'completed' | 'createdBy' | 'createdAt' | 'isClientOwnedMetadata'>;

export type ToastType = 'success' | 'info' | 'error';

export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
    duration?: number;
}