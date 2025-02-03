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

        let { et, mt } = genTokens(word);

        const { error } = await supabase
            .from('add_requests')
            .update({
                w: word.word,
                ph: word.phonetic,
                p: word.part_of_speech,
                r: word.root,
                f: word.forms.map((ele) => {
                    let result: FormStreamLined = {
                        w: ele.word,
                        ph: ele.phonetic,
                        en: ele.english
                    };

                    Object.keys(ele).forEach((key) => {
                        if (
                            key == 'word' ||
                            key == 'phonetic' ||
                            key == 'english'
                        ) {
                            return;
                        }

                        let formKey = key as FormKey;
                        if (ele[formKey] != undefined) {
                            result[
                                FormStreamLinedKeyTable[
                                    formKey
                                ] as FormStreamLinedKey
                            ] = ele[formKey];
                        }
                    });

                    return result;
                }),
                ed: word.en_display,
                et,
                mt,
                ex: word.examples,
                re: word.related,
                state: 1
            } satisfies AddRequest)
            .eq('id', id);

        if (error) {
            console.log(error);
            goto('/dashboard/fail');
        } else {
            goto('/dashboard/success');
        }
    };

    let isSaving = $state(false);

    let save = async () => {
        isSaving = true;
        await supabase
            .from('add_requests')
            .update({
                w: word.word,
                ph: word.phonetic,
                p: word.part_of_speech,
                r: word.root,
                f: word.forms.map((ele) => {
                    let result: FormStreamLined = {
                        w: ele.word,
                        ph: ele.phonetic,
                        en: ele.english
                    };

                    Object.keys(ele).forEach((key) => {
                        if (
                            key == 'word' ||
                            key == 'phonetic' ||
                            key == 'english'
                        ) {
                            return;
                        }

                        let formKey = key as FormKey;
                        if (ele[formKey] != undefined) {
                            result[
                                FormStreamLinedKeyTable[
                                    formKey
                                ] as FormStreamLinedKey
                            ] = ele[formKey];
                        }
                    });

                    return result;
                }),
                ed: word.en_display,
                et: word.en_tokens,
                mt: word.mt_tokens,
                ex: word.examples,
                re: word.related,
                state: 0
            } satisfies AddRequest)
            .eq('id', id);
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
