import { apiSearch } from '$lib/api.js';
import { parseQuery, type Query, type SearchResultEntry } from '$lib/search-types.js';

export const load = async ({ url, fetch }) => {
    let query = parseQuery(url.searchParams);
    // let test = new Promise((resolve) => {
    //     setTimeout(resolve, 1000);
    // });
    // await test;

    return { query: query, result: await apiSearch(query, fetch) };
};
