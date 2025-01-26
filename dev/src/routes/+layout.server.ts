export const load = async ({
    locals: { safeGetSession, isAdmin },
    cookies
}) => {
    const { session } = await safeGetSession();
    return {
        isAdmin,
        session,
        cookies: cookies.getAll()
    };
};
