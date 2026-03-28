<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/api/auth';
	import { GetUsers, type GetUsersResponse } from '$lib/api/client.users';
	import CreateTagTypeForm from '../../components/Tags/CreateTagTypeForm.svelte';
	import TagTypes from '../../components/Tags/TagTypesDisplay.svelte';

	let users = $state<GetUsersResponse[]>([]);

	onMount(async () => {
		try {
			const response = await GetUsers();
			users = response;
			console.log(response);
		} catch (err) {
			console.log(err);
		}
	});

	function onlogout() {
		logout();
		goto('/');
	}
</script>

<div class="p-2 font-mono">
	<button onclick={() => onlogout()}>Logout </button>

	<hr />

	<p>Users</p>
	<div class="overflow-hidden rounded-lg border">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-zinc-800 bg-zinc-900">
					<th class="px-4 py-3 text-left text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
						>Name</th
					>
					<th class="px-4 py-3 text-left text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
						>Email</th
					>
					<th class="px-4 py-3 text-left text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
						>Role</th
					>
					<th class="px-4 py-3 text-left text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
						>Created</th
					>
				</tr>
			</thead>
			<tbody>
				{#each users as user (user.id)}
					<tr class="border-b transition-colors hover:bg-zinc-900/50">
						<td class="px-4 py-3">{user.name}</td>
						<td class="px-4 py-3">{user.email}</td>
						<td class="px-4 py-3">
							<span
								class="rounded border px-2 py-0.5 text-[10px] tracking-wider uppercase
                                {user.role === 'ADMIN'
									? 'border-amber-700 bg-amber-950 text-amber-400'
									: 'border-zinc-700 bg-zinc-900 text-zinc-400'}"
							>
								{user.role}
							</span>
						</td>
						<td class="px-4 py-3 text-xs text-zinc-600"
							>{new Date(user.createdAt).toLocaleDateString()}</td
						>
					</tr>
				{/each}
				{#if users.length === 0}
					<tr>
						<td colspan="4" class="px-4 py-8 text-center text-xs text-zinc-600">No users found</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	<hr />

	<TagTypes />
</div>
