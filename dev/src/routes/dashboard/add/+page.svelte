<script lang="ts">
    import type { Word } from '$lib/common/index';
    import FormEditor from '$lib/form-editor.svelte';
    import ListEditor from '$lib/list-editor.svelte';
    import StrEditor from '$lib/str-editor.svelte';
    import { X } from 'lucide-react';

    let word: Word = $state({
        word: '',
        phonetic: '',
        part_of_speech: '',
        root: '',
        forms: [],
        en_display: [],
        examples: [],
        contributors: []
    });

    let showJson = $state(false);
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
                placeholder={'use "," to separate words'}
                setValue={(value) => {
                    word.en_display = value;
                }}
            />
            <ListEditor
                fieldName="Examples"
                sep=","
                placeholder={'Start a new line to separate sentences'}
                setValue={(value) => {
                    word.examples = value;
                }}
            />
        </div>
    </div>

    <button class="btn btn-primary mt-4" onclick={() => (showJson = !showJson)}>
        {showJson ? 'Hide' : 'Show'} JSON
    </button>

    {#if showJson}
        <div
            class="fixed bottom-4 right-4 w-96 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
        >
            <div class="mb-2 flex items-center justify-between">
                <h3 class="font-semibold">JSON Preview</h3>
                <button
                    class="btn btn-ghost btn-sm p-1"
                    onclick={() => (showJson = false)}
                >
                    <X class="h-4 w-4" />
                </button>
            </div>
            <pre class="max-h-96 overflow-auto rounded bg-gray-50 p-4 text-sm">
                {JSON.stringify(word, null, 4)}
            </pre>
        </div>
    {/if}
</div>
