import { useState, type FormEvent } from 'react';
import type { Priority } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskForm.scss';

export const TaskForm = () => {
    const { editingTask, addTask, updateTask, cancelEditing } = useTaskContext();
    const isEditing = editingTask !== null;

    const [title, setTitle] = useState(editingTask?.title ?? '');
    const [description, setDescription] = useState(editingTask?.description ?? '');
    const [category, setCategory] = useState(editingTask?.category ?? '');
    const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const payload = {
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            priority,
        };

        if (isEditing) {
            updateTask(editingTask.id, payload);
            return;
        }

        addTask(payload);
        if (payload.title) {
            setTitle('');
            setDescription('');
            setCategory('');
            setPriority('medium');
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            {isEditing && (
                <div className="task-form__heading">
                    Редагування завдання: <strong>{editingTask.title}</strong>
                </div>
            )}
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

            <div className="task-form__actions">
                <button className="task-form__btn" type="submit">
                    {isEditing ? 'Зберегти зміни' : 'Додати'}
                </button>
                {isEditing && (
                    <button
                        className="task-form__btn task-form__btn--secondary"
                        type="button"
                        onClick={cancelEditing}
                    >
                        Скасувати
                    </button>
                )}
            </div>
        </form>
    );
};