<script lang="ts">
    let { data } = $props();

    let { msg } = $derived(data);
</script>

<h1>{msg}</h1>
