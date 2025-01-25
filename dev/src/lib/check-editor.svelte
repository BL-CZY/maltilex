<script lang="ts">
    let {
        fieldName,
        fieldTable,
        fields: options = $bindable(),
        setValue
    }: {
        fieldName: string;
        fields: { [key: string]: boolean };
        fieldTable: { [key: string]: string };
        setValue: (val: string[]) => void;
    } = $props();

    $effect(() => {
        let array: string[] = [];
        Object.keys(options).forEach((key) => {
            if (options[key]) {
                array.push(fieldTable[key]);
            }
        });
        setValue(array);
    });
</script>

<div class="flex w-full gap-2">
    <p class="mb-2 block font-medium text-gray-700 sm:min-w-32">
        {fieldName}:
    </p>
    <div class="flex flex-wrap gap-2">
        {#each Object.keys(options) as key}
            <label
                class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 shadow-sm hover:bg-gray-50"
            >
                <input
                    type="checkbox"
                    bind:checked={options[key]}
                    class="checkbox checkbox-sm"
                />
                <span class="text-sm">{key}</span>
            </label>
        {/each}
    </div>
</div>
