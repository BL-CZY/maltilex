<script lang="ts">
	let { form } = $props();
	import SearchEntry from '$lib/search-entry.svelte';
	import { onMount } from 'svelte';
	import type { SearchResultEntry } from './+page.server.js';

	let entries: Array<SearchResultEntry> = $state([]);

	onMount(() => {
		if (form?.result) {
			entries.push(...form.result);
		}
	});
</script>

{#each entries as entry}
	<SearchEntry word={entry.word} pos={entry.pos} matched={entry.matched} en={entry.en} />
{/each}

<p>askdjask</p>
