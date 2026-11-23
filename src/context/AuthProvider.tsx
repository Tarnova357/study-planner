import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { setAuthToken } from '../api/httpClient';
import { authRepository } from '../repositories/authRepository';
import type { LoginCredentials, User } from '../types/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authRepository.login(credentials);
            setAuthToken(response.accessToken);
            setAccessToken(response.accessToken);

            const currentUser = await authRepository.getMe();
            setUser(currentUser);
        } catch (error) {
            setAuthToken(null);
            setAccessToken(null);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setAuthToken(null);
        setAccessToken(null);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            accessToken,
            isAuthenticated: Boolean(accessToken && user),
            isLoading,
            login,
            logout,
        }),
        [user, accessToken, isLoading, login, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};