<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import Nav from '$lib/nav.svelte';
</script>

<Nav />
{@render children()}
