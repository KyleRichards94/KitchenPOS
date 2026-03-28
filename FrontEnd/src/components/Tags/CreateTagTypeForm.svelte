<script lang="ts">
	import ApimessageResponse from './../apiresponse/ApiMessageResponse.svelte';
	import {
		CreateTagType,
		type CreateTagTypeRequest,
		type CreateTagTypeResponse
	} from '$lib/api/client.tags';
	import { parseApiError, type ApiResult } from '$lib/api/client';
	import Submitbutton from '../Buttons/Submitbutton.svelte';

	let { onTagTypeCreated }: { onTagTypeCreated: (response: CreateTagTypeResponse) => void } =
		$props();

	let formRequest = $state<CreateTagTypeRequest>({ name: '', color: '#ffffff' });
	let tagTypeResponse = $state<CreateTagTypeResponse>();
	let submitting = $state<boolean>(false);
	let result = $state<ApiResult>(null);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		try {
			var response = await CreateTagType(formRequest);
			if (response) {
				tagTypeResponse = response;
				onTagTypeCreated(response);
			}
			result = null;
		} catch (err) {
			result = { ok: false, error: parseApiError(err) };
		} finally {
			submitting = false;
		}
	}
</script>

<section class="font-mono">
	<form onsubmit={handleSubmit}>
		<input type="text" bind:value={formRequest.name} name="tagTypeName" placeholder="TagType" />
		<input type="color" bind:value={formRequest.color} name="color" placeholder="#FFFFFF" />

		<Submitbutton text="Create Tag Type" loadingText="Creating..." isProcessing={submitting} />
	</form>

	{#if tagTypeResponse != null}
		<p>{tagTypeResponse.id}</p>
	{/if}

	<ApimessageResponse {result} />
</section>
