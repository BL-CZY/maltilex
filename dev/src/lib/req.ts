import type { SupabaseClient } from '@supabase/supabase-js';
import {
    FormStreamLinedKeyTable,
    type AddRequest,
    type AddRequestFull,
    type FormFieldsMap,
    type FormKey,
    type FormStreamLined,
    type FormStreamLinedKey,
    type WordFull
} from './req-types';
import { genTokens, streamlinedToForm } from './utils';
import { goto } from '$app/navigation';

export const saveAddRequest = async (
    supabase: SupabaseClient,
    word: WordFull,
    id: string
) => {
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
            et: word.en_tokens,
            mt: word.mt_tokens,
            ex: word.examples,
            re: word.related,
            state: 0
        } satisfies AddRequest)
        .eq('id', id);

    if (error) {
        console.log(error);
    }
};

export const parseAddReq = (req: AddRequestFull) => {
    let forms = req.f.map((ele) => {
        return streamlinedToForm(ele);
    });

    let formFieldsMap: FormFieldsMap = {
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
    };

    if (forms[0]) {
        if (forms.length > 0) {
            Object.keys(forms[0]).forEach((key) => {
                if (key in formFieldsMap) {
                    formFieldsMap[key as FormKey] = true;
                }
            });
        }
    }

    return {
        word: {
            word: req.w,
            phonetic: req.ph,
            part_of_speech: req.p,
            root: req.r,
            forms: forms,
            en_display: req.ed,
            examples: req.ex,
            contributors: [
                {
                    profile_id: req.profile_id,
                    time_contributed: req.time_created
                }
            ],
            related: req.re,
            mt_tokens: req.mt,
            en_tokens: req.et
        } satisfies WordFull,
        formFieldsMap,
        req
    };
};

export const updateAddRequest = async (
    word: WordFull,
    supabase: SupabaseClient,
    id: string
) => {
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
