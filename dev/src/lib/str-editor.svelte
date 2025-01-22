<script lang="ts">
    let { fieldName, data = $bindable() }: { fieldName: string; data: string } =
        $props();
</script>

<div class="flex w-full items-center gap-2">
    <p class="min-w-32 font-medium text-gray-700">{fieldName}:</p>
    <input
        type="text"
        bind:value={data}
        class="input input-bordered focus:ring-primary w-full max-w-lg focus:ring-2"
    />
</div>
