<script lang="ts">
    import { search } from './api';
    import { fade } from 'svelte/transition';

    let showRelatedPanel = $state(false);
    let value = $state('');
    let componentRef: HTMLElement | undefined = $state();

    let list: { index: string; word: string }[] = $state([]);

    let { setVal }: { setVal: (val: string[]) => void } = $props();

    const updateVal = () => {
        setVal(
            list.map((ele) => {
                return String(ele.index);
            })
        );
    };
</script>

<div class="relative">
    <input
        type="text"
        onfocusin={() => {
            showRelatedPanel = true;
        }}
        bind:value
        bind:this={componentRef}
        placeholder="Search your keyword"
        class="input input-bordered input-sm w-full"
    />

    <div>
        {#each list as ele, index}
            <div class="mt-3 flex gap-2">
                <div class="bg-secondary flex gap-2 rounded-3xl p-2">
                    <p class="text-sm font-bold">{ele.word}</p>
                    <button
                        class="btn btn-circle btn-xs"
                        onclick={() => {
                            list.splice(index, 1);
                            updateVal();
                        }}>x</button
                    >
                </div>
            </div>
        {/each}
    </div>
    {#if showRelatedPanel}
        <div
            class="bg-base-100 border-base-300 absolute bottom-10 left-0 right-0 z-50 mt-2 rounded-lg border shadow-lg"
            transition:fade={{ duration: 100 }}
        >
            {#await search(value.trim().toLocaleLowerCase())}
                <div class="flex min-h-[60vh] justify-center p-4">
                    <span
                        class="loading loading-spinner loading-md text-primary"
                    ></span>
                </div>
            {:then res}
                <div
                    class="flex max-h-[60vh] flex-col gap-2 overflow-y-auto p-2"
                >
                    {#each res as req}
                        <button
                            class="btn btn-ghost hover:bg-base-200 w-full"
                            onclick={() => {
                                list.push({ index: req.id, word: req.word });
                                showRelatedPanel = false;
                                updateVal();
                            }}
                        >
                            <div
                                class="flex w-full items-center justify-between px-2"
                            >
                                <p class="text-md font-medium">
                                    word: {req.word}
                                </p>
                                <div class="flex items-center gap-4">
                                    <span class="badge badge-primary"
                                        >{req.pos}.</span
                                    >
                                    <p class="text-base-content/70">{req.en}</p>
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            {:catch e}
                <div class="alert alert-error m-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{e}</span>
                </div>
            {/await}
        </div>
    {/if}
</div>

<svelte:window
    onclick={(event) => {
        if (
            componentRef &&
            event.target &&
            !componentRef.contains(event.target as Node)
        ) {
            showRelatedPanel = false;
        }
    }}
/>
