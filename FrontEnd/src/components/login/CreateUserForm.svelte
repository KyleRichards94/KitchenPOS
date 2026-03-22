
<script lang="ts">
	import { goto } from "$app/navigation";
	import { CreateUser, login, parseApiError, type ApiResult } from "$lib/api";
	import type { UserRole } from "$lib/api/auth";
	import ApimessageRespose from "../apiresponse/ApiMessageResponse.svelte";

    let email    = $state('');
    let password = $state('');
    let name     = $state('');
    let role     = $state<UserRole>('STAFF');
    let loading  = $state(false);
    let result = $state<ApiResult>(null);
    let canlogin = false
    async function handleCreate(e: SubmitEvent) {
        e.preventDefault();
        loading = true;
		canlogin = false;
        try {
            const raw = await CreateUser(email, password, name, role);
            if (raw.ok) { 
				email = password = name = ''; role = 'STAFF'; 
			}
			canlogin = true;
			if(canlogin){
				try{
					await login(email, password);
					goto('/dashboard');
				} catch (err){
					result = { ok: false, error: parseApiError(err) };
				}
			}
        } catch (err) {
			result = { ok: false, error: parseApiError(err) };
        } finally{
			loading = false;
        }
    }

</script>

<div class="min-h-screen font-mono p-8 flex flex-col gap-8 max-w-lg mx-auto">
	<!-- Create User -->
	<section>
		<h2 class="text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Create User</h2>
		<form onsubmit={handleCreate} class="flex flex-col gap-2">
			<input class="input" type="text"     bind:value={name}     placeholder="full name"  required />
			<input class="input" type="email"    bind:value={email}    placeholder="email"      required />
			<input class="input" type="password" bind:value={password} placeholder="password"   required />
			<select class="input" bind:value={role}>
				<option value="ADMIN">Admin</option>
				<option value="STAFF">Staff</option>
			</select>
			<button class="btn-primary mt-1 flex items-center justify-center gap-2" type="submit" disabled={loading}>
				{#if loading}
					<span class="size-3.5 rounded-full border-2 border-zinc-600 border-t-white animate-spin"></span>
					Creating…
				{:else}
					Create user →
				{/if}
			</button>
		</form>

		<ApimessageRespose {result} />

	</section>

</div>