<script lang="ts">
    import { goto } from '$app/navigation';
    import { PUBLIC_APP_URL } from '$env/static/public';
    import { search } from '$lib/api';
    import { fade } from 'svelte/transition';

    let value = $state('');

    let { data } = $props();
    let { supabase, user, profileID } = $derived(data);

    let list: { index: string; word: string }[] = $state([]);
</script>

<p>Choose the word you want to add</p>

<div class="w-full max-w-lg">
    <input
        type="text"
        bind:value
        placeholder="Search your keyword"
        class="input input-bordered input-sm w-full"
    />

    <div class="flex gap-2">
        {#each list as ele, index}
            <div class="mt-3 flex gap-2">
                <div class="bg-secondary flex gap-2 rounded-3xl p-2">
                    <p class="text-sm font-bold">{ele.word}</p>
                    <button
                        class="btn btn-circle btn-xs"
                        onclick={() => {
                            list.splice(index, 1);
                        }}>x</button
                    >
                </div>
            </div>
        {/each}
    </div>
    <div
        class="bg-base-100 border-base-300 mt-2 rounded-lg border shadow-lg"
        transition:fade={{ duration: 100 }}
    >
        {#await search(value.trim().toLocaleLowerCase())}
            <div class="flex min-h-[60vh] justify-center p-4">
                <span class="loading loading-spinner loading-md text-primary"
                ></span>
            </div>
        {:then res}
            <div class="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
                {#each res as req}
                    <div class="flex">
                        <div class="card card-normal flex-1 px-5">
                            <div
                                class="flex w-full items-center justify-between px-2"
                            >
                                <button
                                    class="btn btn-sm"
                                    onclick={async () => {
                                        const wordRes = await supabase
                                            .from('words')
                                            .select('*')
                                            .eq('id', req.id);
                                        if (wordRes.error) {
                                            console.log(wordRes.error);
                                            return;
                                        }

                                        if (!wordRes.data[0]) {
                                            console.log('only one');
                                            return;
                                        }

                                        let word = wordRes.data[0];
                                        word.word_id = req.id;
                                        word.user_id = user?.id;
                                        word.profile_id = profileID;
                                        delete word.id;
                                        delete word.c;

                                        const updateRes = await supabase
                                            .from('update_requests')
                                            .insert(word)
                                            .select();

                                        if (
                                            updateRes.error ||
                                            !updateRes.data[0]
                                        ) {
                                            console.log(updateRes.error);
                                        } else {
                                            goto(
                                                `/dashboard/update/${updateRes.data[0].id}`
                                            );
                                        }
                                    }}
                                >
                                    Update id: {req.id}
                                </button>
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
                        </div>
                        <button
                            class="btn btn-primary"
                            onclick={() => {
                                window.open(
                                    `${PUBLIC_APP_URL}/search/${req.id}`
                                );
                            }}>Preview</button
                        >
                    </div>
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
</div>
