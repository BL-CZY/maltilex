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

    let loadBtn: HTMLElement | undefined = $state();

    let isLoading = $state(false);

    $effect(() => {
        query.skip = 0;
        query.limit = 10;
        entries = result;
    });

    onMount(() => {
        mounted = true;

        setInterval(() => {}, 1000);

        if (loadBtn) {
            const observer = new IntersectionObserver(async (elements) => {
                if (elements[0].isIntersecting) {
                    if (query.skip == undefined || query.skip >= 40) {
                        return;
                    }

                    // get data
                    entries.push(...(await apiSearch(query, fetch)));
                    query.skip += 10;
                }
            });

            observer.observe(loadBtn);
        }
    });
</script>

{#if !isLoading}
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
                isLoading = true;
            }}
        />
    {/each}

    <div class="mb-5 flex justify-center">
        <button
            class="btn btn-accent"
            bind:this={loadBtn}
            onclick={async () => {
                entries.push(...(await apiSearch(query, fetch)));
            }}>Load More</button
        >
    </div>
{:else}
    <div class="flex w-full flex-col items-center justify-center gap-4">
        <div
            class="border-t-accent text-accent flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent text-4xl"
        >
            <div
                class="border-t-primary text-accent-primary flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent text-2xl"
            ></div>
        </div>
    </div>
{/if}
