const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://dummyjson.com';

export function isAbortError(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'AbortError';
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText || 'Request failed'}`);
    }

    return (await response.json()) as T;
}

export const httpClient = {
    get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
        return request<T>(endpoint, { method: 'GET', signal });
    },

    post<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> {
        return request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            signal,
        });
    },

    patch<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> {
        return request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
            signal,
        });
    },

    delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
        return request<T>(endpoint, { method: 'DELETE', signal });
    },
};