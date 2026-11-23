import { useState } from 'react';
import { Navigate, useLocation, useNavigate, type Location } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, type LoginFormData } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';
import './LoginPage.scss';

interface LoginLocationState {
    from?: Location;
}

export const LoginPage = () => {
    const { isAuthenticated, login } = useAuth();
    const { showToast } = useTaskContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const state = location.state as LoginLocationState | null;
    const redirectTo = state?.from
        ? `${state.from.pathname}${state.from.search}`
        : '/profile';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    const onSubmit = async (data: LoginFormData) => {
        setSubmitError(null);
        try {
            await login(data);
            showToast('Вхід виконано успішно', 'success');
            navigate(redirectTo, { replace: true });
        } catch (err: unknown) {
            setSubmitError(
                err instanceof Error ? err.message : 'Не вдалося виконати вхід'
            );
        }
    };

    return (
        <section className="login-page">
            <div className="login-page__card">
                <h1 className="login-page__title">Вхід у Study Planner</h1>
                <p className="login-page__hint">
                    Тестові дані DummyJSON: <strong>emilys</strong> / <strong>emilyspass</strong>
                </p>

                {submitError && (
                    <div className="login-page__alert" role="alert">
                        {submitError}
                    </div>
                )}

                <form
                    className="login-page__form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="login-page__field">
                        <label className="login-page__label" htmlFor="login-username">
                            Username
                        </label>
                        <input
                            id="login-username"
                            type="text"
                            autoComplete="username"
                            className={`login-page__input ${
                                errors.username ? 'login-page__input--error' : ''
                            }`}
                            placeholder="emilys"
                            disabled={isSubmitting}
                            {...register('username')}
                        />
                        {errors.username && (
                            <span className="login-page__error">
                                {errors.username.message}
                            </span>
                        )}
                    </div>

                    <div className="login-page__field">
                        <label className="login-page__label" htmlFor="login-password">
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            className={`login-page__input ${
                                errors.password ? 'login-page__input--error' : ''
                            }`}
                            placeholder="••••••"
                            disabled={isSubmitting}
                            {...register('password')}
                        />
                        {errors.password && (
                            <span className="login-page__error">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="login-page__submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Вхід...' : 'Увійти'}
                    </button>
                </form>
            </div>
        </section>
    );
};