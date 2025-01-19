<script lang="ts">
    import { goto } from '$app/navigation';
    import { slide } from 'svelte/transition';
    import { toNumber } from './utils';
    import { getContext, onMount } from 'svelte';
    import type { Query } from './search-types';

    let {
        ref = $bindable()
    }: {
        ref: HTMLElement | undefined;
    } = $props();

    let isLoading = getContext('isLoading') as { value: boolean } | undefined;
    let currentQuery = getContext('currentQuery') as { value: Query } | undefined;

    let keyword: string = $state('');

    let skipStr: string = $state('');
    let skip: number = $derived.by(() => toNumber(skipStr, 0));

    let limitStr: string = $state('');
    let limit: number = $derived.by(() => toNumber(limitStr, 10));

    let maxDisStr: string = $state('');
    let maxDis: number = $derived.by(() => toNumber(maxDisStr, 5));

    let searchMt: boolean = $state(true);
    let searchEn: boolean = $state(true);

    let isPanelVisible = $state(false);

    const submit = async (
        event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
    ) => {
        event.preventDefault();

        if (isLoading) {
            isLoading.value = true;
        }

        if (currentQuery) {
            currentQuery.value.keyword = keyword;
            currentQuery.value.skip = skip;
            currentQuery.value.limit = limit;
            currentQuery.value.searchMt = searchMt;
            currentQuery.value.searchEn = searchEn;
            currentQuery.value.maxDis = maxDis;
        }

        await goto(
            `/search?keyword=${keyword.trim().toLocaleLowerCase()}&skip=${skip}&limit=${limit}&searchMt=${searchMt}&searchEn=${searchEn}&maxDis=${maxDis}`
        );
    };

    onMount(() => {
        if (currentQuery) {
            keyword = currentQuery.value.keyword ?? '';
            if (currentQuery.value.skip) {
                if (currentQuery.value.skip != 0) {
                    skipStr = String(currentQuery.value.skip);
                }
            }
            if (currentQuery.value.limit) {
                if (currentQuery.value.limit != 10) {
                    limitStr = String(currentQuery.value.limit);
                }
            }
            if (currentQuery.value.maxDis) {
                if (currentQuery.value.maxDis != 5) {
                    maxDisStr = String(currentQuery.value.maxDis);
                }
            }

            if (currentQuery.value.searchEn != undefined) {
                if (!currentQuery.value.searchEn) {
                    searchEn = currentQuery.value.searchEn;
                }
            }
            if (currentQuery.value.searchMt != undefined) {
                if (!currentQuery.value.searchMt) {
                    searchMt = currentQuery.value.searchMt;
                }
            }
        }
    });
</script>

<form onsubmit={submit} class="text-center">
    <input
        class="input input-sm input-bordered w-[50%]"
        placeholder="Search something..."
        type="text"
        name="keyword"
        bind:value={keyword}
        bind:this={ref}
        required
    /><br />
    <input class="btn btn-sm btn-primary mb-2 mt-2" type="submit" value="search" />
    <div class="relative">
        <button
            class="btn btn-xs w-[155px]"
            onclick={() => {
                isPanelVisible = !isPanelVisible;
            }}
            type="button"
            aria-expanded={isPanelVisible}
            aria-controls="filter-panel"
        >
            {isPanelVisible ? `Hide Advanced Options` : `Show Advenced Options`}
        </button>

        {#if isPanelVisible}
            <div
                transition:slide
                class="bg-base-100 border-accent absolute left-[50%] top-7 z-10 mt-2 w-80 translate-x-[-50%] rounded-lg border-2 p-4 shadow-lg"
            >
                <div class="flex-col space-y-2">
                    <div class="flex justify-center gap-2">
                        <div class="flex items-center gap-2">
                            <input
                                id="mtCheckbox"
                                type="checkbox"
                                name="searchMt"
                                class="checkbox checkbox-sm checkbox-primary"
                                bind:checked={searchMt}
                            />
                            <label for="mtCheckbox" class="text-sm">Search Maltese</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input
                                id="enCheckbox"
                                type="checkbox"
                                name="searchEn"
                                class="checkbox checkbox-sm checkbox-secondary"
                                bind:checked={searchEn}
                            />
                            <label for="enCheckbox" class="text-sm">Search English</label>
                        </div>
                    </div>

                    <div class="flex-row justify-center">
                        <label for="skipInput" class="label-text">skip:&nbsp; </label>
                        <input
                            id="skipInput"
                            name="skip"
                            type="number"
                            class="input input-xs input-bordered"
                            placeholder="0"
                            min="0"
                            max="100"
                            bind:value={skipStr}
                        />
                        <label class="label-text" for="limitInput">limit: </label>
                        <input
                            id="limitInput"
                            name="limit"
                            type="number"
                            class="input input-xs input-bordered"
                            placeholder="10"
                            min="0"
                            max="100"
                            bind:value={limitStr}
                        />
                    </div>

                    <label class="label-text" for="limitInput">max distance: </label>
                    <input
                        id="limitInput"
                        name="limit"
                        type="number"
                        class="input input-xs input-bordered"
                        placeholder="5"
                        min="0"
                        max="100"
                        bind:value={maxDisStr}
                    />
                </div>
            </div>
        {/if}
    </div>
</form>
