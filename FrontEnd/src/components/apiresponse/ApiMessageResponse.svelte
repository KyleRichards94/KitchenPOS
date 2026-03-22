<script lang="ts">
	import type { ApiResult } from "$lib/api/client";

    let { result }: { result: ApiResult } = $props();

    const status = $derived(
        result === null ? 'idle' : result.ok ? 'ok' : 'error'
    );

    const message = $derived(
        result === null ? '' :
        result.ok
            ? (result.message ?? 'Success')
            : (result.error  ?? 'Something went wrong')
    );
</script>

{#if status !== 'idle'}
    <p class="mt-3 text-xs px-3 py-2 rounded border
        {status === 'ok'
            ? 'border-emerald-800 bg-emerald-950 text-emerald-400'
            : 'border-red-800 bg-red-950 text-red-400'}">
        {message}
    </p>
{/if}