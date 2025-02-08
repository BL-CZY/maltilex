import type {
    AddRequestFull,
    FormFieldsMap,
    UpdateRequestFull,
    Word
} from '$lib/req-types.js';
import { parseReq } from '$lib/req.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { supabase },
    params
}): Promise<{
    id: string;
    word: Word;
    formFieldsMap: FormFieldsMap;
    req: UpdateRequestFull;
}> => {
    const { data, error } = await supabase
        .from('update_requests_ready')
        .select('*')
        .eq('id', params.id);

    if (error) {
        console.log(error);
        redirect(303, '/dashboard/error?msg=error fetching');
    } else {
        if (data[0]) {
            let req = data[0] as UpdateRequestFull;
            let parsed = parseReq(req);

            return {
                id: params.id,
                word: parsed.word,
                formFieldsMap: parsed.formFieldsMap,
                req
            };
        }
        redirect(303, '/dashboard/error?msg=not found');
    }
};
