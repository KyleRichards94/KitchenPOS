import type { UserRole } from "./auth";
import { apiFetch } from "./client";

export async function CreateUser(email: string, password: string, name: string, role: UserRole): Promise<{ ok: boolean }> {
	return apiFetch<{ ok: boolean }>('/users/', 'POST', { body: JSON.stringify({ email, password, name, role }) });
}

export async function GetUsers(): Promise<{ ok: boolean }> {
	return apiFetch<{ ok: boolean }>('/users/', 'GET', { skipAuth: false });
}

export async function GetUser(id: string): Promise<{ ok: boolean }> {
	return apiFetch<{ ok: boolean }>('/users/' + id, 'GET', { skipAuth: false });
}
