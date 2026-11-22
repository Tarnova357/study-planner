import { useEffect, useState } from 'react';
import { isAbortError } from '../api/httpClient';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';
import './TaskDetails.scss';

interface TaskDetailsProps {
    taskId: number;
    onClose: () => void;
}

export const TaskDetails = ({ taskId, onClose }: TaskDetailsProps) => {
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        taskRepository
            .getById(taskId, controller.signal)
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
    }, [taskId, reloadTrigger]);

    const handleRetry = () => {
        setIsLoading(true);
        setError(null);
        setReloadTrigger((prev) => prev + 1);
    };

    return (
        <div className="task-details" onClick={onClose} role="dialog" aria-modal="true">
            <div
                className="task-details__modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="task-details__header">
                    <h2 className="task-details__heading">Деталі завдання #{taskId}</h2>
                    <button
                        type="button"
                        className="task-details__close-btn"
                        onClick={onClose}
                        aria-label="Закрити деталі"
                    >
                        ×
                    </button>
                </div>

                {isLoading && (
                    <div className="task-details__status">Завантаження...</div>
                )}

                {!isLoading && error && (
                    <div className="task-details__status task-details__status--error">
                        <p>Помилка завантаження: {error}</p>
                        <button
                            type="button"
                            className="task-details__retry-btn"
                            onClick={handleRetry}
                        >
                            Спробувати ще
                        </button>
                    </div>
                )}

                {!isLoading && !error && task && (
                    <div className="task-details__content">
                        <div className="task-details__row">
                            <span className="task-details__label">Назва</span>
                            <span className="task-details__value">{task.title}</span>
                        </div>
                        <div className="task-details__row">
                            <span className="task-details__label">Опис</span>
                            <span className="task-details__value">
                                {task.description || 'Опис відсутній'}
                            </span>
                        </div>
                        <div className="task-details__row">
                            <span className="task-details__label">Категорія</span>
                            <span className="task-details__value">{task.category}</span>
                        </div>
                        <div className="task-details__row">
                            <span className="task-details__label">Пріоритет</span>
                            <span className="task-details__value">
                                {task.priority === 'high'
                                    ? 'Високий'
                                    : task.priority === 'medium'
                                        ? 'Середній'
                                        : 'Низький'}
                            </span>
                        </div>
                        <div className="task-details__row">
                            <span className="task-details__label">Статус</span>
                            <span className="task-details__value">
                                {task.completed ? 'Виконано' : 'Не виконано'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};