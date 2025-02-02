import type { SupabaseClient } from '@supabase/supabase-js';
import type { Form } from './common';
import type { FormStreamLined, WordFull } from './req-types';

export const genTokens = (
    word: WordFull
): {
    et: string[];
    mt: string[];
} => {
    let mt: string[] = [];
    let et: string[] = [];
    let mtSet: Set<string> = new Set();
    let enSet: Set<string> = new Set();

    word.forms.forEach((form) => {
        if (!mtSet.has(form.word)) {
            mtSet.add(form.word);
            mt.push(form.word);
        }
    });

    word.en_display.forEach((en) => {
        if (!enSet.has(en)) {
            enSet.add(en);
            et.push(en);
        }
    });

    word.en_tokens.forEach((en) => {
        if (!enSet.has(en)) {
            enSet.add(en);
            et.push(en);
        }
    });

    word.mt_tokens.forEach((m) => {
        if (!mtSet.has(m)) {
            mtSet.add(m);
            mt.push(m);
        }
    });

    return { et, mt };
};

export const getProfile = async (id: number, supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('bio, username')
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    if (!data[0]) {
        throw new Error('empty');
    }

    return data[0] as {
        bio: string;
        username: string;
    };
};

export class Result<K, E> {
    constructor(private readonly _inner: { ok: K } | { err: E }) {}

    isOk(): boolean {
        return 'ok' in this._inner;
    }

    ifErr(): boolean {
        return 'err' in this._inner;
    }

    ok(): K | null {
        if ('ok' in this._inner) {
            return this._inner.ok;
        } else {
            return null;
        }
    }

    err(): E | null {
        if ('err' in this._inner) {
            return this._inner.err;
        } else {
            return null;
        }
    }

    unwrap(): K {
        let res = this.ok();
        if (res !== null) {
            return res;
        } else {
            throw new Error('Tried to unwrap an error result');
        }
    }

    unwrapErr(): E {
        let res = this.err();
        if (res !== null) {
            return res;
        } else {
            throw new Error('Tried to unwrap an ok result');
        }
    }
}

export function ok<K, E>(value: K): Result<K, E> {
    return new Result<K, E>({ ok: value });
}

export function err<K, E>(error: E): Result<K, E> {
    return new Result<K, E>({ err: error });
}

export const StreamlinedToForm = (form: FormStreamLined): Form => {
    let temp = {
        word: form.w,
        phonetic: form.ph,
        english: form.en,
        number: form.n,
        gender: form.g,
        polarity: form.p,
        extra: form.e,
        subject: form.s,
        object: form.o,
        object_number: form.on,
        object_gender: form.og,
        indirect_object: form.io,
        indirect_object_number: form.ion,
        indirect_object_gender: form.iog,
        tense: form.t
    } satisfies Form;

    let result = {};
    Object.keys(temp).forEach((key) => {
        // @ts-ignore
        if (temp[key] !== undefined) {
            // @ts-ignore
            result[key] = temp[key];
        }
    });

    // @ts-ignore
    return result;
};
