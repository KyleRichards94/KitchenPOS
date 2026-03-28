<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/api/auth';
	import { parseApiError, type ApiResult } from '$lib/api/client';
	import ApimessageRespose from '../apiresponse/ApiMessageResponse.svelte';
	import Submitbutton from '../Buttons/Submitbutton.svelte';

	let username = $state('');
	let password = $state('');
	let loading = $state(false);
	let result = $state<ApiResult>(null);

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		loading = true;

		try {
			await login(username, password);
			goto('/dashboard');
		} catch (err) {
			result = { ok: false, error: parseApiError(err) };
		} finally {
			loading = false;
		}
	}
</script>

<section>
	<h2 class="mb-3 text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Login</h2>
	<form onsubmit={handleLogin} class="flex flex-col gap-2">
		<input class="input" type="email" bind:value={username} name="email" placeholder="email" />
		<input
			class="input"
			type="password"
			bind:value={password}
			name="password"
			placeholder="password"
		/>

		<Submitbutton text="Sign in →" loadingText="Authenticating..." isProcessing={loading} />
	</form>

	<ApimessageRespose {result} />
</section>
