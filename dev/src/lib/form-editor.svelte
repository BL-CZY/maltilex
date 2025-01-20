<script lang="ts">
    import type { Form } from '$lib/common/index';
    let { forms = $bindable() }: { forms: Array<Form> } = $props();
</script>

{#each forms as form}{/each}
