<script lang="ts">
    // @ts-nocheck
    import { untrack } from 'svelte';
    import type { FormKey } from './req-types';

    let {
        fieldName,
        fieldTable,
        defaultVal,
        field,
        setValue
    }: {
        fieldName: string;
        field: FormKey;
        defaultVal: string[];
        fieldTable: { [key: string]: string };
        setValue: (val: string[]) => void;
    } = $props();

    $effect(() => {
        $inspect(defaultVal);
        untrack(() => {
            defaultVal.forEach((ele) => {
                // it's 100% that fieldOptions[field] will have ele as its key
                //@ts-ignore
                if (fieldOptions[field][ele] !== undefined) {
                    //@ts-ignore
                    fieldOptions[field][ele] = true;
                }
            });
        });
    });

    $effect(() => {
        let array: string[] = [];
        Object.keys(fieldOptions[field]).forEach((key) => {
            // it's 100% that the key will be in fieldOptions[field]
            //@ts-ignore
            if (fieldOptions[field][key]) {
                array.push(fieldTable[key]);
            }
        });
        setValue(array);
    });

    let fieldOptions = $state({
        number: { singular: false, plural: false, 'bi-plural': false },
        gender: { male: false, female: false },
        polarity: { positive: false, negative: false },
        extra: {},
        subject: {
            'first person': false,
            'second person': false,
            'third person': false
        },
        object: {
            'first person': false,
            'second person': false,
            'third person': false
        },
        object_number: { singular: false, plural: false, 'bi-plural': false },
        object_gender: { male: false, female: false },
        indirect_object: {
            'first person': false,
            'second person': false,
            'third person': false
        },
        indirect_object_number: {
            singular: false,
            plural: false,
            'bi-plural': false
        },
        indirect_object_gender: { male: false, female: false },
        tense: { perfect: false, imperfect: false, imperative: false }
    });
</script>

<div class="flex w-full gap-2">
    <p class="mb-2 block font-medium text-gray-700 sm:min-w-32">
        {fieldName}:
    </p>
    <div class="flex flex-wrap gap-2">
        {#each Object.keys(fieldOptions[field]) as key}
            <label
                class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 shadow-sm hover:bg-gray-50"
            >
                <input
                    type="checkbox"
                    bind:checked={fieldOptions[field][key]}
                    class="checkbox checkbox-sm"
                />
                <span class="text-sm">{key}</span>
            </label>
        {/each}
    </div>
</div>
