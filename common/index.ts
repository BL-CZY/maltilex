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
