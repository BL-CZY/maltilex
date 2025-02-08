import type {
    AddRequestFull,
    FormFieldsMap,
    Word,
    WordFull
} from '$lib/req-types.js';
import { parseAddReq } from '$lib/req.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { supabase },
    params
}): Promise<{
    id: string;
    word: Word;
    formFieldsMap: FormFieldsMap;
    req: AddRequestFull;
}> => {
    const { data, error } = await supabase
        .from('add_requests_ready')
        .select('*')
        .eq('id', params.id);

    console.log('hi');

    if (error) {
        console.log(error);
        redirect(303, '/dashboard/error?msg=error fetching');
    } else {
        if (data[0]) {
            let req = data[0] as AddRequestFull;
            let parsed = parseAddReq(req);

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
