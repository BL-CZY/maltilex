import { PUBLIC_API_URL } from '$env/static/public';
import type { Query, SearchResultEntry, Word, WordResult } from './search-types';

export const apiSearch = async (
    query: Query,
    fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<Array<SearchResultEntry>> => {
    try {
        let queryURL = new URL(`${PUBLIC_API_URL}/search`);

        if (query.keyword !== undefined) {
            queryURL.searchParams.set('keyword', query.keyword);
        }

        if (query.searchMt !== undefined) {
            queryURL.searchParams.set('searchMt', String(query.searchMt));
        }

        if (query.searchEn !== undefined) {
            queryURL.searchParams.set('searchEn', String(query.searchEn));
        }

        if (query.skip !== undefined) {
            queryURL.searchParams.set('skip', String(query.skip));
        }

        if (query.limit !== undefined) {
            queryURL.searchParams.set('limit', String(query.limit));
        }

        if (query.maxDis !== undefined) {
            queryURL.searchParams.set('maxDis', String(query.maxDis));
        }

        let res = await fetch(queryURL);

        let data: Array<SearchResultEntry> = await res.json();
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const apiWord = async (
    id: string,
    fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<WordResult> => {
    try {
        let queryURL = new URL(`${PUBLIC_API_URL}/word/${id}`);

        let res = await fetch(queryURL);

        let data: WordResult = await res.json();

        if ('error' in data) {
            throw new Error(data.error);
        }

        return { word: data.word };
    } catch (e) {
        console.log(e);
        return { error: String(e) };
    }
};
