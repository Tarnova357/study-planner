import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { isAbortError } from '../api/httpClient';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskFormDialog } from '../components/TaskFormDialog';
import './TaskDetailsPage.scss';

function formatDate(isoDate: string): string {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) {
        return isoDate;
    }
    return parsed.toLocaleString('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const TaskDetailsPage = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const numericId = Number(taskId);
    const isValidId = Boolean(taskId) && Number.isInteger(numericId) && numericId > 0;

    const { isAuthenticated } = useAuth();
    const { updateTask, deleteTask, mutatingTaskId, showToast } = useTaskContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(isValidId);
    const [error, setError] = useState<string | null>(
        isValidId ? null : 'Некоректний ідентифікатор завдання'
    );
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    useEffect(() => {
        if (!isValidId) return;

        const controller = new AbortController();

        taskRepository
            .getById(numericId, controller.signal)
            .then((data) => {
                setTask(data);
                setError(null);
            })
            .catch((err: unknown) => {
                if (isAbortError(err)) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Не вдалося завантажити деталі завдання'
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
    }, [numericId, isValidId, reloadTrigger]);

    const requireAuth = (message: string): boolean => {
        if (!isAuthenticated) {
            showToast(message, 'info');
            navigate('/login', { state: { from: location } });
            return false;
        }
        return true;
    };

    const handleRetry = () => {
        setIsLoading(true);
        setError(null);
        setReloadTrigger((prev) => prev + 1);
    };

    const handleOpenEdit = () => {
        if (!requireAuth('Увійдіть, щоб редагувати завдання')) return;
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (data: TaskFormData) => {
        if (!task) return;
        const updated = await updateTask(task.id, data);
        if (updated) {
            setTask((prev) =>
                prev
                    ? {
                        ...prev,
                        ...updated,
                        description: data.description,
                        priority: data.priority,
                        category: data.category || prev.category,
                    }
                    : updated
            );
            setIsEditOpen(false);
        }
    };

    const handleStartDelete = () => {
        if (!requireAuth('Увійдіть, щоб видалити завдання')) return;
        setConfirmingDelete(true);
    };

    const handleConfirmDelete = async () => {
        if (!task) return;
        if (!requireAuth('Увійдіть, щоб видалити завдання')) return;

        const deleted = await deleteTask(task.id);
        if (deleted) {
            navigate('/tasks');
        } else {
            setConfirmingDelete(false);
        }
    };

    const isBusy = task !== null && mutatingTaskId === task.id;

    return (
        <section className="task-details-page">
            <div className="task-details-page__top">
                <Link to="/tasks" className="task-details-page__back-link">
                    ← Назад до списку
                </Link>
            </div>

            {isLoading && (
                <div className="task-details-page__status">Завантаження...</div>
            )}

            {!isLoading && error && (
                <div className="task-details-page__status task-details-page__status--error">
                    <p>Помилка завантаження: {error}</p>
                    {isValidId && (
                        <button
                            type="button"
                            className="task-details-page__btn"
                            onClick={handleRetry}
                        >
                            Спробувати ще
                        </button>
                    )}
                </div>
            )}

            {!isLoading && !error && task && (
                <article className="task-details-page__card">
                    <div className="task-details-page__header">
                        <h1 className="task-details-page__title">
                            #{task.id} {task.title}
                        </h1>
                        <span
                            className={`task-details-page__status-badge ${
                                task.completed
                                    ? 'task-details-page__status-badge--done'
                                    : ''
                            }`}
                        >
                            {task.completed ? 'Виконано' : 'Не виконано'}
                        </span>
                    </div>

                    <div className="task-details-page__grid">
                        <div className="task-details-page__row">
                            <span className="task-details-page__label">Опис</span>
                            <span className="task-details-page__value">
                                {task.description || 'Опис відсутній'}
                            </span>
                        </div>

                        <div className="task-details-page__row">
                            <span className="task-details-page__label">Категорія</span>
                            <span className="task-details-page__value">{task.category}</span>
                        </div>

                        <div className="task-details-page__row">
                            <span className="task-details-page__label">Пріоритет</span>
                            <span className="task-details-page__value">
                                {task.priority === 'high'
                                    ? 'Високий'
                                    : task.priority === 'medium'
                                        ? 'Середній'
                                        : 'Низький'}
                            </span>
                        </div>

                        <div className="task-details-page__row">
                            <span className="task-details-page__label">Створив</span>
                            <span className="task-details-page__value">{task.createdBy}</span>
                        </div>

                        <div className="task-details-page__row">
                            <span className="task-details-page__label">Дата створення</span>
                            <span className="task-details-page__value">
                                {formatDate(task.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div className="task-details-page__actions">
                        {confirmingDelete ? (
                            <div className="task-details-page__confirm">
                                <span className="task-details-page__confirm-text">
                                    Підтвердити видалення?
                                </span>
                                <button
                                    type="button"
                                    className="task-details-page__btn task-details-page__btn--danger-solid"
                                    onClick={handleConfirmDelete}
                                    disabled={isBusy}
                                >
                                    Так, видалити
                                </button>
                                <button
                                    type="button"
                                    className="task-details-page__btn"
                                    onClick={() => setConfirmingDelete(false)}
                                    disabled={isBusy}
                                >
                                    Скасувати
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="task-details-page__btn task-details-page__btn--primary"
                                    onClick={handleOpenEdit}
                                    disabled={isBusy}
                                >
                                    Редагувати
                                </button>
                                <button
                                    type="button"
                                    className="task-details-page__btn task-details-page__btn--danger"
                                    onClick={handleStartDelete}
                                    disabled={isBusy}
                                >
                                    Видалити
                                </button>
                            </>
                        )}
                    </div>
                </article>
            )}

            <TaskFormDialog
                open={isEditOpen}
                mode="edit"
                task={task ?? undefined}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleEditSubmit}
            />
        </section>
    );
};