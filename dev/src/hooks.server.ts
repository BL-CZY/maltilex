import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL
} from '$env/static/public';

const supabase: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => event.cookies.getAll(),
                setAll: (cookies) => {
                    cookies.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, {
                            ...options,
                            path: '/'
                        });
                    });
                }
            }
        }
    );

    event.locals.safeGetSession = async () => {
        const {
            data: { session }
        } = await event.locals.supabase.auth.getSession();

        if (!session) {
            return { session: null, user: null };
        }

        const {
            data: { user },
            error
            // returns error if the Json web tokens auth fails
        } = await event.locals.supabase.auth.getUser();

        if (error) {
            return { session: null, user: null };
        }

        return { session, user };
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            /**
             * Supabase libraries use the `content-range` and `x-supabase-api-version`
             * headers, so we need to tell SvelteKit to pass it through.
             */
            return (
                name === 'content-range' || name === 'x-supabase-api-version'
            );
        }
    });
};

const authGuard: Handle = async ({ event, resolve }) => {
    const { session, user } = await event.locals.safeGetSession();
    event.locals.session = session;
    event.locals.user = user;
    event.locals.isAdmin = false;

    if (!event.locals.session && event.url.pathname.startsWith('/dashboard')) {
        redirect(303, '/auth');
    }

    if (event.locals.session && event.url.pathname == '/auth') {
        redirect(303, '/dashboard');
    }

    if (event.locals.user) {
        const { data, error } = await event.locals.supabase
            .from('user_roles')
            .select('role_id')
            .eq('user_id', event.locals.user.id);

        if (!error) {
            if (data[0]) {
                if (
                    data[0].role_id == 1 &&
                    event.url.searchParams.get('admin') !== '1'
                ) {
                    event.locals.isAdmin = true;
                }
            }
        }
    }

    if (event.url.pathname.startsWith('/admin')) {
        if (!event.locals.session || !event.locals.user) {
            redirect(303, '/auth');
        } else {
            const { data, error } = await event.locals.supabase
                .from('user_roles')
                .select('role_id')
                .eq('user_id', event.locals.user.id);

            if (error) {
                redirect(303, '/error?msg=auth error');
            }

            if (data[0]) {
                if (data[0].role_id != 1) {
                    redirect(303, '/error?msg=unauthorized');
                }
            } else {
                redirect(303, '/error?msg=auth error');
            }
        }
    }

    return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
