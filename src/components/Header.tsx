import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTaskContext } from '../hooks/useTaskContext';
import './Header.scss';

export const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, user, logout } = useAuth();
    const { showToast } = useTaskContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        showToast('Ви вийшли з облікового запису', 'info');
        navigate('/tasks');
    };

    return (
        <header className="header">
            <div className="header__brand">
                <Link to="/tasks" className="header__title">
                    Study Planner
                </Link>
            </div>

            <nav className="header__nav" aria-label="Головна навігація">
                <NavLink
                    to="/tasks"
                    className={({ isActive }) =>
                        `header__link ${isActive ? 'header__link--active' : ''}`
                    }
                >
                    Tasks
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `header__link ${isActive ? 'header__link--active' : ''}`
                    }
                >
                    Profile
                </NavLink>
            </nav>

            <div className="header__actions">
                {isAuthenticated ? (
                    <>
                        <span className="header__user">{user?.username}</span>
                        <button
                            type="button"
                            className="header__auth-btn header__auth-btn--logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="header__auth-btn">
                        Login
                    </Link>
                )}

                <button
                    type="button"
                    className="header__theme-btn"
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? 'Світла' : 'Темна'}
                </button>
            </div>
        </header>
    );
};