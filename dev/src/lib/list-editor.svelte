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

<div class="flex">
    <p class="text-pretty">{fieldName}:&nbsp</p>
    <input
        type="text"
        class="input input-sm input-bordered"
        {placeholder}
        bind:value
        oninput={() => {
            setValue(
                value
                    .split(sep)
                    .map((element) => {
                        return element.trim();
                    })
                    .filter((element) => {
                        if (element === '') {
                            return false;
                        }
                        return true;
                    })
            );
        }}
    />
</div>
