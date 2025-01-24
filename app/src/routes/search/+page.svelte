<script lang="ts">
    import { apiSearch } from '$lib/api';
    import Loading from '$lib/loading.svelte';
    import SearchEntry from '$lib/search-entry.svelte';
    import { type SearchResultEntry } from '$lib/search-types';
    import { getLoadingState } from '$lib/utils.js';
    import { fly } from 'svelte/transition';

    let { data } = $props();
    let { query, result } = $derived(data);

    let entries: Array<SearchResultEntry> = $state([]);

    let mounted = $state(false);

    let loadBtn: HTMLElement | undefined = $state();
    let isLoadingMore: boolean = $state(false);

    const isLoading = getLoadingState();

    $effect(() => {
        query.skip = 0;
        query.limit = 10;
        entries = result;
        isLoading.value = false;
        mounted = true;
    });

    $effect(() => {
        if (loadBtn) {
            const observer = new IntersectionObserver(async (elements) => {
                if (elements[0].isIntersecting) {
                    if (query.skip == undefined || query.skip >= 40) {
                        return;
                    }

                    // get data
                    isLoadingMore = true;
                    entries.push(...(await apiSearch(query, fetch)));
                    isLoadingMore = false;
                    query.skip += 10;
                }
            });

            observer.observe(loadBtn);
        }
    });
</script>

{#if !isLoading.value}
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
        <SearchEntry
            id={entry.id}
            word={entry.word}
            pos={entry.pos}
            matched={entry.matched}
            en={entry.en}
            {index}
            switchToLoading={() => {
                isLoading.value = true;
            }}
        />
    {/each}

    <div class="mb-5 flex justify-center">
        {#if !isLoadingMore}
            <button
                class="btn btn-accent"
                bind:this={loadBtn}
                onclick={async () => {
                    entries.push(...(await apiSearch(query, fetch)));
                }}>Load More</button
            >
        {:else}
            <Loading />
        {/if}
    </div>
{:else}
    <Loading />
{/if}
