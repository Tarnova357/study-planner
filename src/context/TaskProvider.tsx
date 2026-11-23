import {
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
import { isAbortError } from '../api/httpClient';
import { taskRepository } from '../repositories/taskRepository';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskContext } from './TaskContext';

const PAGE_LIMIT = 10;
const TOAST_DURATION_MS = 3000;

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPageState] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mutatingTaskId, setMutatingTaskId] = useState<number | null>(null);

    const [filter, setFilter] = useLocalStorage<FilterType>(
        'study-planner-filter',
        'all'
    );
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({
            id: Date.now(),
            message,
            type,
            duration: TOAST_DURATION_MS,
        });
    }, []);

    const dismissToast = useCallback(() => {
        setToast(null);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const skip = (page - 1) * PAGE_LIMIT;

        taskRepository
            .getAll(PAGE_LIMIT, skip, controller.signal)
            .then((data) => {
                setTasks(data.tasks);
                setTotal(data.total);
                setError(null);
            })
            .catch((err: unknown) => {
                if (isAbortError(err)) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Не вдалося завантажити завдання'
                );
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, [page, reloadTrigger]);

    useEffect(() => {
        const activeCount = tasks.filter((task) => !task.completed).length;
        document.title = `Study Planner — ${activeCount} active tasks`;
    }, [tasks]);

    useEffect(() => {
        if (!toast) return;

        const timerId = window.setTimeout(() => {
            setToast(null);
        }, toast.duration ?? TOAST_DURATION_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [toast]);

    const setPage = useCallback((nextPage: number) => {
        setIsLoading(true);
        setError(null);
        setEditingTask(null);
        setPageState(nextPage);
    }, []);

    const retryFetch = useCallback(() => {
        setIsLoading(true);
        setError(null);
        setReloadTrigger((prev) => prev + 1);
    }, []);

    const addTask = useCallback(
        async (data: TaskInput): Promise<boolean> => {
            if (!data.title.trim()) {
                showToast('Назва завдання не може бути порожньою', 'error');
                return false;
            }

            setIsSubmitting(true);
            try {
                const created = await taskRepository.create(data);
                setTasks((prev) => [created, ...prev]);
                setTotal((prev) => prev + 1);
                showToast('Завдання успішно створено', 'success');
                return true;
            } catch (err: unknown) {
                showToast(
                    err instanceof Error ? err.message : 'Помилка створення завдання',
                    'error'
                );
                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [showToast]
    );

    const updateTask = useCallback(
        async (id: number, data: TaskInput): Promise<boolean> => {
            if (!data.title.trim()) {
                showToast('Назва завдання не може бути порожньою', 'error');
                return false;
            }

            setIsSubmitting(true);
            setMutatingTaskId(id);
            try {
                const updated = await taskRepository.update(id, data);
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === id
                            ? {
                                ...task,
                                ...updated,
                                description: data.description,
                                priority: data.priority,
                                category: data.category || task.category,
                            }
                            : task
                    )
                );
                setEditingTask(null);
                showToast('Завдання успішно оновлено', 'success');
                return true;
            } catch (err: unknown) {
                showToast(
                    err instanceof Error ? err.message : 'Помилка оновлення завдання',
                    'error'
                );
                return false;
            } finally {
                setIsSubmitting(false);
                setMutatingTaskId(null);
            }
        },
        [showToast]
    );

    const toggleTask = useCallback(
        async (task: Task): Promise<void> => {
            const previousCompleted = task.completed;
            const nextCompleted = !previousCompleted;

            setTasks((prev) =>
                prev.map((item) =>
                    item.id === task.id
                        ? { ...item, completed: nextCompleted }
                        : item
                )
            );

            try {
                await taskRepository.update(task.id, {
                    completed: nextCompleted,
                });
            } catch (err: unknown) {
                setTasks((prev) =>
                    prev.map((item) =>
                        item.id === task.id
                            ? { ...item, completed: previousCompleted }
                            : item
                    )
                );
                showToast(
                    err instanceof Error ? err.message : 'Помилка оновлення статусу',
                    'error'
                );
            }
        },
        [showToast]
    );

    const deleteTask = useCallback(
        async (id: number): Promise<void> => {
            setMutatingTaskId(id);
            try {
                await taskRepository.delete(id);
                setTasks((prev) => prev.filter((task) => task.id !== id));
                setTotal((prev) => Math.max(0, prev - 1));
                if (editingTask?.id === id) {
                    setEditingTask(null);
                }
                if (selectedTaskId === id) {
                    setSelectedTaskId(null);
                }
                showToast('Завдання видалено', 'info');
            } catch (err: unknown) {
                showToast(
                    err instanceof Error ? err.message : 'Помилка видалення завдання',
                    'error'
                );
            } finally {
                setMutatingTaskId(null);
            }
        },
        [editingTask, selectedTaskId, showToast]
    );

    const startEditing = useCallback((task: Task) => {
        setEditingTask(task);
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingTask(null);
    }, []);

    const selectTask = useCallback((id: number) => {
        setSelectedTaskId(id);
    }, []);

    const closeTaskDetails = useCallback(() => {
        setSelectedTaskId(null);
    }, []);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                total,
                page,
                limit: PAGE_LIMIT,
                totalPages,
                isLoading,
                error,
                isSubmitting,
                mutatingTaskId,
                filter,
                setFilter,
                setPage,
                retryFetch,
                editingTask,
                startEditing,
                cancelEditing,
                selectedTaskId,
                selectTask,
                closeTaskDetails,
                addTask,
                updateTask,
                toggleTask,
                deleteTask,
                toast,
                dismissToast,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};