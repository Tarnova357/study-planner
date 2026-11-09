import { TaskProvider } from './context/TaskProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { useTaskContext } from './hooks/useTaskContext';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { TaskStats } from './components/TaskStats';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import './App.scss';

const AppContent = () => {
    const { theme } = useTheme();
    const { editingTask, resetTasks } = useTaskContext();

    return (
        <div className="app-wrapper" data-theme={theme}>
            <div className="app-container">
                <Header />
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
        <ThemeProvider>
            <TaskProvider>
                <AppContent />
            </TaskProvider>
        </ThemeProvider>
    );
}

export default App;