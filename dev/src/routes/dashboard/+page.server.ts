import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { supabase }
}): Promise<{
    req: {
        id: string;
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

    let result = data as { id: string; w: string; state: string }[];

    return { req: data as { id: string; w: string; state: string }[] };
};
