export const load = ({ url }) => {
    return {
        msg: url.searchParams.get('msg') ?? 'unknown error'
    };
};
