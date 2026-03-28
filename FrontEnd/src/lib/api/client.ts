import { get } from 'svelte/store';
import { PUBLIC_API_URL } from '$env/static/public';
import { authToken } from '$lib/auth';

const baseUrl = (PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export class ApiError extends Error {
	constructor(
		public status: number,
		public body: unknown,
		message?: string
	) {
		super(message ?? `HTTP ${status}`);
		this.name = 'ApiError';
	}
}

export enum ApiRequest {
	GET = "GET",
	PUT = "PUT",
	POST = "POST",
	DELETE = "DELETE"
}

export type ApiFetchOptions = RequestInit & { skipAuth?: boolean };

export type ApiResult = {
	ok: boolean;
	message?: string;
	error?: string;
} | null;

/**
 * JSON `fetch` to the Express API. Sends `Authorization: Bearer` when a token exists,
 * unless `skipAuth` is true (e.g. login).
 */
export async function apiFetch<T>(path: string, method: ApiRequest, init: ApiFetchOptions = {}): Promise<T> {
	const { skipAuth = false, ...rest } = init;
	const headers = new Headers(rest.headers);

	const hasBody = rest.body !== undefined && rest.body !== null;
	if (hasBody && !headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json');
	}

	const token = skipAuth ? null : get(authToken);

	if (token) headers.set('Authorization', `Bearer ${token}`);
	console.log(token);

	const url = path.startsWith('http')
		? path
		: `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

	const res = await fetch(url, { ...rest, method, headers });

	if (!res.ok) {
		let body: unknown;
		try {
			body = await res.json();
		} catch {
			body = await res.text();
		}
		throw new ApiError(res.status, body);
	}

	if (res.status === 204) return undefined as T;

	const text = await res.text();
	if (!text) return undefined as T;
	return JSON.parse(text) as T;
}

/** GET `/health` — no auth. */
export async function healthCheck(): Promise<{ ok: boolean }> {
	return apiFetch<{ ok: boolean }>('/health', 'GET');
}

export function parseApiError(err: unknown): string {
	if (!(err instanceof ApiError)) {
		return err instanceof Error ? err.message : 'Unknown error';
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const body = err.body as any;

	// Zod flatten() shape: { formErrors, fieldErrors }
	if (body?.error?.fieldErrors) {
		return Object.entries(body.error.fieldErrors)
			.map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
			.join('\n');
	}

	// Simple string error e.g. 409 "A user with that email already exists"
	if (typeof body?.error === 'string') return body.error;

	return `HTTP ${err.status}`;
}