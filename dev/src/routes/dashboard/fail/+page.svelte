<script lang="ts">
    let { data } = $props();
    let { url } = $derived(data);
</script>

Some problem happened
<a href={url}>go back</a>
