import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Toast } from '../components/Toast';
import { useTheme } from '../hooks/useTheme';
import './AppLayout.scss';

export const AppLayout = () => {
    const { theme } = useTheme();

    return (
        <div className="app-layout" data-theme={theme}>
            <div className="app-layout__container">
                <Header />
                <main className="app-layout__main">
                    <Outlet />
                </main>
            </div>
            <Toast />
        </div>
    );
};