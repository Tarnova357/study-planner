import { useState } from 'react';
import type {Task} from './types/task';
import { initialTasks } from './data/initialTasks';
import { Header } from './components/Header';
import { TaskStats } from './components/TaskStats';
import { TaskForm } from './components/TaskForm';
import { TaskFilters, type FilterType } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import './App.scss';

function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [filter, setFilter] = useState<FilterType>('all');
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const addTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: Date.now(),
            completed: false,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const toggleTask = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: number) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'uncompleted') return !task.completed;
        return true;
    });

    return (
        <div className="app-wrapper" data-theme={isDarkTheme ? 'dark' : 'light'}>
            <div className="app-container">
                <Header isDark={isDarkTheme} onToggleTheme={() => setIsDarkTheme(!isDarkTheme)} />
                <main className="main-content">
                    <TaskStats tasks={tasks} />
                    <TaskForm onAdd={addTask} />
                    <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
                    <TaskList
                        tasks={filteredTasks}
                        currentFilter={filter}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                </main>
            </div>
        </div>
    );
}

export default App;