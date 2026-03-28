<script lang="ts">
	import { DeleteTag, parseApiError, type Tag } from '$lib';
	import type { ApiResult } from '$lib/api/client';
	import type { UUID } from 'crypto';
	import ApiMessageResponse from '../apiresponse/ApiMessageResponse.svelte';

	let { tag, onDelete }: { tag: Tag; onDelete: (id: string | UUID) => void } = $props();
	let result = $state<ApiResult>(null);

	async function handleDelete() {
		try {
			result = null;
			await DeleteTag(tag.id);
			onDelete(tag.id);
		} catch (err) {
			result = { ok: false, error: parseApiError(err) };
		}
	}
</script>

<div class="pill-container">
	<span class="tag-pill" style="--tag-color: {tag.color ?? '#6366f1'}">
		{tag.name}
		<button class="tag-delete" title="delete {tag.name}" onclick={handleDelete}>
			<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M1 1l6 6M7 1L1 7"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</span>

	<ApiMessageResponse {result} />
</div>

<style>
	.pill-container {
		display: inline-flex;
	}

	.tag-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--tag-color);
		background: color-mix(in srgb, var(--tag-color) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--tag-color) 20%, transparent);
		padding: 0.2rem 0.4rem 0.2rem 0.65rem;
		border-radius: 99px;
		letter-spacing: 0.01em;
		transition: background 0.15s ease;
	}

	.tag-delete {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		padding: 2px;
		border-radius: 99px;
		color: color-mix(in srgb, var(--tag-color) 60%, transparent);
		cursor: pointer;
		transition:
			color 0.15s ease,
			background 0.15s ease;
		line-height: 1;
	}

	.tag-delete:hover {
		color: var(--tag-color);
		background: color-mix(in srgb, var(--tag-color) 15%, transparent);
	}
</style>
