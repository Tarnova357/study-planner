import { createContext } from 'react';
import type { LoginCredentials, User } from '../types/auth';

export interface AuthContextValue {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);