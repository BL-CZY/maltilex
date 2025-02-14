import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { apiWord } from '$lib/api.js';
import { createClient } from '@supabase/supabase-js';

export const load = async ({ fetch, params }) => {
    let word = await apiWord(params.id, fetch);

    let supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

    if ('error' in word) {
        return { word: word };
    }

    return { word: word, supabase };
};
