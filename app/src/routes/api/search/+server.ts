import { PRIVATE_API_URL } from '$env/static/private';
import type { SearchResultEntry, SearchResultJson } from '$lib/search-types';
import { json } from '@sveltejs/kit';

export const GET = async ({ fetch, url }) => {
    try {
        let res = await fetch(`${PRIVATE_API_URL}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword: url.searchParams.get('keyword'),
                // TODO: these should be customizable
                mode: [true, true],
                skip: 0,
                limit: 10,
                maxDis: 5
            })
        });
        let data: Array<SearchResultEntry> = await res.json();
        let result: SearchResultJson = { result: data };
        return json(result);
    } catch (e) {
        let result: SearchResultJson = { error: String(e) };
        return json(result);
    }
};
