import type { AddRequestFull } from '$lib/req-types.js';
import { err, ok, Result } from '$lib/utils.js';

export const load = async ({
    parent,
    params
}): Promise<{ result: Result<AddRequestFull, string> }> => {
    const { supabase } = await parent();

    const { data, error } = await supabase
        .from('add_requests')
        .select('*')
        .eq('id', params.id);

    if (error) {
        return { result: err(error.message) };
    } else {
        if (data[0]) {
            return {
                result: ok(data[0])
            };
        }
        return {
            result: err('not found')
        };
    }
};
