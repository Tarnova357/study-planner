import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import type { Task } from '../types/task';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskItem.scss';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
    const { isAuthenticated } = useAuth();
    const { mutatingTaskId, toggleTask, deleteTask, showToast } = useTaskContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const isBusy = mutatingTaskId === task.id;

    const requireAuth = (message: string): boolean => {
        if (!isAuthenticated) {
            showToast(message, 'info');
            navigate('/login', { state: { from: location } });
            return false;
        }
        return true;
    };

    const handleToggle = async () => {
        if (!requireAuth('Увійдіть, щоб змінити статус завдання')) return;
        await toggleTask(task);
    };

    const handleStartDelete = () => {
        if (!requireAuth('Увійдіть, щоб видалити завдання')) return;
        setConfirmingDelete(true);
    };

    const handleConfirmDelete = async () => {
        if (!requireAuth('Увійдіть, щоб видалити завдання')) return;
        await deleteTask(task.id);
        setConfirmingDelete(false);
    };

    return (
        <div
            className={`task-item ${task.completed ? 'task-item--completed' : ''} ${
                confirmingDelete ? 'task-item--confirming' : ''
            }`}
        >
            <div className="task-item__content">
                <h3 className="task-item__title">{task.title}</h3>
                {task.description && <p className="task-item__desc">{task.description}</p>}

                <div className="task-item__meta">
                    <span className={`task-item__badge task-item__badge--${task.priority}`}>
                        {task.priority === 'high'
                            ? 'Високий'
                            : task.priority === 'medium'
                                ? 'Середній'
                                : 'Низький'}
                    </span>
                    {task.category && (
                        <span className="task-item__badge">Категорія: {task.category}</span>
                    )}
                </div>
            </div>

            <div className="task-item__actions">
                {confirmingDelete ? (
                    <div className="task-item__confirm">
                        <span className="task-item__confirm-text">Видалити?</span>
                        <button
                            type="button"
                            className="task-item__btn task-item__btn--confirm"
                            onClick={handleConfirmDelete}
                            disabled={isBusy}
                        >
                            Так
                        </button>
                        <button
                            type="button"
                            className="task-item__btn"
                            onClick={() => setConfirmingDelete(false)}
                            disabled={isBusy}
                        >
                            Ні
                        </button>
                    </div>
                ) : (
                    <>
                        <Link
                            to={`/tasks/${task.id}`}
                            className="task-item__btn task-item__btn--link"
                        >
                            Деталі
                        </Link>
                        <button
                            type="button"
                            className="task-item__btn"
                            onClick={handleToggle}
                            disabled={isBusy}
                        >
                            {task.completed ? 'Відновити' : 'Виконати'}
                        </button>
                        <button
                            type="button"
                            className="task-item__btn task-item__btn--danger"
                            onClick={handleStartDelete}
                            disabled={isBusy}
                        >
                            Видалити
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};