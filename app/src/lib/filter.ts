export type Filter = {
    num?: string[];
    gen?: string[];
    pol?: string[];
    extra?: string[];
    sub?: string[];

    // verb exclusive
    vsub?: {
        num: string[];
        gen: string[];
    };
    vobj?: {
        num: string[];
        gen: string[];
    };
    vobjInd?: {
        num: string[];
        gen: string[];
    };
    vform?: string[];
};

export type FilterField =
    | 'num'
    | 'gen'
    | 'pol'
    | 'extra'
    | 'sub'
    | 'vsub'
    | 'vobj'
    | 'vobjInd'
    | 'vform';
