import type { UserRole } from "./auth";
import { apiFetch } from "./client";

export type GetUsersResponse = {
	createdAt: string,
	email: string,
	id: string,
	name: string,
	role: UserRole,
	updatedAt: string,

}

export async function CreateUser(email: string, password: string, name: string, role: UserRole): Promise<{ ok: boolean }> {
	return apiFetch<{ ok: boolean }>('/users/', 'POST', { body: JSON.stringify({ email, password, name, role }) });
}

export async function GetUsers(): Promise<GetUsersResponse[]> {
	return apiFetch<GetUsersResponse[]>('/users/', 'GET', { skipAuth: false });
}

export async function GetUser(id: string): Promise<{ ok: boolean }> {
	return apiFetch<{ ok: boolean }>('/users/' + id, 'GET', { skipAuth: false });
}
