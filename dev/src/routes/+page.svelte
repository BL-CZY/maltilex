<script lang="ts">
    let { data } = $props();
    let { a } = $derived(data);
</script>

<a href="/dashboard">{a}</a>
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>
