import type { SupabaseClient } from '@supabase/supabase-js';
import type { Word } from './common';

export const genTokens = (
    word: Word,
    en_extra: string[],
    mt_extra: string[]
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

    en_extra.forEach((en) => {
        if (!enSet.has(en)) {
            enSet.add(en);
            et.push(en);
        }
    });

    mt_extra.forEach((m) => {
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
    constructor(
        private readonly _ok: K | null,
        private readonly _err: E | null
    ) {}

    get ok(): K | null {
        return this._ok;
    }

    get err(): E | null {
        return this._err;
    }

    isOk(): this is { ok: K; err: null } {
        return this._ok !== null;
    }

    isErr(): this is { ok: null; err: E } {
        return this._err !== null;
    }

    unwrap(): K {
        if (this.isOk()) {
            return this.ok;
        }
        throw new Error('Tried to unwrap an error result');
    }

    unwrapErr(): E {
        if (this.isErr()) {
            return this.err;
        }
        throw new Error('Tried to unwrapErr a successful result');
    }
}

export function ok<K, E>(value: K): Result<K, E> {
    return new Result<K, E>(value, null);
}

export function err<K, E>(error: E): Result<K, E> {
    return new Result<K, E>(null, error);
}
