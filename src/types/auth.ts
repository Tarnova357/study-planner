export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse extends User {
    accessToken: string;
    refreshToken: string;
}