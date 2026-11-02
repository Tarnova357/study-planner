// src/components/TaskList.tsx
// src/components/TaskList.tsx
import type {Task} from '../types/task';
import { TaskItem } from './TaskItem';
import type {FilterType} from './TaskFilters';

interface TaskListProps {
    tasks: Task[];
    currentFilter: FilterType;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const TaskList = ({ tasks, currentFilter, onToggle, onDelete }: TaskListProps) => {

    if (tasks.length === 0) {
        return (
            <div className="task-list__empty">
                {currentFilter === 'all'
                    ? 'Завдань поки немає.\nДодайте перше навчальне завдання.'
                    : 'За цим фільтром завдань немає.'}
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};