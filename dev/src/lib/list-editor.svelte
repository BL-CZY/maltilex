<script lang="ts">
    import { untrack } from 'svelte';

    let {
        fieldName,
        setValue,
        defaultVal,
        sep,
        placeholder
    }: {
        fieldName: string;
        setValue: (value: string[]) => void;
        defaultVal: string[];
        sep: string;
        placeholder: string;
    } = $props();

    let value: string = $state('');

    $effect(() => {
        untrack(() => {
            value = '';
            defaultVal.forEach((ele, i) => {
                untrack(() => {
                    value += ele;
                    if (i != defaultVal.length - 1) {
                        value += sep + ' ';
                    }
                });
            });
        });
    });
</script>

<div class="flex w-full items-center gap-2">
    <p class="font-medium text-gray-700 sm:min-w-32">
        {fieldName}:
    </p>
    {#if sep === '\n'}
        <textarea
            class="textarea textarea-bordered w-full
            max-w-lg"
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
        ></textarea>
    {:else}
        <input
            type="text"
            class="input input-bordered focus:ring-primary input-sm w-full max-w-lg focus:ring-2"
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
    {/if}
</div>
