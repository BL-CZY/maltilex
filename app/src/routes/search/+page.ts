import type { Query, SearchResultEntry } from '$lib/search-types.js';

export const load = async ({ fetch, url }) => {
    let result: Array<SearchResultEntry> = [];
    let query: Query = {};

    let keyword = url.searchParams.get('keyword');
    let mode = url.searchParams.get('mode');
    let skip = url.searchParams.get('skip');
    let limit = url.searchParams.get('limit');
    let maxDis = url.searchParams.get('maxDis');

    if (keyword) {
        query.keyword = String(keyword);
    }

    if (mode) {
        console.log(mode);
        let arr = JSON.parse(String(mode));
        if (
            Array.isArray(arr) &&
            arr.length === 2 &&
            typeof arr[0] === 'boolean' &&
            typeof arr[1] === 'boolean'
        ) {
            query.mode = [arr[0], arr[1]];
        }
    }

    if (skip) {
        let num = parseInt(String(skip));
        if (!isNaN(num)) {
            query.skip = num;
        }
    }

    if (limit) {
        let num = parseInt(String(limit));
        if (!isNaN(num)) {
            query.limit = num;
        }
    }

    if (maxDis) {
        let num = parseInt(String(maxDis));
        if (!isNaN(num)) {
            query.maxDis = num;
        }
    }

    try {
        let res = await fetch(
            `/api/search?keyword=${query.keyword}&mode=${query.mode}&skip=${query.skip}&limit=${query.limit}&maxDis=${query.maxDis}`
        );

        let data = await res.json();
        console.log(data);
        result = data.result;
    } catch (e) {
        console.log(e);
    }

    return { query: query, result: result };
};
