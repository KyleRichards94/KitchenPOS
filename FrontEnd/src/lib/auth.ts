import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'kitchenpos_auth_token';

function readStored(): string | null {
	if (!browser) return null;
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw ? raw : null;
}

export const authToken = writable<string | null>(readStored());

export function setAuthToken(token: string | null): void {
	authToken.set(token);
	if (browser) {
		if (token) localStorage.setItem(STORAGE_KEY, token);
		else localStorage.removeItem(STORAGE_KEY);
	}
}

