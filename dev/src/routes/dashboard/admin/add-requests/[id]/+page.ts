import type { Word } from '$lib/common/index.js';
import type {
    AddRequestFull,
    FormFieldsMap,
    FormKey,
    WordFull
} from '$lib/req-types.js';
import { err, ok, Result, StreamlinedToForm } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({
    parent,
    params
}): Promise<{
    word: WordFull;
    formFieldsMap: FormFieldsMap;
}> => {
    const { supabase } = await parent();

    const { data, error } = await supabase
        .from('add_requests')
        .select('*')
        .eq('id', params.id);

    if (error) {
        redirect(303, '/dashboard/error?msg=error fetching');
    } else {
        if (data[0]) {
            let req = data[0] as AddRequestFull;
            let forms = req.f.map((ele) => {
                return StreamlinedToForm(ele);
            });

            let formFieldsMap: FormFieldsMap = {
                number: false,
                gender: false,
                polarity: false,
                extra: false,
                subject: false,
                object: false,
                object_number: false,
                object_gender: false,
                indirect_object: false,
                indirect_object_number: false,
                indirect_object_gender: false,
                tense: false
            };

            if (forms[0]) {
                if (forms.length > 0) {
                    Object.keys(forms[0]).forEach((key) => {
                        if (key in formFieldsMap) {
                            formFieldsMap[key as FormKey] = true;
                        }
                    });
                }
            }

            return {
                word: {
                    word: req.w,
                    phonetic: req.ph,
                    part_of_speech: req.p,
                    root: req.r,
                    forms: forms,
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
                } satisfies WordFull,
                formFieldsMap
            };
        }
        redirect(303, '/dashboard/error?msg=not found');
    }
};
