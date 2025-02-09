<script lang="ts">
    let {
        fieldName,
        data = $bindable(),
        description,
        placeholder
    }: {
        fieldName: string;
        data: string;
        description: string;
        placeholder: string;
    } = $props();
</script>

<div class="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
    <div class="flex flex-col sm:w-32">
        <p class="font-bold text-gray-700">
            {fieldName}:
        </p>
        <p class="text-sm text-gray-500">{description}</p>
    </div>
    <input
        type="text"
        bind:value={data}
        {placeholder}
        class="input input-bordered focus:ring-primary input-sm w-full max-w-lg focus:ring-2"
    />
</div>
