import type { Form } from './common';

export type FormStreamLined = {
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

export const FormStreamLinedKeyTable = {
    number: 'n',
    gender: 'g',
    polarity: 'p',
    extra: 'e',
    subject: 's',
    object: 'o',
    object_number: 'on',
    object_gender: 'og',
    indirect_object: 'io',
    indirect_object_number: 'ion',
    indirect_object_gender: 'iog',
    tense: 't'
};

export type FormStreamLinedKey =
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

export type FormKey =
    | 'number'
    | 'gender'
    | 'polarity'
    | 'extra'
    | 'subject'
    | 'object'
    | 'object_number'
    | 'object_gender'
    | 'indirect_object'
    | 'indirect_object_number'
    | 'indirect_object_gender'
    | 'tense';

export type AddRequest = {
    user_id?: string;
    w: string;
    ph: string;
    p: string;
    r: string;
    f: FormStreamLined[];
    ed: string[];
    et: string[];
    mt: string[];
    ex: string[];
    re: string[];
    profile_id?: number;
    state: number;
};

export type AddRequestFull = {
    id: number;
    user_id: string;
    w: string;
    ph: string;
    p: string;
    r: string;
    f: FormStreamLined[];
    ed: string[];
    et: string[];
    mt: string[];
    ex: string[];
    re: string[];
    profile_id: number;
    time_created: string;
    state: number;
    note: string[];
};

export type UpdateRequestFull = {
    id: number;
    user_id: string;
    w: string;
    ph: string;
    p: string;
    r: string;
    f: FormStreamLined[];
    ed: string[];
    et: string[];
    mt: string[];
    ex: string[];
    re: string[];
    profile_id: number;
    time_created: string;
    state: number;
    note: string[];
    word_id: string;
};

export type UpdateRequest = {
    user_id: string;
    w: string;
    ph: string;
    p: string;
    r: string;
    f: FormStreamLined[];
    ed: string[];
    et: string[];
    mt: string[];
    ex: string[];
    re: string[];
    profile_id: number;
    state: number;
    word_id: string;
};

export type WordFull = {
    word: string;
    phonetic: string;
    part_of_speech: string;
    root: string;
    forms: Form[];
    en_display: string[];
    examples: string[];
    contributors: {
        profile_id: number;
        time_contributed: string;
    }[];
    related: string[];
    en_tokens: string[];
    mt_tokens: string[];
};

export type FormFieldsMap = {
    number: boolean;
    gender: boolean;
    polarity: boolean;
    extra: boolean;
    subject: boolean;
    object: boolean;
    object_number: boolean;
    object_gender: boolean;
    indirect_object: boolean;
    indirect_object_number: boolean;
    indirect_object_gender: boolean;
    tense: boolean;
};
