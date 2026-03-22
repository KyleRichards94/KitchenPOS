<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { fetchMe } from '$lib/api/auth';
	import { goto } from '$app/navigation';

	let { children } = $props();

	onMount(async () => {
		try {
			await fetchMe();
		} catch {
			goto('/'); // boot to login if no valid session
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
