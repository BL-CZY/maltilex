import type {
    AddRequestFull,
    FormFieldsMap,
    WordFull
} from '$lib/req-types.js';
import { parseAddReq } from '$lib/req.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { supabase },
    params
}): Promise<{
    id: string;
    word: WordFull;
    formFieldsMap: FormFieldsMap;
    req: AddRequestFull;
}> => {
    const { data, error } = await supabase
        .from('add_requests')
        .select('*')
        .eq('id', params.id);

    if (error) {
        redirect(303, '/dashboard/error?msg=error fetching');
    } else {
        if (data[0]) {
            let req = data[0] as AddRequestFull;
            let parsed = parseAddReq(req);

            return {
                id: params.id,
                word: parsed.word,
                formFieldsMap: parsed.formFieldsMap,
                req: parsed.req
            };
        }
        redirect(303, '/dashboard/error?msg=not found');
    }
};
