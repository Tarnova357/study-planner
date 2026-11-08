import { useContext } from 'react';
import { TaskContext, type TaskContextValue } from '../context/TaskContext';

export function useTaskContext(): TaskContextValue {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext має використовуватися всередині TaskProvider');
    }
    return context;
}