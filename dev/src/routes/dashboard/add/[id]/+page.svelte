<script lang="ts">
    import type { FormFieldsMap, WordFull } from '$lib/req-types.js';
    import {Word
        saveAddRequest,
        updateAddRequest as addAddRequest
    } from '$lib/req.js';
    import { track } from '$lib/utils';
    import WordEditor from '$lib/word-editor.svelte';

    const { data } = $props();
    const { id, formFieldsMap, word, supabase, user, profileID, req } =Word
        $derived(data);
    let wordBind: undefined | WordFull = $state();
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
        await saveAddRequest(supabase, $state.snapshot(wordBind!), id);
        isSaving = false;
    };

    let callback = async () => {
        if (!user) {
            return;
        }

        addAddRequest(
            $state.snapshot(wordBind!),
            supabase,
            id,
            profileID ?? 0,
            user.id
        );
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
