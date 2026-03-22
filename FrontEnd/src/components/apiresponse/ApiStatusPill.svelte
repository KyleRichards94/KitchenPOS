<script lang="ts">
	import { fetchMe } from "$lib/api/auth";
	import { healthCheck } from "$lib/api/client";
	import { onMount } from "svelte";

    // ── API health ────────────────────────────────────────────────
	let apiStatus = $state<'idle' | 'ok' | 'error'>('idle');
	let apiMessage = $state('');
    let apiUser = $state<string | null>(null);
	onMount(async () => {

        
        try {
            const h = await healthCheck();
			apiStatus = h.ok ? 'ok' : 'error';
			apiMessage = h.ok ? 'System Online' : 'Unexpected health response';
		} catch (e) {
            apiStatus = 'error';
			apiMessage =
            e instanceof ApiError
            ? `HTTP ${e.status} — server error`
            : 'Cannot reach API (is the server running?)';
		}
        try {
			const me = await fetchMe();
            console.log(me);
			apiUser = me?.name ?? null;
		} catch (e) {
			// 401 = not logged in, not a system error — just leave apiUser null
			if (!(e instanceof ApiError && e.status === 401)) {
				console.warn('Unexpected /me error:', e);
			}
		}
	});
</script>

<!-- API status pill -->
<div class="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border
    {apiStatus === 'ok'    ? 'border-emerald-700 bg-emerald-950 text-emerald-400' :
     apiStatus === 'error' ? 'border-red-800 bg-red-950 text-red-400' :
                            'border-zinc-700 bg-zinc-900 text-zinc-500'}">
    <span class="size-1.5 rounded-full
        {apiStatus === 'ok'    ? 'bg-emerald-400' :
         apiStatus === 'error' ? 'bg-red-400' : 'bg-zinc-500 animate-pulse'}">
    </span>
    {apiStatus === 'idle' ? 'Checking…' : apiMessage}

    {apiUser}
</div>