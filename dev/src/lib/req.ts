import type { SupabaseClient } from '@supabase/supabase-js';
import {
    type AddRequest,
    type AddRequestFull,
    type FormFieldsMap,
    type FormKey,
    type Form,
    type WordFull,
    type Word
} from './req-types';
import { genTokens, streamlinedToForm } from './utils';
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

export const parseAddReq = (req: AddRequestFull) => {
    let forms = req.f.map((ele) => {
        return streamlinedToForm(ele);
    });

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

    if (forms[0]) {
        Object.keys(forms[0]).forEach((key) => {
            if (key in formFieldsMap) {
                formFieldsMap[key as FormKey] = true;
            }
        });
    }

    return {
        word: {
            ...req,
            c: [
                {
                    profile_id: req.profile_id,
                    time_contributed: req.time_created
                }
            ]
        } satisfies WordFull,
        formFieldsMap,
        req
    };
};

export const updateAddRequest = async (
    word: Word,
    supabase: SupabaseClient,
    id: string,
    profileID: number,
    user_id: string
) => {
    genTokens(word);

    const { error } = await supabase.from('add_requests_ready').insert({
        ...word,
        user_id: user_id,
        profile_id: profileID,
        state: 1
    } satisfies AddRequest);

    await supabase.from('add_requests').delete().eq('id', id);

    if (error) {
        console.log(error);
        goto('/dashboard/fail');
    } else {
        goto('/dashboard/success');
    }
};
