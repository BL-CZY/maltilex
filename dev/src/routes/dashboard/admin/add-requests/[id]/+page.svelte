<script lang="ts">
    import WordEditor from '$lib/components/word-editor.svelte';
    import { goto } from '$app/navigation';
    import type { FormFieldsMap, Word } from '$lib/req-types.js';
    import StrEditor from '$lib/components/str-editor.svelte';
    import { saveRequest } from '$lib/req.js';
    import { genTokens, track } from '$lib/utils.js';

    let { data } = $props();
    let { supabase, id } = $derived(data);
    let { word, formFieldsMap, req } = $derived(data);
    let wordBind: undefined | Word = $state();
    let formFieldsMapBind: undefined | FormFieldsMap = $state();

    $effect(() => {
        wordBind = word;
        formFieldsMapBind = formFieldsMap;
        return () => {
            clearTimeout(timeout);
        };
    });

    let timeout: ReturnType<typeof setTimeout>;

    $effect(() => {
        track(wordBind);
        clearTimeout(timeout);
        timeout = setTimeout(save, 1000);
    });

    const transferTo = async (table: string, cancel: boolean) => {
        const { error } = await supabase.from(table).insert({
            ...word,
            user_id: req.user_id,
            time_created: req.time_created,
            profile_id: req.profile_id,
            state: cancel ? 1 : req.state,
            note: req.note
        });

        if (error) {
            console.log(error.message);
        }

        await supabase.from('add_requests_ready').delete().eq('id', id);
    };

    const approve = async () => {
        genTokens(word);
        const { error } = await supabase.from('words').insert(word);

        if (!error) {
            await transferTo('add_requests_arch', false);
            goto('/dashboard/success');
        } else {
            goto('/dashboard/fail');
        }
    };

    let msg = $state('');

    let isSaving = $state(false);

    let save = async () => {
        isSaving = true;
        await saveRequest(supabase, word, id, 'add_requests_ready');
        isSaving = false;
    };

    let cancel = async () => {
        req.note.push(msg);
        await transferTo('add_requests', true);

        goto('/dashboard/success');
    };

    // $effect(() => {
    //     $inspect(word);
    // });
</script>

{#snippet control()}
    <StrEditor fieldName="Extra notes" bind:data={msg} />
    <div class="flex justify-center gap-2">
        <button onclick={approve} class="btn btn-primary">
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
