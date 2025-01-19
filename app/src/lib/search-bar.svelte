<script lang="ts">
    import { goto } from '$app/navigation';
    import { slide } from 'svelte/transition';

    let props: { isMain: boolean; setLoading: (state: boolean) => void } = $props();
    let { isMain, setLoading } = $derived(props);

    let keyword: string = $state('');

    let skipStr: string = $state('');
    let skip: number = $derived.by(() => {
        if (skipStr === '') {
            return 0;
        }

        let num = parseInt(skipStr);
        if (isNaN(num)) {
            return 0;
        } else {
            return num;
        }
    });

    let limitStr: string = $state('');
    let limit: number = $derived.by(() => {
        if (skipStr === '') {
            return 10;
        }

        let num = parseInt(limitStr);
        if (isNaN(num)) {
            return 10;
        } else {
            return num;
        }
    });

    let maxDisStr: string = $state('');
    let maxDis: number = $derived.by(() => {
        if (maxDisStr === '') {
            return 5;
        }

        let num = parseInt(maxDisStr);
        if (isNaN(num)) {
            return 5;
        } else {
            return num;
        }
    });

    let searchMt: boolean = $state(true);
    let searchEn: boolean = $state(true);

    let isPanelVisible = $state(false);

    const submit = async (
        event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
    ) => {
        event.preventDefault();

        if (!isMain) {
            setLoading(true);
        }

        await goto(
            `/search?keyword=${keyword.trim().toLocaleLowerCase()}&skip=${skip}&limit=${limit}&searchMt=${searchMt}&searchEn=${searchEn}&maxDis=${maxDis}`
        );
    };
</script>

{#if !isMain}
    <form class="flex flex-1 justify-center" onsubmit={submit}>
        <div class="relative mr-3">
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
                    class="bg-base-100 border-accent absolute left-0 top-7 z-10 mt-2 w-52 rounded-lg border-2 p-4 shadow-lg"
                >
                    <div class="space-y-2">
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
                        <label for="skipInput">skip:&nbsp; </label>
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

                        <br />

                        <label for="limitInput">limit: </label>
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

                        <br />

                        <label for="limitInput">max distance: </label>
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
        <input
            class="input input-sm input-bordered w-[50%]"
            placeholder="Search something..."
            type="text"
            name="keyword"
            bind:value={keyword}
            required
        />
        <input class="btn btn-sm ml-2" type="submit" value="search" />
    </form>
{:else}
    <form onsubmit={submit} class="text-center">
        <input
            class="input input-sm input-bordered w-[50%]"
            placeholder="Search something..."
            type="text"
            name="keyword"
            bind:value={keyword}
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
{/if}
