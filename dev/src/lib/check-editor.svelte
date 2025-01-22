<script lang="ts">
    let {
        fieldName,
        fields: options = $bindable(),
        setValue
    }: {
        fieldName: string;
        fields: { [key: string]: boolean };
        setValue: (val: string[]) => void;
    } = $props();

    $effect(() => {
        let array: string[] = [];
        Object.keys(options).forEach((key) => {
            if (options[key]) {
                array.push(key);
            }
        });
        setValue(array);
    });
</script>

<div class="flex gap-2">
    <p>{fieldName}:</p>
    {#each Object.keys(options) as key}
        <div class="flex">
            <input type="checkbox" bind:checked={options[key]} />
            <p>{key}</p>
        </div>
    {/each}
</div>
