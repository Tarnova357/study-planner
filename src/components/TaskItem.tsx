import { useState } from 'react';
import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskItem.scss';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
    const {
        mutatingTaskId,
        toggleTask,
        deleteTask,
        startEditing,
        selectTask,
    } = useTaskContext();

    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const isBusy = mutatingTaskId === task.id;

    const handleConfirmDelete = async () => {
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
                        <button
                            type="button"
                            className="task-item__btn"
                            onClick={() => selectTask(task.id)}
                            disabled={isBusy}
                        >
                            Деталі
                        </button>
                        <button
                            type="button"
                            className="task-item__btn"
                            onClick={() => toggleTask(task)}
                            disabled={isBusy}
                        >
                            {task.completed ? 'Відновити' : 'Виконати'}
                        </button>
                        <button
                            type="button"
                            className="task-item__btn"
                            onClick={() => startEditing(task)}
                            disabled={isBusy}
                        >
                            Редагувати
                        </button>
                        <button
                            type="button"
                            className="task-item__btn task-item__btn--danger"
                            onClick={() => setConfirmingDelete(true)}
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