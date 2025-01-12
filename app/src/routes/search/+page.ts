import { apiSearch } from '$lib/api.js';
import { parseQuery, type Query, type SearchResultEntry } from '$lib/search-types.js';

export const load = async ({ url, fetch }) => {
    let query = parseQuery(url.searchParams);

    return { query: query, result: await apiSearch(query, fetch) };
};
