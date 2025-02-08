import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

const getReq = async (table: string, supabase: SupabaseClient) => {
    const { data, error } = await supabase.from(table).select('id, w, state');

    if (error) {
        redirect(303, '/dashboard/fail');
    }

    return (data as { id: number; w: string; state: number }[]).sort((a, b) => {
        return a.id - b.id;
    });
};

export const load = async ({
    locals: { supabase }
}): Promise<{
    addReqs: {
        id: number;
        w: string;
        state: number;
    }[];

    updateReqs: {
        id: number;
        w: string;
        state: number;
    }[];
}> => {
    return {
        addReqs: await getReq('add_requests', supabase),
        updateReqs: await getReq('update_requests', supabase)
    };
};
