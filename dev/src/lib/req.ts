import type { SupabaseClient } from '@supabase/supabase-js';
import {
    type AddRequest,
    type AddRequestFull,
    type FormFieldsMap,
    type FormOptions,
    type Form,
    type WordFull,
    type Word
} from './req-types';
import { cleanWord, genTokens } from './utils';
import { goto } from '$app/navigation';

export const saveAddRequest = async (
    supabase: SupabaseClient,
    word: Word,
    id: string
) => {
    const { error } = await supabase
        .from('add_requests')
        .update({
            ...word,
            state: 0
        } satisfies AddRequest)
        .eq('id', id);

    if (error) {
        console.log(error);
    }
};

export const parseAddReq = (
    req: AddRequestFull
): { word: Word; formFieldsMap: FormFieldsMap } => {
    let formFieldsMap: FormFieldsMap = {
        n: false,
        g: false,
        p: false,
        e: false,
        s: false,
        o: false,
        on: false,
        og: false,
        io: false,
        ion: false,
        iog: false,
        t: false
    };

    if (req.f[0]) {
        Object.keys(req.f[0]).forEach((key) => {
            if (key in formFieldsMap) {
                formFieldsMap[key as FormOptions] = true;
            }
        });
    }

    return {
        word: {
            ...req
        },
        formFieldsMap
    };
};

export const updateAddRequest = async (
    word: Word,
    supabase: SupabaseClient,
    id: string,
    profileID: number,
    user_id: string
) => {
    cleanWord(word);

    const { error } = await supabase.from('add_requests_ready').insert({
        ...word,
        user_id: user_id,
        profile_id: profileID,
        state: 0
    } satisfies AddRequest);

    await supabase.from('add_requests').delete().eq('id', id);

    if (error) {
        console.log(error);
        goto('/dashboard/fail');
    } else {
        goto('/dashboard/success');
    }
};
