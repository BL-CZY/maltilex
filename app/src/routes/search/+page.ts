import { apiSearch } from '$lib/api.js';
import { parseQuery, type Query, type SearchResultEntry } from '$lib/search-types.js';

export const load = async ({ fetch, url, depends }) => {
    let query = parseQuery(url.searchParams);
    query.skip = 0;
    query.limit = 10;

    return { query: query, result: await apiSearch(query, fetch) };
};
