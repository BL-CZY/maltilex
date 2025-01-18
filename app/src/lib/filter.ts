import type { FormField } from './search-types';

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

export enum NameIndex {
    Word,
    Phonetic,
    Tense,
    Subject,
    Number,
    Gender,
    Object,
    ObjectNumber,
    ObjectGender,
    IndirectObject,
    IndirectObjectNumber,
    IndirectObjectGender,
    Polarity,
    English,
    Extra
}

export const nameMap: Map<FormField, number> = new Map([
    ['word', NameIndex.Word],
    ['phonetic', NameIndex.Phonetic],
    ['tense', NameIndex.Tense],
    ['subject', NameIndex.Subject],
    ['number', NameIndex.Number],
    ['gender', NameIndex.Number],
    ['object', NameIndex.Object],
    ['object_number', NameIndex.ObjectNumber],
    ['object_gender', NameIndex.ObjectGender],
    ['indirect_object', NameIndex.IndirectObject],
    ['indirect_object_number', NameIndex.IndirectObjectNumber],
    ['indirect_object_gender', NameIndex.IndirectObjectGender],
    ['polarity', NameIndex.Polarity],
    ['english', NameIndex.English],
    ['extra', NameIndex.Extra]
]);

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
