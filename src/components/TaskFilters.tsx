import type { FilterType, PriorityFilterType } from '../types/task';
import './TaskFilters.scss';

interface TaskFiltersProps {
    status: FilterType;
    priority: PriorityFilterType;
    onStatusChange: (status: FilterType) => void;
    onPriorityChange: (priority: PriorityFilterType) => void;
}

export const TaskFilters = ({
                                status,
                                priority,
                                onStatusChange,
                                onPriorityChange,
                            }: TaskFiltersProps) => {
    return (
        <div className="task-filters">
            <div className="task-filters__group">
                <button
                    type="button"
                    className={`task-filters__btn ${status === 'all' ? 'task-filters__btn--active' : ''}`}
                    onClick={() => onStatusChange('all')}
                >
                    Всі
                </button>
                <button
                    type="button"
                    className={`task-filters__btn ${status === 'completed' ? 'task-filters__btn--active' : ''}`}
                    onClick={() => onStatusChange('completed')}
                >
                    Виконані
                </button>
                <button
                    type="button"
                    className={`task-filters__btn ${status === 'uncompleted' ? 'task-filters__btn--active' : ''}`}
                    onClick={() => onStatusChange('uncompleted')}
                >
                    Не виконані
                </button>
            </div>

            <select
                className="task-filters__select"
                value={priority}
                onChange={(e) => onPriorityChange(e.target.value as PriorityFilterType)}
                aria-label="Фільтр за пріоритетом"
            >
                <option value="all">Усі пріоритети</option>
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
            </select>
        </div>
    );
};