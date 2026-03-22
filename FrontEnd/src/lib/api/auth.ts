import { apiFetch } from './client';
import { setAuthToken } from '$lib/auth';

export type UserRole = 'ADMIN' | 'STAFF';

export type AuthUser = {
	id: string;
	email: string;
	name: string;
	role: UserRole;
};

export type LoginResponse = {
	token: string;
	user: AuthUser;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
	const data = await apiFetch<LoginResponse>('/auth/login', "POST", {
		skipAuth: true,
		body: JSON.stringify({ email, password }),
	});
	setAuthToken(data.token);
	return data;
}

export function logout(): void {
	setAuthToken(null);
}

export type MeResponse = {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	createdAt: string;
	updatedAt: string;
};

export async function fetchMe(): Promise<MeResponse> {
	return apiFetch<MeResponse>('/auth/me', "GET");
}
