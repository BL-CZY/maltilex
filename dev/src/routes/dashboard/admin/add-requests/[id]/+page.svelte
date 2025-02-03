<script lang="ts">
    import WordEditor from '$lib/word-editor.svelte';
    import { goto } from '$app/navigation';
    import type { FormFieldsMap, WordFull } from '$lib/req-types.js';

    let { data } = $props();
    let { supabase, id } = $derived(data);

    let { word, formFieldsMap } = $derived(data);
    let wordBind: undefined | WordFull = $state();
    let formFieldsMapBind: undefined | FormFieldsMap = $state();

    $effect(() => {
        wordBind = word;
        formFieldsMapBind = formFieldsMap;
    });

    const callback = async () => {
        const { error } = await supabase.from('words').insert({
            w: wordBind?.word,
            ph: wordBind?.phonetic,
            p: wordBind?.part_of_speech,
            r: wordBind?.root,
            f: wordBind?.forms,
            ed: wordBind?.en_display,
            et: wordBind?.en_tokens,
            mt: wordBind?.mt_tokens,
            ex: wordBind?.examples,
            c: wordBind?.contributors,
            re: wordBind?.related
        });

        if (error) {
            goto('/dashboard/fail');
        } else {
            goto('/dashboard/success');
        }
    };

    $effect(() => {
        $inspect(word);
    });
</script>

{#snippet control()}
    <div class="flex justify-center gap-2">
        <button onclick={callback} class="btn btn-primary">
            Approve Add Request
        </button>
        <button
            onclick={async () => {
                const { error } = await supabase
                    .from('add_requests')
                    .update({ state: -1 })
                    .eq('id', id);

                if (error) {
                    goto('/dashboard/fail');
                } else {
                    goto('/dashboard/success');
                }
            }}
            class="btn btn-outline btn-error">Cancel Request</button
        >
    </div>
{/snippet}

{#if formFieldsMapBind && wordBind}
    <WordEditor
        bind:word={wordBind}
        bind:formFieldsMap={formFieldsMapBind}
        {control}
    />
{/if}
