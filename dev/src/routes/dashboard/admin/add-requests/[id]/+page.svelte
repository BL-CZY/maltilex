<script lang="ts">
    import type { AddRequestFull } from '$lib/req-types.js';

    let { data } = $props();
    let req: AddRequestFull | null = $state(null);

    $effect(() => {
        req = data.result.ok();
    });
</script>

{#if req === null}
    <p>not found</p>
{:else}
    <p>hi</p>
{/if}
