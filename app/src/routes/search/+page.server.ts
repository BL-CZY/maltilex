import type { Query } from '$lib/search-types.js';

export const actions = {
    default: async ({ request }) => {
        let data = await request.formData();
        let query: Query = {};

        let keyword = data.get('keyword');
        let mode = data.get('keyword');
        let skip = data.get('keyword');
        let limit = data.get('keyword');
        let maxDis = data.get('keyword');

        if (keyword) {
            query.keyword = String(keyword);
        }

        if (mode) {
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
                query.skip = num;
            }
        }

        if (maxDis) {
            let num = parseInt(String(maxDis));
            if (!isNaN(num)) {
                query.skip = num;
            }
        }

        return query;
    }
};
