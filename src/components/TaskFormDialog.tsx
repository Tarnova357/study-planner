import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task } from '../types/task';
import { taskSchema, type TaskFormData } from '../schemas/taskSchema';
import './TaskFormDialog.scss';

export interface TaskFormDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    task?: Task;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => Promise<void>;
}

export const TaskFormDialog = ({
                                   open,
                                   mode,
                                   task,
                                   onClose,
                                   onSubmit,
                               }: TaskFormDialogProps) => {
    const titleId = useId();
    const isEditing = mode === 'edit';

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            priority: 'medium',
        },
    });

    useEffect(() => {
        if (!open) return;

        reset({
            title: isEditing && task ? task.title : '',
            description: isEditing && task ? task.description : '',
            category: isEditing && task ? task.category : '',
            priority: isEditing && task ? task.priority : 'medium',
        });

        const frameId = window.requestAnimationFrame(() => {
            setFocus('title');
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [open, isEditing, task, reset, setFocus]);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSubmitting) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, isSubmitting, onClose]);

    if (!open) return null;

    const handleFormSubmit = async (data: TaskFormData) => {
        await onSubmit({
            ...data,
            category: data.category.trim() || 'General',
        });
    };

    return (
        <div
            className="task-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={() => {
                if (!isSubmitting) onClose();
            }}
        >
            <div
                className="task-dialog__modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="task-dialog__header">
                    <h2 id={titleId} className="task-dialog__title">
                        {isEditing ? 'Редагувати завдання' : 'Нове завдання'}
                    </h2>
                    <button
                        type="button"
                        className="task-dialog__close-btn"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Закрити діалог"
                    >
                        ×
                    </button>
                </div>

                <form
                    className="task-dialog__form"
                    onSubmit={handleSubmit(handleFormSubmit)}
                    noValidate
                >
                    <div className="task-dialog__field">
                        <label className="task-dialog__label" htmlFor="task-title">
                            Назва *
                        </label>
                        <input
                            id="task-title"
                            className={`task-dialog__input ${
                                errors.title ? 'task-dialog__input--error' : ''
                            }`}
                            placeholder="Введіть назву завдання"
                            disabled={isSubmitting}
                            {...register('title')}
                        />
                        {errors.title && (
                            <span className="task-dialog__error">
                                {errors.title.message}
                            </span>
                        )}
                    </div>

                    <div className="task-dialog__field">
                        <label className="task-dialog__label" htmlFor="task-description">
                            Опис
                        </label>
                        <textarea
                            id="task-description"
                            className={`task-dialog__textarea ${
                                errors.description ? 'task-dialog__input--error' : ''
                            }`}
                            placeholder="Додайте опис завдання"
                            rows={3}
                            disabled={isSubmitting}
                            {...register('description')}
                        />
                        {errors.description && (
                            <span className="task-dialog__error">
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    <div className="task-dialog__row">
                        <div className="task-dialog__field">
                            <label className="task-dialog__label" htmlFor="task-category">
                                Категорія
                            </label>
                            <input
                                id="task-category"
                                className={`task-dialog__input ${
                                    errors.category ? 'task-dialog__input--error' : ''
                                }`}
                                placeholder="General"
                                disabled={isSubmitting}
                                {...register('category')}
                            />
                            {errors.category && (
                                <span className="task-dialog__error">
                                    {errors.category.message}
                                </span>
                            )}
                        </div>

                        <div className="task-dialog__field">
                            <label className="task-dialog__label" htmlFor="task-priority">
                                Пріоритет
                            </label>
                            <select
                                id="task-priority"
                                className="task-dialog__select"
                                disabled={isSubmitting}
                                {...register('priority')}
                            >
                                <option value="low">Низький</option>
                                <option value="medium">Середній</option>
                                <option value="high">Високий</option>
                            </select>
                        </div>
                    </div>

                    <div className="task-dialog__actions">
                        <button
                            type="button"
                            className="task-dialog__btn task-dialog__btn--secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="task-dialog__btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Збереження...'
                                : isEditing
                                    ? 'Зберегти зміни'
                                    : 'Створити'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};