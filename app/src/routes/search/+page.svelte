<script lang="ts">
    let { form } = $props();
    import SearchEntry from '$lib/search-entry.svelte';
    import { onMount } from 'svelte';
    import type { Query, SearchResultEntry } from '$lib/search-types';

    let entries: Array<SearchResultEntry> = $state([]);

    let query: Query;

    onMount(() => {
        if (form) {
            query = form;
        }
    });
</script>

{#each entries as entry}
    <SearchEntry word={entry.word} pos={entry.pos} matched={entry.matched} en={entry.en} />
{/each}

<p>askdjask</p>
