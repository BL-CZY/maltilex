<script lang="ts">
    import type { Form, FormFieldsMap, Word } from '$lib/req-types';
    import FormEditor from './form-editor.svelte';
    ('$lib/form-editor.svelte');
    import ListEditor from '$lib/components/list-editor.svelte';
    import StrEditor from '$lib/components/str-editor.svelte';
    import { slide, fade } from 'svelte/transition';
    import TagsEditor from './tags-editor.svelte';
    import type { SupabaseClient } from '@supabase/supabase-js';
    import { onMount } from 'svelte';

    let showJson = $state(false);

    let {
        word = $bindable(),
        formFieldsMap = $bindable(),
        control,
        notes,
        supabase
    }: {
        word: Word;
        formFieldsMap: FormFieldsMap;
        control: () => ReturnType<import('svelte').Snippet>;
        notes: string[];
        supabase: SupabaseClient;
    } = $props();

    const loadRelated = async () => {
        const { data, error } = await supabase
            .from('words')
            .select('id, w')
            .in('id', word.re);

        if (error) {
            throw new Error(error.message);
        }

        return data.map((ele) => {
            return {
                index: String(ele.id),
                word: ele.w as string
            };
        });
    };

    let defaultVal: { index: string; word: string }[] | undefined = $state();

    onMount(async () => {
        try {
            defaultVal = await loadRelated();
        } catch (e) {
            console.log(e);
        }
    });

    // $effect(() => {
    //     $inspect(word);
    // });
</script>

{#snippet editor()}
    <div class="flex flex-col gap-2 sm:flex-row">
        {#if notes.length > 0}
            <div class="bg-base-100 flex-1 space-y-4 rounded-lg p-6 shadow-lg">
                <h1 class="text-2xl font-bold">Past notes</h1>
                <div>
                    {#each notes as note}
                        <p>{note}</p>
                    {/each}
                </div>
            </div>
        {/if}
        <div class="bg-base-100 flex-[3] space-y-4 rounded-lg p-6 shadow-lg">
            <h1 class="mb-6 text-2xl font-bold">Word Editor</h1>
            <div class="grid gap-4">
                <StrEditor
                    bind:data={word.w}
                    fieldName="Word"
                    description={'A form of the word, like "ktieb".'}
                    placeholder="ktieb"
                />
                <StrEditor
                    bind:data={word.ph}
                    fieldName="Phonetic"
                    description={"The IPA phonetic symbols of the word. If you don't know, you can leave it empty."}
                    placeholder="/kti:b/"
                />
                <StrEditor
                    bind:data={word.p}
                    fieldName="Part of Speech"
                    description={'The part of speech of the word, like "v", "n", etc.'}
                    placeholder="n"
                />
                <StrEditor
                    bind:data={word.r}
                    fieldName="Root"
                    description={"The root of the word. If you don't know, you can leave it blank."}
                    placeholder="k-t-b"
                />
            </div>
            <div class="mt-8">
                <FormEditor
                    bind:forms={word.f}
                    bind:formFieldsMap
                    deleteItem={(i) => {
                        word.f.splice(i, 1);
                    }}
                />
            </div>
            <div class="space-y-4">
                <ListEditor
                    fieldName="English"
                    sep=","
                    defaultVal={word.ed}
                    placeholder={'use "," to separate words'}
                    setValue={(value) => {
                        word.ed = value;
                    }}
                    description={'The English meanings of the word, such as "book"'}
                />
                <p class="text-lg font-bold">
                    For "English Tokens" and "Maltese Tokens"
                </p>
                <p class="text-sm text-gray-600">
                    We generate keywords that will be utilized by the search
                    algorithm from the information filled out. If you think
                    there are other keywords, you can add some extra ones here.
                </p>
                <ListEditor
                    fieldName="English Tokens"
                    sep=","
                    defaultVal={word.et}
                    placeholder={'use "," to separate words'}
                    setValue={(value) => {
                        word.et = value;
                    }}
                    description={'We encourage you to add different forms of the English meanings of the word, such as "books".'}
                />
                <ListEditor
                    fieldName="Maltese Tokens"
                    sep=","
                    defaultVal={word.mt}
                    placeholder={'use "," to separate words'}
                    setValue={(value) => {
                        word.mt = value;
                    }}
                    description={'You can leave this one blank.'}
                />
                <ListEditor
                    fieldName="Examples"
                    defaultVal={word.ex}
                    sep={'\n'}
                    placeholder={'Start a new line to separate sentences'}
                    setValue={(value) => {
                        word.ex = value;
                    }}
                    description={'Some examples of this word.'}
                />

                {#if defaultVal}
                    <div
                        class="flex w-full flex-col items-center gap-2 sm:flex-row"
                    >
                        <div class="flex-col sm:w-32">
                            <p class="font-bold text-gray-700">Related:</p>
                            <p class="text-sm text-gray-500">
                                You can put words that you think are related to
                                this word here such as "riħ" and "ir-riħ." You
                                can search in the input as well.
                            </p>
                        </div>
                        <TagsEditor
                            setVal={(val) => {
                                word.re = val;
                            }}
                            {defaultVal}
                        />
                    </div>
                {/if}
            </div>
            {@render control()}
        </div>
    </div>
    {#if showJson}
        <div
            class="bg-base-100 fixed bottom-0 right-0 z-20 rounded-lg border border-gray-200 p-4 shadow-xl sm:bottom-4 sm:right-4 sm:w-96"
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
                class="bg-base-100 m-0 max-h-96 overflow-auto rounded p-0 text-sm">{JSON.stringify(
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
{/snippet}

{#if notes.length > 0}
    <div class="container mx-auto max-w-[60rem] p-6">
        {@render editor()}
    </div>
{:else}
    <div class="container mx-auto max-w-3xl p-6">
        {@render editor()}
    </div>
{/if}
