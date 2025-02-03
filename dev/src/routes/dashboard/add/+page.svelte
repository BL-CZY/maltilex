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
</script>

<WordEditor
    bind:word
    bind:formFieldsMap
    btnText={'Add Request'}
    callback={async () => {
        if (!user) {
            return;
        }

        let { et, mt } = genTokens(word);

        const { error } = await supabase.from('add_requests').insert({
            user_id: user.id,
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
            profile_id: profileID ?? 0
        } satisfies AddRequest);

        if (error) {
            console.log(error);
            goto('/dashboard/fail');
        } else {
            goto('/dashboard/success');
        }
    }}
/>
