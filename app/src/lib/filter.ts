export type Filter = {
    num?: string[];
    gen?: string[];
    pol?: string[];
    extra?: string[];
    sub?: string[];

    obj?: string[];
    objNum?: string[];
    objGen?: string[];

    indObj?: string[];
    indObjNum?: string[];
    indObjGen?: string[];

    vform?: string[];
};

export type FilterField =
    | 'num'
    | 'gen'
    | 'pol'
    | 'extra'
    | 'sub'
    | 'obj'
    | 'objNum'
    | 'objGen'
    | 'indObj'
    | 'indObjNum'
    | 'indObjGen'
    | 'vform';
