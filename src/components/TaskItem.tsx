import type {Task} from '../types/task';
import './TaskItem.scss';


interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
    return (
    <div className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
        <div className="task-item__content">
            <h3 className="task-item__title">
                {task.title}
            </h3>
            {task.description && <p className="task-item__desc">{task.description}</p>}

            <div className="task-item__meta">
                <span className={`task-item__badge task-item__badge--${task.priority}`}>
                    {task.priority === 'high' ? ' Високий' : task.priority === 'medium' ? ' Середній' : ' Низький'}
                </span>
                {task.category && <span className="task-item__badge">Категорія: {task.category}</span>}
            </div>
        </div>

        <div className="task-item__actions">
            <button className="task-item__btn" onClick={() => onToggle(task.id)}>
                {task.completed ? 'Відновити' : 'Виконати'}
            </button>
            <button className="task-item__btn task-item__btn--danger" onClick={() => onDelete(task.id)}>
                Видалити
            </button>
        </div>
    </div>
);
};