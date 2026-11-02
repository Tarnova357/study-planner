import {useState, type FormEvent} from 'react';
import type {Priority, Task} from '../types/task';

interface TaskFormProps {
    onAdd: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export const TaskForm = ({ onAdd }: TaskFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        onAdd({ title, description, category, priority });

        setTitle('');
        setDescription('');
        setCategory('');
        setPriority('medium');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                className="task-form__input"
                placeholder="Назва завдання *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                className="task-form__input"
                placeholder="Опис"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                className="task-form__input"
                placeholder="Категорія"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <select
                className="task-form__select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
            >
                <option value="low">Низький</option>
                <option value="medium">Середній</option>
                <option value="high">Високий</option>
            </select>
            <button className="task-form__btn" type="submit">Додати</button>
        </form>
    );
};