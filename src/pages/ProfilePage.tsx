import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';
import './ProfilePage.scss';

export const ProfilePage = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { showToast } = useTaskContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        showToast('Ви вийшли з облікового запису', 'info');
        navigate('/login', { replace: true });
    };

    return (
        <section className="profile-page">
            <div className="profile-page__card">
                <div className="profile-page__header">
                    <h1 className="profile-page__title">Профіль користувача</h1>
                    <span className="profile-page__badge">
                        {isAuthenticated ? 'Авторизовано' : 'Гість'}
                    </span>
                </div>

                {user && (
                    <div className="profile-page__details">
                        <div className="profile-page__row">
                            <span className="profile-page__label">Username</span>
                            <span className="profile-page__value">{user.username}</span>
                        </div>
                        <div className="profile-page__row">
                            <span className="profile-page__label">Email</span>
                            <span className="profile-page__value">{user.email}</span>
                        </div>
                        <div className="profile-page__row">
                            <span className="profile-page__label">Ім’я</span>
                            <span className="profile-page__value">
                                {user.firstName} {user.lastName}
                            </span>
                        </div>
                    </div>
                )}

                <div className="profile-page__actions">
                    <button
                        type="button"
                        className="profile-page__logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </section>
    );
};