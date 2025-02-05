<script lang="ts">
    import { goto } from '$app/navigation';
    import type { WordFull } from '$lib/req-types';
    import {
        FormStreamLinedKeyTable,
        type AddRequest,
        type FormKey,
        type FormStreamLined,
        type FormStreamLinedKey
    } from '$lib/req-types.js';
    import { saveAddRequest, updateAddRequest } from '$lib/req.js';
    import { genTokens } from '$lib/utils.js';
    import WordEditor from '$lib/word-editor.svelte';
    import { onMount } from 'svelte';

    let word: WordFull = $state({
        word: '',
        phonetic: '',
        part_of_speech: '',
        root: '',
        forms: [],
        en_display: [],
        examples: [],
        contributors: [],
        en_tokens: [],
        mt_tokens: [],
        related: []
    });

    let formFieldsMap = $state({
        number: false,
        gender: false,
        polarity: false,
        extra: false,
        subject: false,
        object: false,
        object_number: false,
        object_gender: false,
        indirect_object: false,
        indirect_object_number: false,
        indirect_object_gender: false,
        tense: false
    });

    let { data } = $props();
    let { supabase, user, profileID } = $derived(data);
    let id = '';

    onMount(async () => {
        // create a new one
        const { data, error } = await supabase
            .from('add_requests')
            .insert({
                user_id: user?.id,
                profile_id: profileID ?? 0
            })
            .select();

        if (!error) {
            if (data[0]) {
                id = data[0].id;
            }
        } else {
            goto('/dashboard/fail');
        }

        setInterval(save, 10000);
    });

    let callback = async () => {
        if (!user) {
            return;
        }

        await updateAddRequest($state.snapshot(word), supabase, id);
    };

    let isSaving = $state(false);

    let save = async () => {
        isSaving = true;
        await saveAddRequest(supabase, $state.snapshot(word), id);
        isSaving = false;
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

<WordEditor bind:word bind:formFieldsMap {control} />
