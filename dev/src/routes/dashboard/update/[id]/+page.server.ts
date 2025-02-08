import { parseReq } from '$lib/req';
import type {
    AddRequestFull,
    FormFieldsMap,
    UpdateRequestFull,
    Word
} from '$lib/req-types.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { supabase, profileID },
    params
}): Promise<{
    id: string;
    req: UpdateRequestFull;
    formFieldsMap: FormFieldsMap;
    word: Word;
}> => {
    const { data, error } = await supabase
        .from('update_requests')
        .select('*')
        .eq('id', params.id);

    if (error || !data[0]) {
        redirect(303, '/dashboard/fail?msg=Cannot find the request');
    }

    let req = data[0] as UpdateRequestFull;
    let parsed = parseReq(req);

    return {
        id: params.id,
        word: parsed.word,
        formFieldsMap: parsed.formFieldsMap,
        req
    };
};
