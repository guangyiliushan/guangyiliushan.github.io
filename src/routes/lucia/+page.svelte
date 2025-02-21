<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<sidebar>
	<h1> {data.user.username} </h1>
	<p> {data.user.id} </p>
	<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
	</form>
</sidebar>
