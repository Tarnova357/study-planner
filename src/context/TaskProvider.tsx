import {
    useReducer,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import type {
    FilterType,
    Task,
    TaskInput,
    ToastMessage,
    ToastType,
} from '../types/task';
import {
    taskReducer,
    initTaskState,
    TASKS_STORAGE_KEY,
} from '../reducers/taskReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialTasks } from '../data/initialTasks';
import { TaskContext } from './TaskContext';

const UNDO_DURATION_MS = 5000;
const TOAST_DURATION_MS = 3000;

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(taskReducer, undefined, initTaskState);
    const [filter, setFilter] = useLocalStorage<FilterType>(
        'study-planner-filter',
        'all'
    );
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = useCallback(
        (message: string, type: ToastType = 'info', undoable = false) => {
            setToast({
                id: Date.now(),
                message,
                type,
                duration: undoable ? UNDO_DURATION_MS : TOAST_DURATION_MS,
                undoable,
            });
        },
        []
    );

    const dismissToast = useCallback(() => {
        setToast(null);
    }, []);
    useEffect(() => {
        try {
            window.localStorage.setItem(
                TASKS_STORAGE_KEY,
                JSON.stringify(state.tasks)
            );
        } catch (error) {
            console.warn('Не вдалося зберегти завдання в localStorage:', error);
        }
    }, [state.tasks]);

    useEffect(() => {
        const activeCount = state.tasks.filter((task) => !task.completed).length;
        document.title = `Study Planner — ${activeCount} active tasks`;
    }, [state.tasks]);

    useEffect(() => {
        if (state.pendingDeleteId === null) return;

        const targetId = state.pendingDeleteId;
        const timerId = window.setTimeout(() => {
            dispatch({ type: 'confirmDelete', payload: { id: targetId } });
            showToast('Завдання остаточно видалено', 'info');
        }, UNDO_DURATION_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [state.pendingDeleteId, showToast]);

    useEffect(() => {
        if (!toast || toast.undoable) return;

        const timerId = window.setTimeout(() => {
            setToast(null);
        }, toast.duration ?? TOAST_DURATION_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [toast]);

    const addTask = useCallback(
        (data: TaskInput) => {
            if (!data.title.trim()) {
                showToast('Назва завдання не може бути порожньою', 'error');
                return;
            }
            dispatch({ type: 'add', payload: data });
            showToast('Завдання успішно створено', 'success');
        },
        [showToast]
    );

    const updateTask = useCallback(
        (id: number, data: TaskInput) => {
            if (!data.title.trim()) {
                showToast('Назва завдання не може бути порожньою', 'error');
                return;
            }
            dispatch({ type: 'update', payload: { id, data } });
            setEditingTask(null);
            showToast('Завдання успішно оновлено', 'success');
        },
        [showToast]
    );

    const toggleTask = useCallback((id: number) => {
        dispatch({ type: 'toggle', payload: { id } });
    }, []);

    const requestDelete = useCallback(
        (id: number) => {
            if (state.pendingDeleteId !== null) {
                showToast('Спочатку завершіть або скасуйте поточне видалення', 'error');
                return;
            }
            if (editingTask?.id === id) {
                setEditingTask(null);
            }
            dispatch({ type: 'requestDelete', payload: { id } });
            showToast('Завдання буде видалено', 'info', true);
        },
        [state.pendingDeleteId, editingTask, showToast]
    );

    const undoDelete = useCallback(() => {
        if (state.pendingDeleteId === null) return;
        dispatch({ type: 'undoDelete' });
        showToast('Видалення скасовано', 'success');
    }, [state.pendingDeleteId, showToast]);

    const resetTasks = useCallback(() => {
        dispatch({ type: 'reset', payload: initialTasks });
        setEditingTask(null);
        showToast('Дані скинуто до початкових', 'info');
    }, [showToast]);

    const startEditing = useCallback((task: Task) => {
        setEditingTask(task);
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingTask(null);
    }, []);

    return (
        <TaskContext.Provider
            value={{
                tasks: state.tasks,
                pendingDeleteId: state.pendingDeleteId,
                filter,
                setFilter,
                editingTask,
                startEditing,
                cancelEditing,
                addTask,
                updateTask,
                toggleTask,
                requestDelete,
                undoDelete,
                resetTasks,
                toast,
                dismissToast,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};