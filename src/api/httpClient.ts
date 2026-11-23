const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://dummyjson.com';

let accessToken: string | null = null;

export function setAuthToken(token: string | null): void {
    accessToken = token;
}

export function getAuthToken(): string | null {
    return accessToken;
}

export function isAbortError(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'AbortError';
}

interface HttpRequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

async function request<T>(endpoint: string, options: HttpRequestOptions = {}): Promise<T> {
    const { requiresAuth = false, headers: customHeaders, ...fetchOptions } = options;
    const url = `${BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(customHeaders as Record<string, string>),
    };

    if (requiresAuth) {
        if (!accessToken) {
            throw new Error('Необхідна авторизація для виконання цієї дії');
        }
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `HTTP error ${response.status}: ${response.statusText || 'Request failed'}`;
        try {
            const errorBody = (await response.json()) as { message?: string };
            if (errorBody.message) {
                errorMessage = errorBody.message;
            }
        } catch { /* empty */ }
        throw new Error(errorMessage);
    }

    return (await response.json()) as T;
}

export const httpClient = {
    get<T>(endpoint: string, signal?: AbortSignal, requiresAuth = false): Promise<T> {
        return request<T>(endpoint, { method: 'GET', signal, requiresAuth });
    },

    post<T>(endpoint: string, body: unknown, signal?: AbortSignal, requiresAuth = false): Promise<T> {
        return request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            signal,
            requiresAuth,
        });
    },

    patch<T>(endpoint: string, body: unknown, signal?: AbortSignal, requiresAuth = false): Promise<T> {
        return request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
            signal,
            requiresAuth,
        });
    },

    delete<T>(endpoint: string, signal?: AbortSignal, requiresAuth = false): Promise<T> {
        return request<T>(endpoint, { method: 'DELETE', signal, requiresAuth });
    },
};