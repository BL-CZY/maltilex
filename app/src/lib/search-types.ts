import type { FilterField } from './filter';
import type { Word } from '$lib/common/index';
export type { Word, Form } from '$lib/common/index';

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

    if (searchMt !== null && searchMt !== undefined) {
        query.searchMt = searchMt.toLowerCase() == 'true';
    }

    if (searchEn !== null && searchEn !== undefined) {
        query.searchEn = searchEn.toLowerCase() == 'true';
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

    return query;
};
