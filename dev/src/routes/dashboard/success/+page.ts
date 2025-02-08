export const load = ({ url }) => {
    return {
        url: url.searchParams.get('url') ?? '/dashboard',
        msg: url.searchParams.get('msg') ?? 'Success!'
    };
};
