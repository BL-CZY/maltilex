<script lang="ts">
    let { fieldName, data = $bindable() }: { fieldName: string; data: string } =
        $props();
</script>

<div class="flex">
    <p class="text-pretty">{fieldName}:&nbsp</p>
    <input
        type="text"
        bind:value={data}
        class="input input-sm input-bordered"
    />
</div>
