<script lang="ts">
    import { untrack } from 'svelte';
    import type { FormOptions } from '$lib/req-types';
    let {
        fieldName,
        fieldTable,
        defaultVal,
        field,
        setValue
    }: {
        fieldName: string;
        field: FormOptions;
        defaultVal: string[];
        fieldTable: { [key: string]: string };
        setValue: (val: string[]) => void;
    } = $props();

    $effect(() => {
        untrack(() => {
            defaultVal.forEach((ele) => {
                // it's 100% that fieldOptions[field] will have ele as its key
                //@ts-ignore
                if (fieldOptions[field][ele as keyof {}] !== undefined) {
                    //@ts-ignore
                    fieldOptions[field][ele as keyof {}] = true;
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
                array.push(key);
            }
        });
        setValue(array);
    });

    let fieldOptions = $state({
        n: { sg: false, pl: false, bp: false },
        g: { m: false, f: false },
        p: { pos: false, neg: false },
        e: {},
        s: {
            p1: false,
            p2: false,
            p3: false
        },
        o: {
            p1: false,
            p2: false,
            p3: false
        },
        on: { sg: false, pl: false, bp: false },
        og: { m: false, f: false },
        io: {
            p1: false,
            p2: false,
            p3: false
        },
        ion: {
            sg: false,
            pl: false,
            bp: false
        },
        iog: { m: false, f: false },
        t: { pf: false, ip: false, im: false }
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
                <!-- it's 100% that fieldOpions[field] has key -->
                <input
                    type="checkbox"
                    bind:checked={fieldOptions[field][key as keyof {}]}
                    class="checkbox checkbox-sm"
                />
                <span class="text-sm">{fieldTable[key]}</span>
            </label>
        {/each}
    </div>
</div>
