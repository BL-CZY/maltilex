import { parseQuery, type Query, type SearchResultEntry } from '$lib/search-types.js';

export const load = async ({ fetch, url, depends }) => {
    let query = parseQuery(url.searchParams);

    return { query: query };
};
