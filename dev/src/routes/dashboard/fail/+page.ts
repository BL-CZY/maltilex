export const load = ({ url }) => {
    return { url: url.searchParams.get('url') ?? '/dashboard' };
};
