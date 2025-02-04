import type { AddRequestFull } from '$lib/req-types.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase }, params }) => {
    const { data, error } = await supabase
        .from('add_requests')
        .select('*')
        .eq('id', params.id);

    if (error || !data[0]) {
        redirect(303, '/dashboard/fail');
    }

    return { req: data[0] as AddRequestFull };
};
