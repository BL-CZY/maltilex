<script lang="ts">
    let { data } = $props();
</script>

{#if 'error' in data}
    <p>{data.error}</p>
{:else}
    <p>{JSON.stringify(data.word)}</p>
{/if}
