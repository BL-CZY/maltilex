import type { Word } from '$lib/common/index.js';
import type { AddRequestFull, WordFull } from '$lib/req-types.js';
import { err, ok, Result, StreamlinedToForm } from '$lib/utils.js';

export const load = async ({
    parent,
    params
}): Promise<{
    result: Result<WordFull, string>;
}> => {
    const { supabase } = await parent();

    const { data, error } = await supabase
        .from('add_requests')
        .select('*')
        .eq('id', params.id);

    if (error) {
        return { result: err(error.message) };
    } else {
        if (data[0]) {
            let req = data[0] as AddRequestFull;
            return {
                result: ok({
                    word: req.w,
                    phonetic: req.ph,
                    part_of_speech: req.p,
                    root: req.r,
                    forms: req.f.map((ele) => {
                        return StreamlinedToForm(ele);
                    }),
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
                } satisfies WordFull)
            };
        }
        return {
            result: err('not found')
        };
    }
};
