import type { SupabaseClient } from '@supabase/supabase-js';
import {
    FormStreamLinedKeyTable,
    type AddRequest,
    type FormKey,
    type FormStreamLined,
    type FormStreamLinedKey,
    type WordFull
} from './req-types';

export const saveAddRequest = async (
    supabase: SupabaseClient,
    word: WordFull,
    id: string
) => {
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
};
