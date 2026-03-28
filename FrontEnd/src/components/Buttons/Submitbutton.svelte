<script lang="ts">
	let { text = 'button', loadingText = 'loading...', isProcessing = false } = $props();
</script>

<button class="btn-primary" type="submit">
	{#if isProcessing}
		<span class="size-3.5 animate-spin rounded-full border-2 border-zinc-600 border-t-white"></span>
		{loadingText}
	{:else}
		{text}
	{/if}
</button>
