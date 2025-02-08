<script lang="ts">
    import type { FormFieldsMap, Word } from '$lib/req-types.js';
    import {
        saveRequest,
        updateAddRequest,
        updateUpdateRequest
    } from '$lib/req.js';
    import { track } from '$lib/utils';
    import WordEditor from '$lib/components/word-editor.svelte';
    import { goto } from '$app/navigation';

    const { data } = $props();
    const { id, formFieldsMap, word, supabase, user, req } = $derived(data);
    let wordBind: undefined | Word = $state();
    let formFieldsMapBind: undefined | FormFieldsMap = $state();

    let isSaving = $state(false);

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

    let save = async () => {
        isSaving = true;
        await saveRequest(
            supabase,
            $state.snapshot(wordBind!),
            id,
            'update_requests'
        );
        isSaving = false;
    };

    let callback = async () => {
        if (!user) {
            return;
        }

        updateUpdateRequest($state.snapshot(wordBind!), supabase, id, req);
    };
</script>

{#snippet control()}
    <button class="btn btn-primary" onclick={callback}>Add Request</button>
    <button class="btn btn-secondary" onclick={save} disabled={isSaving}>
        {#if isSaving}
            Saving...
        {:else}
            Save Progress
        {/if}
    </button>
    <button
        class="btn btn-error btn-outline"
        onclick={async () => {
            const { error } = await supabase
                .from('update_requests')
                .delete()
                .eq('id', req.id);
            if (error) {
                console.log(error);
            }
            goto('/dashboard');
        }}>Delete Request</button
    >
{/snippet}

{@debug word}

{#if formFieldsMapBind && wordBind}
    <WordEditor
        bind:word={wordBind}
        bind:formFieldsMap={formFieldsMapBind}
        {control}
        notes={req.note}
        {supabase}
    />
{/if}
