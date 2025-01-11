<script lang="ts">
    import { apiSearch } from '$lib/api';
    import SearchEntry from '$lib/search-entry.svelte';
    import { type Query, type SearchResultEntry } from '$lib/search-types';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    let { data } = $props();
    let { query, result } = $derived(data);

    let entries: Array<SearchResultEntry> = $state([]);

    let mounted = $state(false);

    $effect(() => {
        entries = result;
    });

    let loadBtn: HTMLElement;

    onMount(() => {
        mounted = true;

        setInterval(() => {}, 1000);

        if (loadBtn) {
            const observer = new IntersectionObserver(async (elements) => {
                if (elements[0].isIntersecting) {
                    if (entries.length % 10 != 0 || query.skip == undefined || query.skip >= 40) {
                        return;
                    }

                    // get data
                    query.skip += 10;
                    entries.push(...(await apiSearch(query, fetch)));
                }
            });

            observer.observe(loadBtn);
        }
    });
</script>

{#if mounted}
    <div
        transition:fly={{ y: -50, duration: 500 }}
        class="fixed z-[5] my-2 mt-[-20px] flex w-full justify-center"
    >
        <div class="card bg-base-100 w-[90%] p-4 shadow-md">
            <div class="mb-[-10px] flex w-full items-start justify-between gap-4">
                <div class="ml-[5px] flex-1 text-left">
                    <p class="text-sm font-bold">Word</p>
                </div>
                <div class="flex flex-1 text-left">
                    <p class="text-sm font-bold">PoS</p>
                </div>
                <div class="flex flex-1 flex-col items-start space-y-1">
                    <p class="text-sm font-bold">English</p>
                </div>
                <div class="flex flex-[0.4]">
                    <p class="text-sm font-bold">Index</p>
                </div>
            </div>
        </div>
    </div>
{/if}

<div class="h-[20px]"></div>

{#each entries as entry, index}
    <SearchEntry word={entry.word} pos={entry.pos} matched={entry.matched} en={entry.en} {index} />
{/each}

<div class="flex justify-center">
    <button class="btn btn-accent" bind:this={loadBtn}>Load More</button>
</div>
