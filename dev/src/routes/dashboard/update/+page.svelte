<script lang="ts">
    import { goto } from '$app/navigation';
    import { PUBLIC_APP_URL } from '$env/static/public';
    import { search } from '$lib/api';

    let value = $state('');

    let { data } = $props();
    let { supabase, user, profileID } = $derived(data);
</script>

<div class="flex justify-center">
    <div
        class="bg-base-100 flex max-w-xl items-center justify-center rounded-lg p-10 shadow-lg"
    >
        <div class="w-full max-w-lg space-y-1">
            <!-- Search Input -->
            <label for="val" class="text-center text-xl font-semibold"
                >Choose the word you want to update</label
            >
            <input
                id="val"
                type="text"
                bind:value
                placeholder="Search your keyword"
                class="input input-bordered input-sm w-full"
            />

            <div
                class="bg-base-100 border-base-300 rounded-lg border shadow-lg"
            >
                {#await search(value.trim().toLocaleLowerCase())}
                    <div
                        class="flex min-h-[60vh] items-center justify-center p-4"
                    >
                        <span
                            class="loading loading-spinner loading-md text-primary"
                        ></span>
                    </div>
                {:then res}
                    <div
                        class="flex max-h-[60vh] flex-col items-center gap-4 overflow-y-auto p-4"
                    >
                        {#each res as req}
                            <div class="flex min-w-full gap-4">
                                <div
                                    class="card card-normal bg-base-200 flex-1 p-4"
                                >
                                    <div
                                        class="flex w-full items-center justify-between gap-4 overflow-auto"
                                    >
                                        <button
                                            class="btn btn-sm btn-primary"
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
                                                    console.log(
                                                        updateRes.error
                                                    );
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
                                            <p class="text-base-content/70">
                                                {req.en}
                                            </p>
                                        </div>
                                        <button
                                            class="btn btn-secondary"
                                            onclick={() => {
                                                window.open(
                                                    `${PUBLIC_APP_URL}/search/${req.id}`
                                                );
                                            }}>Preview</button
                                        >
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:catch e}
                    <div class="alert alert-error m-4">
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
    </div>
</div>
