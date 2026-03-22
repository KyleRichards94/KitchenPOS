<script lang="ts">
	import { goto } from "$app/navigation";
	import { logout } from "$lib/api/auth";

    

    function onlogout(){
        logout();
        goto('');
    }

</script>

<div class="min-h-screen font-mono p-8 flex flex-col gap-8 max-w-lg mx-auto">

    <button onclick={() => onlogout()}>Logout </button>

<p> YAY</p>
</div>