<script lang="ts">
    let { data } = $props();

    $effect(() => {
        if (data.result.isErr()) {
            let a = data.result.ok();
        }
    });
</script>
