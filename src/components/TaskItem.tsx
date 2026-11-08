import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskItem.scss';

interface TaskItemProps {
    task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
    const {
        pendingDeleteId,
        toggleTask,
        requestDelete,
        undoDelete,
        startEditing,
    } = useTaskContext();

    const isPendingDelete = pendingDeleteId === task.id;

    return (
        <div
            className={`task-item ${task.completed ? 'task-item--completed' : ''} ${
                isPendingDelete ? 'task-item--pending' : ''
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
                    {isPendingDelete && (
                        <span className="task-item__badge task-item__badge--pending">
                            Буде видалено...
                        </span>
                    )}
                </div>
            </div>

            <div className="task-item__actions">
                <button
                    className="task-item__btn"
                    onClick={() => toggleTask(task.id)}
                    disabled={isPendingDelete}
                >
                    {task.completed ? 'Відновити' : 'Виконати'}
                </button>
                <button
                    className="task-item__btn"
                    onClick={() => startEditing(task)}
                    disabled={isPendingDelete}
                >
                    Редагувати
                </button>
                {isPendingDelete ? (
                    <button
                        className="task-item__btn task-item__btn--undo"
                        onClick={undoDelete}
                    >
                        Скасувати
                    </button>
                ) : (
                    <button
                        className="task-item__btn task-item__btn--danger"
                        onClick={() => requestDelete(task.id)}
                    >
                        Видалити
                    </button>
                )}
            </div>
        </div>
    );
};