import { TaskItem } from './TaskItem';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskList.scss';

export const TaskList = () => {
    const { tasks, filter, isLoading, error, retryFetch } = useTaskContext();

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
        if (filter === 'completed') return task.completed;
        if (filter === 'uncompleted') return !task.completed;
        return true;
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