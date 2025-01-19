import { getContext } from 'svelte';

export const setLoadingState = (state: boolean) => {
    let ctx = getContext('isLoading') as { value: boolean };
    ctx.value = state;
};

export const getLoadingState = (): { value: boolean } => {
    return getContext('isLoading') as { value: boolean };
};

export const toNumber = (str: string, def: number): number => {
    if (str === '') {
        return def;
    }

    let num = parseInt(str);
    if (isNaN(num)) {
        return 0;
    } else {
        return num;
    }
};
