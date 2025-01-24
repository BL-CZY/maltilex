<script lang="ts">
    import { browser } from '$app/environment';
    import Loading from '$lib/loading.svelte';
    import { getLoadingState } from '$lib/utils.js';
    import Word from '$lib/word.svelte';
    let { data } = $props();

    const isLoading = getLoadingState();
    $effect(() => {
        isLoading.value = false;
    });
</script>

{#if !isLoading.value}
    {#if 'error' in data.word}
        <p>{data.word.error}</p>
    {:else}
        <Word word={data.word.word} />
    {/if}
{:else}
    <Loading />
{/if}

<svelte:window
    on:popstate={() => {
        isLoading.value = true;
    }}
/>
