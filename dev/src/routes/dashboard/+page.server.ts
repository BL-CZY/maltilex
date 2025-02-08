import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { supabase }
}): Promise<{
    req: {
        id: number;
        w: string;
        state: string;
    }[];
}> => {
    const { data, error } = await supabase
        .from('add_requests')
        .select('id, w, state');

    if (error) {
        redirect(303, '/dashboard/fail');
    }

    return {
        req: (data as { id: number; w: string; state: string }[]).sort(
            (a, b) => {
                return a.id - b.id;
            }
        )
    };
};
