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
