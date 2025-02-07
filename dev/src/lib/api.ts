import { PUBLIC_API_URL } from '$env/static/public';

export type SearchResultEntry = {
    id: string;
    word: string;
    distance: number;
    pos: string;
    en: Array<string>;
    matched: string;
};

export const search = async (
    word: string
): Promise<Array<SearchResultEntry>> => {
    try {
        let queryURL = new URL(`${PUBLIC_API_URL}/search`);
        queryURL.searchParams.set('keyword', word);
        return await (await fetch(queryURL)).json();
    } catch (e) {
        console.log(e);
        throw new Error(String(e));
    }
};
