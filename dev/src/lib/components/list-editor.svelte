<script lang="ts">
    import { untrack } from 'svelte';

    let {
        fieldName,
        setValue,
        defaultVal,
        sep,
        placeholder,
        description
    }: {
        fieldName: string;
        setValue: (value: string[]) => void;
        defaultVal: string[];
        sep: string;
        placeholder: string;
        description: string;
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

<div class="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
    <div class="flex flex-col sm:w-32">
        <p class="font-bold text-gray-700">
            {fieldName}:
        </p>
        <p class="text-sm text-gray-500">{description}</p>
    </div>

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
