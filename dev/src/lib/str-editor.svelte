<script lang="ts">
    let { fieldName, data = $bindable() }: { fieldName: string; data: string } =
        $props();
</script>

<div class="flex w-full items-center gap-2">
    <p class="font-medium text-gray-700 sm:min-w-32">
        {fieldName}:
    </p>
    <input
        type="text"
        bind:value={data}
        class="input input-bordered focus:ring-primary input-sm w-full max-w-lg focus:ring-2"
    />
</div>
