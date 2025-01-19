import { getContext } from 'svelte';

export const setLoadingState = (state: boolean) => {
    let ctx = getContext('isLoading') as { value: boolean };
    ctx.value = state;
};

export const getLoadingState = (): { value: boolean } => {
    return getContext('isLoading') as { value: boolean };
};
