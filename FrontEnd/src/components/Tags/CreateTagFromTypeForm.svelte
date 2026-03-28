<script lang="ts">
	import Submitbutton from './../Buttons/Submitbutton.svelte';
	import ApiMessageResponse from './../apiresponse/ApiMessageResponse.svelte';
	import {
		CreateTag,
		parseApiError,
		type ApiResult,
		type CreateTagRequest,
		type CreateTagResponse
	} from '$lib';

	let {
		tagTypeID,
		baseColor,
		onTagCreated
	}: {
		tagTypeID: string;
		baseColor: string | null;
		onTagCreated: (response: CreateTagResponse) => void;
	} = $props();

	let submitting = $state<boolean>(false);
	let result = $state<ApiResult>(null);
	let request = $state<CreateTagRequest>({ name: '', color: baseColor, tagTypeId: tagTypeID });

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;

		try {
			let response = await CreateTag(request);
			result = null;
			request.name = '';
			request.color = baseColor;
			onTagCreated(response);
		} catch (err) {
			result = { ok: false, error: parseApiError(err) };
		} finally {
			submitting = false;
		}
	}
</script>

<section style="padding: 0.75rem 1rem; border-top: 0.5px solid var(--color-border-tertiary);">
	<form onsubmit={handleSubmit} style="display: flex; align-items: center; gap: 8px;">
		<input type="text" bind:value={request.name} name="tagTypeName" placeholder="New tag type…" />

		<div style="position: relative; flex-shrink: 0;">
			<input
				type="color"
				bind:value={request.color}
				name="color"
				style="
					width: 36px;
					height: 36px;
					padding: 2px;
					border-radius: var(--border-radius-md);
					border: 0.5px solid var(--color-border-secondary);
					cursor: pointer;
					background: none;
				"
			/>
		</div>

		<Submitbutton text="Add" loadingText="…" isProcessing={submitting} />
	</form>

	<ApiMessageResponse {result} />
</section>
