import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, profileID, user } }) => {
    if (!user) {
        redirect(303, '/dashboard/fail');
    }

    const { data, error } = await supabase
        .from('add_requests')
        .insert({
            user_id: user?.id,
            profile_id: profileID ?? 0
        })
        .select();

    if (!error) {
        if (data[0]) {
            redirect(303, `/dashboard/add/${data[0].id}`);
        }
    }

    redirect(303, '/dashboard/fail');
};
