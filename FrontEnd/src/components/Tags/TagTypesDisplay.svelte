<script lang="ts">
	import {
		DeleteTagType,
		GetTagTypes,
		parseApiError,
		type ApiResult,
		type CreateTagResponse,
		type CreateTagTypeResponse,
		type GetTagTypesResponse
	} from '$lib';
	import { onMount } from 'svelte';
	import ApiMessageResponse from '../apiresponse/ApiMessageResponse.svelte';
	import CreateTagFromTypeForm from './CreateTagFromTypeForm.svelte';
	import type { UUID } from 'crypto';
	import CreateTagTypeForm from './CreateTagTypeForm.svelte';
	import TagPill from './TagPill.svelte';

	let tagTypes = $state<GetTagTypesResponse[]>([]);
	let result = $state<ApiResult>(null);
	let deleteResult = $state<ApiResult>(null);
	let loading = $state(false);

	onMount(async () => {
		loading = true;
		try {
			const response = await GetTagTypes();
			tagTypes = response;
		} catch (err) {
			result = { ok: false, error: parseApiError(err) };
		} finally {
			loading = false;
		}
	});

	async function handleAppendTagToType(tagType: GetTagTypesResponse, tag: CreateTagResponse) {
		tagTypes.map((tt) =>
			tt.id == tagType.id
				? (tt.tags = [
						...tt.tags,
						{
							name: tag.name,
							id: tag.id,
							createdAt: tag.createdAt,
							updatedAt: tag.updatedAt,
							color: tag.color,
							tagTypeId: tag.tagTypeId
						}
					])
				: tt
		);
	}

	function handleTagTypeCreated(tagType: CreateTagTypeResponse) {
		tagTypes = [
			...tagTypes,
			{
				tags: [],
				name: tagType.name,
				id: tagType.id,
				createdAt: tagType.createdAt,
				updatedAt: tagType.updatedAt,
				color: tagType.color
			}
		];
	}

	function handleDeleteTagFromType(tagType: GetTagTypesResponse, tagid: string | UUID) {
		tagTypes = tagTypes.map((tt) =>
			tt.id === tagType.id ? { ...tt, tags: tt.tags.filter((t) => t.id !== tagid) } : tt
		);
	}

	async function handleDeleteTagType(tagTypeID: string | UUID) {
		try {
			deleteResult = null;
			await DeleteTagType(tagTypeID);
			try {
				result = null;
				const response = await GetTagTypes();
				tagTypes = response;
			} catch (err) {
				result = { ok: false, error: parseApiError(err) };
			}
		} catch (err) {
			console.error('caught:', err);
			deleteResult = { ok: false, error: parseApiError(err) };
		} finally {
			console.log('HUH');
		}
	}
</script>

<section class="tag-section">
	<CreateTagTypeForm onTagTypeCreated={(response) => handleTagTypeCreated(response)} />

	{#if loading}
		<div class="loading-state">
			<span class="loader" />
			<p>Loading tags…</p>
		</div>
	{:else if tagTypes.length > 0}
		<div class="cards-grid">
			{#each tagTypes as tagType (tagType.id)}
				<div class="tag-card">
					<!-- Card Header -->
					<div class="card-header" style="--type-color: {tagType.color ?? '#6366f1'}">
						<div class="header-accent" />
						<div class="header-content">
							<span class="type-dot" />
							<h3 class="type-name">{tagType.name}</h3>
							<span class="tag-count">{tagType.tags.length}</span>
							<button
								class="tag-delete bg-red-600"
								title="delete {tagType.name} and its tags."
								onclick={async () => await handleDeleteTagType(tagType.id)}
							>
								X
							</button>
						</div>
					</div>

					<!-- Tags -->
					<div class="tags-body">
						{#if tagType.tags.length > 0}
							<div class="tags-list">
								{#each tagType.tags as tag (tag.id)}
									<TagPill {tag} onDelete={(id) => handleDeleteTagFromType(tagType, id)} />
								{/each}
							</div>
						{:else}
							<p class="empty-tags">No tags yet — add one below.</p>
						{/if}
					</div>

					<!-- Divider -->
					<div class="card-divider" />

					<!-- Create Tag Form -->
					<div class="card-footer">
						<CreateTagFromTypeForm
							baseColor={tagType.color}
							tagTypeID={tagType.id}
							onTagCreated={(response) => handleAppendTagToType(tagType, response)}
						/>

						<ApiMessageResponse result={deleteResult} />
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p>No tag types found.</p>
		</div>
	{/if}

	<ApiMessageResponse {result} />
</section>

<style>
	/* ── Layout ── */
	.tag-section {
		padding: 1.5rem;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	/* ── Card ── */
	.tag-card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 14px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.06),
			0 1px 2px rgba(0, 0, 0, 0.04);
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.tag-card:hover {
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.09);
		transform: translateY(-2px);
	}

	/* ── Card Header ── */
	.card-header {
		position: relative;
		padding: 1rem 1.25rem 0.875rem;
		overflow: hidden;
	}

	.header-accent {
		position: absolute;
		inset: 0;
		background: color-mix(in srgb, var(--type-color) 10%, transparent);
		border-bottom: 2px solid color-mix(in srgb, var(--type-color) 25%, transparent);
	}

	.header-content {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.type-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--type-color);
		flex-shrink: 0;
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--type-color) 20%, transparent);
	}

	.type-name {
		font-size: 0.9rem;
		font-weight: 650;
		color: #111827;
		letter-spacing: -0.01em;
		flex: 1;
		margin: 0;
	}

	.tag-count {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--type-color);
		background: color-mix(in srgb, var(--type-color) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--type-color) 25%, transparent);
		padding: 0.15rem 0.5rem;
		border-radius: 99px;
		letter-spacing: 0.02em;
	}

	.tag-delete {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.15rem 0.5rem;
		border-radius: 99px;
		letter-spacing: 0.02em;
	}

	/* ── Tags Body ── */
	.tags-body {
		padding: 0.875rem 1.25rem;
		flex: 1;
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.empty-tags {
		font-size: 0.78rem;
		color: #9ca3af;
		font-style: italic;
		margin: 0;
	}

	/* ── Divider ── */
	.card-divider {
		height: 1px;
		background: #f3f4f6;
		margin: 0 1.25rem;
	}

	/* ── Footer (Create Form) ── */
	.card-footer {
		padding: 0.875rem 1.25rem;
	}

	/* ── States ── */
	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 3rem;
		color: #9ca3af;
		font-size: 0.875rem;
	}

	.loader {
		width: 22px;
		height: 22px;
		border: 2px solid #e5e7eb;
		border-top-color: #6366f1;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
