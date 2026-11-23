import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthProvider';
import { TaskProvider } from './context/TaskProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailsPage } from './pages/TaskDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <TaskProvider>
                        <Routes>
                            <Route element={<AppLayout />}>
                                <Route path="/" element={<Navigate to="/tasks" replace />} />
                                <Route path="/tasks" element={<TasksPage />} />
                                <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/profile" element={<ProfilePage />} />
                                </Route>
                                <Route path="*" element={<Navigate to="/tasks" replace />} />
                            </Route>
                        </Routes>
                    </TaskProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;