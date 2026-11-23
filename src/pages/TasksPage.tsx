import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import type { FilterType, PriorityFilterType } from '../types/task.ts';
import type { TaskFormData } from '../schemas/taskSchema.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { useTaskContext } from '../hooks/useTaskContext.ts';
import { TaskStats } from '../components/TaskStats.tsx';
import { TaskFilters } from '../components/TaskFilters.tsx';
import { TaskList } from '../components/TaskList.tsx';
import { Pagination } from '../components/Pagination.tsx';
import { TaskFormDialog } from '../components/TaskFormDialog.tsx';
import './TasksPage.scss';

const VALID_STATUSES: FilterType[] = ['all', 'completed', 'uncompleted'];
const VALID_PRIORITIES: PriorityFilterType[] = ['all', 'low', 'medium', 'high'];

export const TasksPage = () => {
    const { isAuthenticated } = useAuth();
    const { addTask, showToast } = useTaskContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const statusParam = searchParams.get('status') as FilterType | null;
    const priorityParam = searchParams.get('priority') as PriorityFilterType | null;

    const status: FilterType =
        statusParam && VALID_STATUSES.includes(statusParam) ? statusParam : 'all';
    const priority: PriorityFilterType =
        priorityParam && VALID_PRIORITIES.includes(priorityParam) ? priorityParam : 'all';

    const updateQueryParam = (key: 'status' | 'priority', value: string) => {
        const next = new URLSearchParams(searchParams);
        if (value === 'all') {
            next.delete(key);
        } else {
            next.set(key, value);
        }
        setSearchParams(next, { replace: true });
    };

    const handleOpenCreate = () => {
        if (!isAuthenticated) {
            showToast('Увійдіть, щоб створити нове завдання', 'info');
            navigate('/login', { state: { from: location } });
            return;
        }
        setIsCreateOpen(true);
    };

    const handleCreateSubmit = async (data: TaskFormData) => {
        const created = await addTask(data);
        if (created) {
            setIsCreateOpen(false);
        }
    };

    return (
        <section className="tasks-page">
            <TaskStats />

            <div className="tasks-page__toolbar">
                <TaskFilters
                    status={status}
                    priority={priority}
                    onStatusChange={(nextStatus) => updateQueryParam('status', nextStatus)}
                    onPriorityChange={(nextPriority) =>
                        updateQueryParam('priority', nextPriority)
                    }
                />

                <button
                    type="button"
                    className="tasks-page__add-btn"
                    onClick={handleOpenCreate}
                    aria-label="Створити завдання"
                    title="Створити завдання"
                >
                    +
                </button>
            </div>

            <TaskList status={status} priority={priority} />
            <Pagination />

            <TaskFormDialog
                open={isCreateOpen}
                mode="create"
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
            />
        </section>
    );
};