import { apiWord } from '$lib/api.js';

const numMap = new Map([
    ['sg', 'singular'],
    ['pl', 'plural'],
    ['dl', 'dual']
]);

const subMap = new Map([
    ['p1', 'first person'],
    ['p2', 'second person'],
    ['p3', 'third person']
]);

const genMap = new Map([
    ['m', 'male'],
    ['f', 'female']
]);

const polMap = new Map([
    ['pos', 'positive'],
    ['neg', 'negative']
]);

export const load = async ({ fetch, params }) => {
    let word = await apiWord(params.id, fetch);

    if ('error' in word) {
        return { word: word };
    }

    word.word.forms.forEach((form) => {
        if (form.num) {
            form.num = form.num.map((n) => {
                return numMap.get(n) ?? n;
            });
        }

        if (form.sub) {
            form.sub = form.sub.map((s) => {
                return subMap.get(s) ?? s;
            });
        }

        if (form.gen) {
            form.gen = form.gen.map((g) => {
                return genMap.get(g) ?? g;
            });
        }

        if (form.pol) {
            form.pol = form.pol.map((p) => {
                return polMap.get(p) ?? p;
            });
        }
    });

    return { word: word };
};
