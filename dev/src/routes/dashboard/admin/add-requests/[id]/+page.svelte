<script lang="ts">
    import type { WordFull } from '$lib/req-types';
    import WordEditor from '$lib/word-editor.svelte';
    import { goto } from '$app/navigation';

    let { data } = $props();
    let req: WordFull | null = $state(null);
    let { supabase } = $derived(data);

    $effect(() => {
        req = data.result.ok();
    });

    const callback = async () => {
        const { error } = await supabase.from('words').insert({
            w: req?.word,
            ph: req?.phonetic,
            p: req?.part_of_speech,
            r: req?.root,
            f: req?.forms,
            ed: req?.en_display,
            et: req?.en_tokens,
            mt: req?.mt_tokens,
            ex: req?.examples,
            c: req?.contributors,
            re: req?.related
        });

        if (error) {
            goto('/dashboard/fail');
        } else {
            goto('/dashboard/success');
        }
    };
</script>

{#if req === null}
    <p>not found</p>
{:else}
    <WordEditor bind:word={req} {callback} />
{/if}
