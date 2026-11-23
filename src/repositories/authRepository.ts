import { httpClient } from '../api/httpClient';
import type { LoginCredentials, LoginResponse, User } from '../types/auth';

export const authRepository = {
    login(credentials: LoginCredentials): Promise<LoginResponse> {
        return httpClient.post<LoginResponse>('/auth/login', {
            username: credentials.username,
            password: credentials.password,
            expiresInMins: 60,
        });
    },

    getMe(signal?: AbortSignal): Promise<User> {
        return httpClient.get<User>('/auth/me', signal, true);
    },
};