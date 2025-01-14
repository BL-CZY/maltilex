<script lang="ts">
    import Word from '$lib/word.svelte';
    let { data } = $props();
</script>

{#if 'error' in data.word}
    <p>{data.word.error}</p>
{:else}
    <Word word={data.word.word} />
{/if}
