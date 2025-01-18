import type { FilterField } from './filter';

export type SearchResultEntry = {
    id: string;
    word: string;
    distance: number;
    pos: string;
    en: Array<string>;
    matched: string;
};

export type SearchResultJson =
    | {
          result: Array<SearchResultEntry>;
      }
    | {
          error: string;
      };

export type Query = {
    keyword?: string;
    searchMt?: boolean;
    searchEn?: boolean;
    skip?: number;
    limit?: number;
    maxDis?: number;
};

export type FormField = 'word' | 'phonetic' | 'english' | FilterField;

export type Form = {
    word: string;
    phonetic: string;
    english: string[];
    number?: string[];
    gender?: string[];
    polarity?: string[];
    extra?: string[];
    subject?: string[];

    object?: string[];
    object_number?: string[];
    object_gender?: string[];

    indirect_object?: string[];
    indirect_object_number?: string[];
    indirect_object_gender?: string[];

    tense?: string[];
};

// the word got from fetch
export type Word = {
    word: string;
    phonetic: string;
    part_of_speech: string;
    root: string;
    forms: Form[];
    en_display: string[];
    examples: string[];
    contributors: string[];
};

export type WordResult = { word: Word } | { error: string };

export const parseQuery = (data: URLSearchParams): Query => {
    let query: Query = {};

    let keyword = data.get('keyword');
    let searchMt = data.get('searchMt');
    let searchEn = data.get('searchEn');
    let skip = data.get('skip');
    let limit = data.get('limit');
    let maxDis = data.get('maxDis');

    if (keyword) {
        query.keyword = String(keyword);
    }

    if (searchMt) {
        query.searchMt = Boolean(searchMt);
    }

    if (searchEn) {
        query.searchEn = Boolean(searchEn);
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
};
