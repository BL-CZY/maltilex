import { apiWord } from '$lib/api.js';

export const load = async ({ fetch, params }) => {
    return { word: await apiWord(params.id, fetch) };
};
