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
    undoable?: boolean;
}

export interface TaskState {
    tasks: Task[];
    pendingDeleteId: number | null;
}

export type TaskAction =
    | { type: 'add'; payload: TaskInput }
    | { type: 'toggle'; payload: { id: number } }
    | { type: 'update'; payload: { id: number; data: TaskInput } }
    | { type: 'requestDelete'; payload: { id: number } }
    | { type: 'confirmDelete'; payload: { id: number } }
    | { type: 'undoDelete' }
    | { type: 'reset'; payload: Task[] };