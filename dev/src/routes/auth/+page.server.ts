import { redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { createClient, type AuthError } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SERVICE_ROLE_KEY } from '$env/static/private';

const handlError = (err: AuthError) => {
    console.log(err.message);
    redirect(303, `/auth?msg=${err.message}`);
};

export const actions: Actions = {
    signup: async ({ request, locals: { supabase } }) => {
        const supabaseServiceRole = createClient(
            PUBLIC_SUPABASE_URL,
            PRIVATE_SERVICE_ROLE_KEY
        );

        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const username = formData.get('username') as string;

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            handlError(error);
        } else {
            const profileRes = await supabaseServiceRole
                .from('user_profiles')
                .insert({
                    user_id: data.user?.id,
                    bio: 'Welcome !',
                    username: username
                });

            const roleRes = await supabaseServiceRole
                .from('user_roles')
                .insert({
                    user_id: data.user?.id,
                    role_id: 2
                });

            if (profileRes.error) {
                console.log(profileRes.error);
            }

            if (roleRes.error) {
                console.log(roleRes.error);
            }

            redirect(303, '/dashboard');
        }
    },

    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            handlError(error);
        } else {
            redirect(303, '/dashboard');
        }
    }
};
