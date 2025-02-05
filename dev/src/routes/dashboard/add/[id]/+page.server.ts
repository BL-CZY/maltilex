import { parseAddReq } from '$lib/req';
import type {
    AddRequestFull,
    FormFieldsMap,
    WordFull
} from '$lib/req-types.js';
import { streamlinedToForm } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { supabase },
    params
}): Promise<{
    id: string;
    req: AddRequestFull;
    formFieldsMap: FormFieldsMap;
    word: WordFull;
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
        req: parsed.req
    };
};
