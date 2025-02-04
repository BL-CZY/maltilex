import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

export const load = async ({
    parent
}): Promise<{
    req: {
        id: string;
        w: string;
        state: string;
    }[];
}> => {
    const { supabase } = await parent();
    const { data, error } = await supabase
        .from('add_requests')
        .select('id, w, state');

    if (error) {
        if (browser) {
            goto('/dashboard/fail');
        } else {
            redirect(303, '/dashboard/fail');
        }
    }

    return { req: data as { id: string; w: string; state: string }[] };
};
