import { TaskItem } from './TaskItem';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskList.scss';

export const TaskList = () => {
    const { tasks, filter } = useTaskContext();

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'uncompleted') return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        return (
            <div className="task-list__empty">
                {filter === 'all'
                    ? 'Завдань поки немає.\nДодайте перше навчальне завдання.'
                    : 'За цим фільтром завдань немає.'}
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