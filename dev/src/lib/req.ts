import type { SupabaseClient } from '@supabase/supabase-js';
import {
    type AddRequest,
    type AddRequestFull,
    type FormFieldsMap,
    type FormOptions,
    type Word,
    type UpdateRequestFull,
    type UpdateRequest
} from './req-types';
import { cleanWord } from './utils';
import { goto } from '$app/navigation';

export const saveRequest = async (
    supabase: SupabaseClient,
    word: Word,
    id: string,
    table: 'update_requests' | 'add_requests' | 'add_requests_ready'
) => {
    const { error } = await supabase
        .from(table)
        .update({
            ...word,
            state: 0
        } satisfies AddRequest)
        .eq('id', id);

    if (error) {
        console.log(error);
    }
};

export const parseReq = (
    req: AddRequestFull | UpdateRequestFull
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
        goto(`/dashboard/fail?msg=Error: ${error.message}`);
    } else {
        goto(
            '/dashboard/success?msg=Thank you so much for your contribution to the project! One of our Admins will review the request and sort it out ASAP, and you can expect the word to be added within a week after the approval.'
        );
    }
};

export const updateUpdateRequest = async (
    word: Word,
    supabase: SupabaseClient,
    id: string,
    req: UpdateRequestFull
) => {
    cleanWord(word);

    const { error } = await supabase.from('update_requests_ready').insert({
        ...word,
        user_id: req.user_id,
        profile_id: req.profile_id,
        state: 0,
        word_id: req.word_id
    } satisfies UpdateRequest);

    await supabase.from('update_requests').delete().eq('id', id);

    if (error) {
        console.log(error);
        goto(`/dashboard/fail?msg=Error: ${error.message}`);
    } else {
        goto(
            '/dashboard/success?msg=Thank you so much for your contribution to the project! One of our Admins will review the request and sort it out ASAP, and you can expect the word to be updated within a week after the approval.'
        );
    }
};
