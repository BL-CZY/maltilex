export const load = async ({
    locals: { safeGetSession, isAdmin, bio, username, user, profileID },
    cookies
}) => {
    const { session } = await safeGetSession();
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
