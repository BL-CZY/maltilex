export type SearchResultEntry = {
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
    mode?: [boolean, boolean];
    skip?: number;
    limit?: number;
    maxDis?: number;
};

export const parseQuery = (data: URLSearchParams): Query => {
    let query: Query = {};

    let keyword = data.get('keyword');
    let mode = data.get('mode');
    let skip = data.get('skip');
    let limit = data.get('limit');
    let maxDis = data.get('maxDis');

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
