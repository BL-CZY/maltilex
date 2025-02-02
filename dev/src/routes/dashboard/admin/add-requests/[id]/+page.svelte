<script lang="ts">
    import WordEditor from '$lib/word-editor.svelte';
    import { goto } from '$app/navigation';

    let { data } = $props();
    let { supabase } = $derived(data);

    let { word, formFieldsMap } = $state(data);

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

    // $effect(() => {
    //     $inspect(req);
    // });
</script>

<WordEditor bind:word bind:formFieldsMap {callback} />
