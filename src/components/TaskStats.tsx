import type {Task} from '../types/task';
import './TaskStats.scss';

interface TaskStatsProps {
    tasks: Task[];
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const uncompleted = total - completed;

    return (
        <div className="task-stats">
            <div className="task-stats__item">Всього: {total}</div>
            <div className="task-stats__item">Виконано: {completed}</div>
            <div className="task-stats__item">Залишилось: {uncompleted}</div>
        </div>
    );
};