<script lang="ts">
    import WordEditor from '$lib/word-editor.svelte';
    import { goto } from '$app/navigation';
    import type { FormFieldsMap, WordFull } from '$lib/req-types.js';

    let { data } = $props();
    let { supabase } = $derived(data);

    let { word, formFieldsMap } = $derived(data);
    let wordBind: undefined | WordFull = $state();
    let formFieldsMapBind: undefined | FormFieldsMap = $state();

    $effect(() => {
        wordBind = word;
        formFieldsMapBind = formFieldsMap;
    });

    const callback = async () => {
        const { error } = await supabase.from('words').insert({
            w: word.word,
            ph: word.phonetic,
            p: word.part_of_speech,
            r: word.root,
            f: word.forms,
            ed: word.en_display,
            et: word.en_tokens,
            mt: word.mt_tokens,
            ex: word.examples,
            c: word.contributors,
            re: word.related
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

{#if formFieldsMapBind && wordBind}
    <WordEditor
        bind:word={wordBind}
        bind:formFieldsMap={formFieldsMapBind}
        {callback}
    />
{/if}
