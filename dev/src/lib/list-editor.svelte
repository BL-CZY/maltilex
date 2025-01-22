<script lang="ts">
    let {
        fieldName,
        setValue,
        sep,
        placeholder
    }: {
        fieldName: string;
        setValue: (value: string[]) => void;
        sep: string;
        placeholder: string;
    } = $props();

    let value: string = $state('');
</script>

<div class="flex w-full items-center gap-2">
    <p class="min-w-32 font-medium text-gray-700">{fieldName}:</p>
    <input
        type="text"
        class="input input-bordered focus:ring-primary w-full max-w-lg focus:ring-2"
        {placeholder}
        bind:value
        oninput={() => {
            setValue(
                value
                    .split(sep)
                    .map((element) => element.trim())
                    .filter((element) => element !== '')
            );
        }}
    />
</div>
