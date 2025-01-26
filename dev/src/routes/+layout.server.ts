import { redirect } from '@sveltejs/kit';

export const load = async ({
    locals: { safeGetSession, isAdmin, bio, username, profileID },
    url,
    cookies
}) => {
    const { session, user } = await safeGetSession();

    if (!session && !user && url.pathname.startsWith('/dashboard')) {
        throw redirect(303, '/auth');
    } else {
        if (url.pathname.startsWith('/dashboard/admin') && !isAdmin) {
            throw redirect(303, '/dashboard/error?msg=Unauthorized');
        }
    }

    if (session && url.pathname == '/auth') {
        throw redirect(303, '/dashboard');
    }

    return {
        isAdmin,
        session,
        bio,
        username,
        email: user?.email,
        profileID,
        cookies: cookies.getAll()
    };
};
