<script lang="ts">
    import type { FormFieldsMap, WordFull } from '$lib/req-types.js';
    import {
        saveAddRequest,
        updateAddRequest as addAddRequest
    } from '$lib/req.js';
    import WordEditor from '$lib/word-editor.svelte';

    const { data } = $props();
    const { id, formFieldsMap, word, supabase, user, profileID } =
        $derived(data);
    let wordBind: undefined | WordFull = $state();
    let formFieldsMapBind: undefined | FormFieldsMap = $state();

    let isSaving = $state(false);

    $effect(() => {
        wordBind = word;
        formFieldsMapBind = formFieldsMap;
        let interval = setInterval(save, 10000);

        return () => {
            clearInterval(interval);
        };
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
    />
{/if}
