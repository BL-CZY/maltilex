export type Filter = {
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

export type FilterField =
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
