export type Form = {
    w: string;
    ph: string;
    en: string[];
    n?: string[];
    g?: string[];
    p?: string[];
    e?: string[];
    s?: string[];

    o?: string[];
    on?: string[];
    og?: string[];

    io?: string[];
    ion?: string[];
    iog?: string[];

    t?: string[];
};

export type WordFull = Word & {
    id: number;
};

export type Word = {
    w: string;
    ph: string;
    p: string;
    r: string;
    f: Form[];
    ed: string[];
    et: string[];
    mt: string[];
    ex: string[];
    re: string[];
    c: { profile_id: number; time_contributed: string }[];
};

export type FormOptions =
    | 'n'
    | 'g'
    | 'p'
    | 'e'
    | 's'
    | 'o'
    | 'on'
    | 'og'
    | 'io'
    | 'ion'
    | 'iog'
    | 't';

export type AddRequest = Word & {
    user_id?: string;
    profile_id?: number;
    state: number;
};

export type AddRequestFull = Word & {
    id: number;
    user_id: string;
    profile_id: number;
    time_created: string;
    state: number;
    note: string[];
};

export type UpdateRequestFull = AddRequestFull & {
    word_id: number;
};

export type UpdateRequest = AddRequest & {
    word_id: string;
};

export type FormFieldsMap = {
    n: boolean;
    g: boolean;
    p: boolean;
    e: boolean;
    s: boolean;
    o: boolean;
    on: boolean;
    og: boolean;
    io: boolean;
    ion: boolean;
    iog: boolean;
    t: boolean;
};
