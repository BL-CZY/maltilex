<script lang="ts">
    import SearchEntry from '$lib/search-entry.svelte';
    import { type Query, type SearchResultEntry } from '$lib/search-types';

    let { data } = $props();

    let entries: Array<SearchResultEntry> = $state(data.result);

    let query: Query = data.query;
</script>

{#each entries as entry}
    <SearchEntry word={entry.word} pos={entry.pos} matched={entry.matched} en={entry.en} />
{/each}
