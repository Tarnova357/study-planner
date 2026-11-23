import type { FilterType, PriorityFilterType } from '../types/task';
import { TaskItem } from './TaskItem';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskList.scss';

interface TaskListProps {
    status: FilterType;
    priority: PriorityFilterType;
}

export const TaskList = ({ status, priority }: TaskListProps) => {
    const { tasks, isLoading, error, retryFetch } = useTaskContext();

    if (isLoading) {
        return <div className="task-list__state">Loading...</div>;
    }

    if (error) {
        return (
            <div className="task-list__state task-list__state--error">
                <p>Помилка завантаження: {error}</p>
                <button
                    type="button"
                    className="task-list__retry-btn"
                    onClick={retryFetch}
                >
                    Спробувати ще
                </button>
            </div>
        );
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            status === 'all' ||
            (status === 'completed' && task.completed) ||
            (status === 'uncompleted' && !task.completed);

        const matchesPriority = priority === 'all' || task.priority === priority;

        return matchesStatus && matchesPriority;
    });

    if (filteredTasks.length === 0) {
        return (
            <div className="task-list__state task-list__state--empty">
                Завдань не знайдено.
            </div>
        );
    }

    return (
        <div className="task-list">
            {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};