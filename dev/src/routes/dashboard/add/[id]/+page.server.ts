import { parseAddReq } from '$lib/req';
import type { AddRequestFull, FormFieldsMap, Word } from '$lib/req-types.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { supabase, profileID },
    params
}): Promise<{
    id: string;
    req: AddRequestFull;
    formFieldsMap: FormFieldsMap;
    word: Word;
    profileID: number | null;
}> => {
    const { data, error } = await supabase
        .from('add_requests')
        .select('*')
        .eq('id', params.id);

    if (error || !data[0]) {
        redirect(303, '/dashboard/fail');
    }

    let req = data[0] as AddRequestFull;
    let parsed = parseAddReq(req);

    return {
        id: params.id,
        word: parsed.word,
        formFieldsMap: parsed.formFieldsMap,
        req,
        profileID
    };
};
