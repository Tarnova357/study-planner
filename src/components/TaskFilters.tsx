import { useTaskContext } from '../hooks/useTaskContext';
import './TaskFilters.scss';

export const TaskFilters = () => {
    const { filter, setFilter } = useTaskContext();

    return (
        <div className="task-filters">
            <button
                className={`task-filters__btn ${filter === 'all' ? 'task-filters__btn--active' : ''}`}
                onClick={() => setFilter('all')}
            >
                Всі
            </button>
            <button
                className={`task-filters__btn ${filter === 'completed' ? 'task-filters__btn--active' : ''}`}
                onClick={() => setFilter('completed')}
            >
                Виконані
            </button>
            <button
                className={`task-filters__btn ${filter === 'uncompleted' ? 'task-filters__btn--active' : ''}`}
                onClick={() => setFilter('uncompleted')}
            >
                Не виконані
            </button>
        </div>
    );
};