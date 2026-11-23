import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isAbortError, setAuthToken } from '../api/httpClient';
import { authRepository } from '../repositories/authRepository';
import type { LoginCredentials, User } from '../types/auth';
import { AuthContext } from './AuthContext';

const ACCESS_TOKEN_STORAGE_KEY = 'study-planner-access-token';

function readStoredToken(): string | null {
    try {
        return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
        return null;
    }
}

function writeStoredToken(token: string | null): void {
    try {
        if (token) {
            window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
        } else {
            window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        }
    } catch {
        return;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(() => readStoredToken());
    const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(readStoredToken()));

    useEffect(() => {
        const storedToken = readStoredToken();
        if (!storedToken) {
            return;
        }

        const controller = new AbortController();
        setAuthToken(storedToken);

        authRepository
            .getMe(controller.signal)
            .then((currentUser) => {
                setAccessToken(storedToken);
                setUser(currentUser);
            })
            .catch((error: unknown) => {
                if (isAbortError(error)) return;
                writeStoredToken(null);
                setAuthToken(null);
                setAccessToken(null);
                setUser(null);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, []);

    const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authRepository.login(credentials);
            setAuthToken(response.accessToken);
            writeStoredToken(response.accessToken);
            setAccessToken(response.accessToken);

            const currentUser = await authRepository.getMe();
            setUser(currentUser);
        } catch (error) {
            writeStoredToken(null);
            setAuthToken(null);
            setAccessToken(null);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        writeStoredToken(null);
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