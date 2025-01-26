export const load = async ({
    locals: { safeGetSession, isAdmin, bio, username, user },
    cookies
}) => {
    const { session } = await safeGetSession();
    return {
        isAdmin,
        session,
        bio,
        username,
        email: user?.email,
        cookies: cookies.getAll()
    };
};
