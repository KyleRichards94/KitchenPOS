<script lang="ts">
	import { onMount } from 'svelte';
	import ApiStatusPill from '../components/apiresponse/ApiStatusPill.svelte';
	import CreateUserForm from '../components/login/CreateUserForm.svelte';
	import UserLogin from '../components/login/UserLogin.svelte';
	import { fetchMe } from '$lib/api/auth';
	import { goto } from '$app/navigation';

	let loginPageType = $state<'none' | 'create' | 'login'>('none');
	onMount(async () => {
		try {
			await fetchMe();
			goto('/dashboard');
		} catch {
			// not logged in, stay on this page
		}
	});
</script>

<div class="min-h-screen font-mono p-8 flex flex-col gap-8 max-w-lg mx-auto">

	<!-- Header -->
	<header class="flex items-center justify-between border-b border-zinc-800 pb-4">
		<div>
			<p class="text-[10px] tracking-[0.25em] uppercase text-zinc-500">System</p>
			<h1 class="text-xl font-bold tracking-tight">Kitchen POS</h1>
		</div>
		<ApiStatusPill />	
	</header>
	{#if loginPageType === 'none'}
	<button onclick={() => loginPageType = 'login'}>
		Login
	</button>
	<button onclick={() => loginPageType = 'create'}>
		Create User
	</button>
	{:else if loginPageType === 'login'}
		<button onclick={() => loginPageType = 'none'}>
			back
		</button>
		<UserLogin />
	{:else}
		<button onclick={() => loginPageType = 'none'}>
			back
		</button>
		<CreateUserForm />
	{/if}


	<div class="border-t border-zinc-800"></div>
	
</div>
