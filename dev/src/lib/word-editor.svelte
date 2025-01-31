<script lang="ts">
    import type { WordFull } from '$lib/req-types';
    import FormEditor from '$lib/form-editor.svelte';
    import ListEditor from '$lib/list-editor.svelte';
    import StrEditor from '$lib/str-editor.svelte';
    import { slide, fade } from 'svelte/transition';

    let showJson = $state(false);

    let {
        word = $bindable(),
        callback
    }: {
        word: WordFull;
        callback: () => Promise<void>;
    } = $props();

    // $effect(() => {
    //     $inspect(word);
    // });
</script>

<div class="container mx-auto max-w-3xl p-6">
    <div class="space-y-4 rounded-lg bg-white p-6 shadow-lg">
        <h1 class="mb-6 text-2xl font-bold">Word Editor</h1>

        <div class="grid gap-4">
            <StrEditor bind:data={word.word} fieldName="Word" />
            <StrEditor bind:data={word.phonetic} fieldName="Phonetic" />
            <StrEditor
                bind:data={word.part_of_speech}
                fieldName="Part of Speech"
            />
            <StrEditor bind:data={word.root} fieldName="Root" />
        </div>

        <div class="mt-8">
            <FormEditor
                bind:forms={word.forms}
                deleteItem={(i) => {
                    word.forms.splice(i, 1);
                }}
            />
        </div>

        <div class="space-y-4">
            <ListEditor
                fieldName="English"
                sep=","
                defaultVal={word.en_display}
                placeholder={'use "," to separate words'}
                setValue={(value) => {
                    word.en_display = value;
                }}
            />
            <ListEditor
                fieldName="English Tokens"
                sep=","
                defaultVal={word.en_tokens}
                placeholder={'use "," to separate words'}
                setValue={(value) => {
                    word.en_tokens = value;
                }}
            />
            <ListEditor
                fieldName="Maltese Tokens"
                sep=","
                defaultVal={word.mt_tokens}
                placeholder={'use "," to separate words'}
                setValue={(value) => {
                    word.mt_tokens = value;
                }}
            />
            <ListEditor
                fieldName="Examples"
                defaultVal={word.examples}
                sep=","
                placeholder={'Start a new line to separate sentences'}
                setValue={(value) => {
                    word.examples = value;
                }}
            />
        </div>
    </div>

    {#if showJson}
        <div
            class="fixed bottom-0 right-0 z-20 rounded-lg border border-gray-200 bg-white p-4 shadow-xl sm:bottom-4 sm:right-4 sm:w-96"
            transition:slide
        >
            <div class="mb-2 flex items-center justify-between">
                <h3 class="font-semibold">JSON Preview</h3>
                <button
                    class="btn btn-ghost btn-sm btn-circle aria-label p-1"
                    onclick={() => (showJson = false)}
                >
                    <span class="sr-only">Close</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-x"
                        ><path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                        /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg
                    >
                </button>
            </div>
            <pre
                class="m-0 max-h-96 overflow-auto rounded bg-gray-50 p-0 text-sm">{JSON.stringify(
                    word,
                    null,
                    4
                ).trim()}
            </pre>
        </div>
    {:else}
        <button
            class="btn btn-primary fixed bottom-4 right-4"
            onclick={() => (showJson = !showJson)}
            transition:fade
        >
            {showJson ? 'Hide' : 'Show'} JSON
        </button>
    {/if}
</div>
<button onclick={callback}>Add word request</button>
