import { useState } from 'react';
import { TaskProvider } from './context/TaskProvider';
import { useTaskContext } from './hooks/useTaskContext';
import { Header } from './components/Header';
import { TaskStats } from './components/TaskStats';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import './App.scss';

const AppContent = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const { editingTask, resetTasks } = useTaskContext();

    return (
        <div className="app-wrapper" data-theme={isDarkTheme ? 'dark' : 'light'}>
            <div className="app-container">
                <Header
                    isDark={isDarkTheme}
                    onToggleTheme={() => setIsDarkTheme((prev) => !prev)}
                />
                <main className="main-content">
                    <TaskStats />
                    <TaskForm key={editingTask?.id ?? 'new'} />
                    <div className="app-toolbar">
                        <TaskFilters />
                        <button
                            type="button"
                            className="app-reset-btn"
                            onClick={resetTasks}
                        >
                            Скинути дані
                        </button>
                    </div>
                    <TaskList />
                </main>
            </div>
            <Toast />
        </div>
    );
};

function App() {
    return (
        <TaskProvider>
            <AppContent />
        </TaskProvider>
    );
}

export default App;