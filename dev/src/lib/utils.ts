import type { SupabaseClient } from '@supabase/supabase-js';
import type { Form, Word, WordFull } from './req-types';

const wrapSlash = (str: string): string => {
    if (!str.startsWith('/')) {
        str = '/' + str;
    }

    if (!str.endsWith('/')) {
        str = str + '/';
    }

    if (str === '/') {
        str += '/';
    }

    return str;
};

export const cleanWord = (word: Word) => {
    (['w', 'p', 'r'] as ('w' | 'p' | 'r')[]).forEach((key) => {
        word[key] = word[key].trim().toLowerCase();
    });

    word.ph = wrapSlash(word.ph.trim().toLowerCase());

    (['et', 'mt'] as ('et' | 'mt')[]).forEach((key) => {
        word[key] = word[key].map((ele) => {
            return ele.trim().toLowerCase();
        });
    });

    word.f = word.f.map((form) => {
        form.w = form.w.trim().toLowerCase();
        form.ph = wrapSlash(form.ph.trim().toLowerCase());
        form.en = form.en.map((e) => {
            return e.trim().toLowerCase();
        });
        return form;
    });
};

export const genTokens = (word: Word) => {
    cleanWord(word);
    let mt: string[] = [];
    let et: string[] = [];
    let mtSet: Set<string> = new Set();
    let enSet: Set<string> = new Set();

    word.f.forEach((form) => {
        if (!mtSet.has(form.w)) {
            mtSet.add(form.w);
            mt.push(form.w);
        }
    });

    word.ed.forEach((en) => {
        if (!enSet.has(en)) {
            enSet.add(en);
            et.push(en);
        }
    });

    word.et.forEach((en) => {
        if (!enSet.has(en)) {
            enSet.add(en);
            et.push(en);
        }
    });

    word.mt.forEach((m) => {
        if (!mtSet.has(m)) {
            mtSet.add(m);
            mt.push(m);
        }
    });

    word.et = et.filter((ele) => {
        return ele !== '';
    });
    word.mt = mt.filter((ele) => {
        return ele !== '';
    });
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

function recursiveObjectLoop(
    obj: Record<string, any>,
    path: string = ''
): void {
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
            // Recursively loop if value is an object
            recursiveObjectLoop(value, currentPath);
        } else {
            // Log or process leaf values
            key;
            currentPath;
            value;
        }
    }
}

export const track = (val: any) => {
    if (typeof val === 'object') {
        recursiveObjectLoop(val);
    } else {
        val;
    }
};
