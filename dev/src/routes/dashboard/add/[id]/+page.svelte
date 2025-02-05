<script lang="ts">
    import type { FormFieldsMap, WordFull } from '$lib/req-types.js';
    import { saveAddRequest, updateAddRequest } from '$lib/req.js';
    import WordEditor from '$lib/word-editor.svelte';

    const { data } = $props();
    const { id, formFieldsMap, word, supabase, user } = $derived(data);
    let wordBind: undefined | WordFull = $state();
    let formFieldsMapBind: undefined | FormFieldsMap = $state();

    let isSaving = $state(false);

    $effect(() => {
        wordBind = word;
        formFieldsMapBind = formFieldsMap;
        setInterval(save, 10000);
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

        updateAddRequest($state.snapshot(wordBind!), supabase, id);
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
