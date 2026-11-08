import { useTaskContext } from '../hooks/useTaskContext';
import './TaskStats.scss';

export const TaskStats = () => {
    const { tasks } = useTaskContext();

    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const uncompleted = total - completed;

    return (
        <div className="task-stats">
            <div className="task-stats__item">Всього: {total}</div>
            <div className="task-stats__item">Виконано: {completed}</div>
            <div className="task-stats__item">Залишилось: {uncompleted}</div>
        </div>
    );
};