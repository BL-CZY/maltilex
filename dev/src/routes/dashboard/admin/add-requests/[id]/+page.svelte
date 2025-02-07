<script lang="ts">
    import WordEditor from '$lib/word-editor.svelte';
    import { goto } from '$app/navigation';
    import type { FormFieldsMap, WordFull } from '$lib/req-types.js';
    import StrEditor from '$lib/str-editor.svelte';
    import { saveAddRequest } from '$lib/req.js';
    import { formToStreamlined } from '$lib/utils.js';

    let { data } = $props();
    let { supabase, id } = $derived(data);

    let { word, formFieldsMap, req } = $derived(data);
    let wordBind: undefined | WordFull = $state();
    let formFieldsMapBind: undefined | FormFieldsMap = $state();

    $effect(() => {
        wordBind = word;
        formFieldsMapBind = formFieldsMap;
        let interval = setInterval(save, 10000);
        return () => {
            clearInterval(interval);
        };
    });

    const transferTo = async (table: string) => {
        const { error } = await supabase.from(table).insert({
            user_id: req.user_id,
            w: wordBind?.word,
            ph: wordBind?.phonetic,
            p: wordBind?.part_of_speech,
            r: wordBind?.root,
            f: wordBind?.forms.map((ele) => {
                return formToStreamlined(ele);
            }),
            ed: wordBind?.en_display,
            et: wordBind?.en_tokens,
            mt: wordBind?.mt_tokens,
            ex: wordBind?.examples,
            re: wordBind?.related,
            time_created: req.time_created,
            profile_id: req.profile_id,
            state: req.state,
            note: req.note
        });

        if (error) {
            console.log(error.message);
        }

        await supabase.from('add_requests_ready').delete().eq('id', id);
    };

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

        if (!error) {
            await supabase
                .from('add_requests_ready')
                .update({ state: 2 })
                .eq('id', id);
            await transferTo('add_requests_arch');
            goto('/dashboard/success');
        } else {
            goto('/dashboard/fail');
        }
    };

    let msg = $state('');

    let isSaving = $state(false);

    let save = async () => {
        isSaving = true;
        await saveAddRequest(supabase, word, id);
        isSaving = false;
    };

    let cancel = async () => {
        req.note.push(msg);
        await transferTo('add_requests');

        goto('/dashboard/success');
    };

    // $effect(() => {
    //     $inspect(word);
    // });
</script>

{#snippet control()}
    <StrEditor fieldName="Extra notes" bind:data={msg} />
    <div class="flex justify-center gap-2">
        <button onclick={callback} class="btn btn-primary">
            Approve Add Request
        </button>
        <button onclick={cancel} class="btn btn-outline btn-error"
            >Cancel Request</button
        >
        <button class="btn btn-secondary" onclick={save} disabled={isSaving}>
            {#if isSaving}
                Saving...
            {:else}
                Save Progress
            {/if}
        </button>
    </div>
{/snippet}

{#if formFieldsMapBind && wordBind}
    <WordEditor
        bind:word={wordBind}
        bind:formFieldsMap={formFieldsMapBind}
        {control}
        notes={req.note}
        {supabase}
    />
{/if}
