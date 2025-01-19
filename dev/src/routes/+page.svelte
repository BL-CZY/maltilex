<script lang="ts">
    let { data } = $props();
    let { a } = $derived(data);
</script>

<h1>{a}</h1>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>
