<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from "$app/navigation";
	import { logout } from "$lib/api/auth";
	import { GetUsers, type GetUsersResponse } from '$lib/api/client.users';


    let users = $state<GetUsersResponse[]>([]);

    onMount(async () => {
        try{
            const response = await GetUsers();
            users = response;
            console.log(response);
        } catch(err) {
            console.log(err)
        }
    });
    
    function onlogout(){
        logout();
        goto('/');
    }

</script>

<div class="font-mono p-2 ">

    <button onclick={() => onlogout()}>Logout </button>

    <hr />
    
    <p>Users </p>
    <div class="border rounded-lg overflow-hidden">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-zinc-800 bg-zinc-900">
                    <th class="text-left text-[10px] tracking-[0.15em] uppercase text-zinc-500 px-4 py-3">Name</th>
                    <th class="text-left text-[10px] tracking-[0.15em] uppercase text-zinc-500 px-4 py-3">Email</th>
                    <th class="text-left text-[10px] tracking-[0.15em] uppercase text-zinc-500 px-4 py-3">Role</th>
                    <th class="text-left text-[10px] tracking-[0.15em] uppercase text-zinc-500 px-4 py-3">Created</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user (user.id)}
                    <tr class="border-b  hover:bg-zinc-900/50 transition-colors">
                        <td class="px-4 py-3">{user.name}</td>
                        <td class="px-4 py-3 ">{user.email}</td>
                        <td class="px-4 py-3">
                            <span class="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border
                                {user.role === 'ADMIN'
                                    ? 'border-amber-700 bg-amber-950 text-amber-400'
                                    : 'border-zinc-700 bg-zinc-900 text-zinc-400'}">
                                {user.role}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-zinc-600 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                {/each}
                {#if users.length === 0}
                    <tr>
                        <td colspan="4" class="px-4 py-8 text-center text-zinc-600 text-xs">No users found</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
<p> YAY</p>
</div>