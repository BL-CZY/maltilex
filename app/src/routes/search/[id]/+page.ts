import { apiWord } from '$lib/api.js';

export const load = async ({ fetch, params }) => {
    let word = await apiWord(params.id, fetch);

    if ('error' in word) {
        return { word: word };
    }

    return { word: word };
};
