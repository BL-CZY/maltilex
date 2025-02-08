<script lang="ts">
    import type { Form, FormOptions } from '$lib/req-types';
    import CheckEditor from './check-editor.svelte';
    import ListEditor from './list-editor.svelte';
    import type { FormFieldsMap } from '$lib/req-types';
    import StrEditor from './str-editor.svelte';
    let {
        forms = $bindable(),
        formFieldsMap = $bindable(),
        deleteItem
    }: {
        forms: Array<Form>;
        formFieldsMap: FormFieldsMap;
        deleteItem: (index: number) => void;
    } = $props();

    let fields: FormOptions[] = [
        'n',
        'g',
        'p',
        'e',
        's',
        'o',
        'on',
        'og',
        'io',
        'ion',
        'iog',
        't'
    ];

    let fieldTable = $state({
        sg: 'singular',
        pl: 'plural',
        bp: 'bi-plural',
        m: 'male',
        f: 'female',
        pos: 'positive',
        neg: 'negative',
        p1: 'first person',
        p2: 'second person',
        p3: 'third person',
        pf: 'perfect',
        ip: 'imperfect',
        im: 'imperative'
    });

    let formFields = $derived.by(() => {
        let result: FormOptions[] = [];
        (Object.keys(formFieldsMap) as FormOptions[]).forEach(
            (key: FormOptions) => {
                if (formFieldsMap[key] === true) {
                    result.push(key);
                }
            }
        );
        return result;
    });

    // $effect(() => {
    //     $inspect(forms);
    // });
</script>

<div class="space-y-6">
    <div class="bg-base-100 rounded-lg p-4">
        <p class="mb-3 font-semibold">Form Fields:</p>
        <div class="flex flex-wrap gap-3">
            {#each fields as option}
                <label
                    class="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 shadow-sm"
                >
                    <input
                        type="checkbox"
                        class="checkbox checkbox-sm"
                        bind:checked={formFieldsMap[option]}
                    />
                    <span class="text-sm">{option}</span>
                </label>
            {/each}
        </div>
    </div>

    {#each forms as form, i}
        <div
            class="bg-base-100 space-y-4 rounded-lg border border-gray-200 p-4 shadow-sm"
        >
            <StrEditor fieldName="Word" bind:data={form.w} />
            <StrEditor fieldName="Phonetic" bind:data={form.ph} />
            <ListEditor
                fieldName="English"
                setValue={(val) => {
                    form.en = val;
                }}
                sep=","
                defaultVal={form.en}
                placeholder={'Use "," to separate words'}
            />

            {#each formFields as field}
                <div class="mt-2">
                    {#if field === 'e'}
                        <ListEditor
                            fieldName={field}
                            setValue={(val) => {
                                form[field] = val;
                            }}
                            sep=","
                            defaultVal={form[field] ?? []}
                            placeholder={'Use "," to separate words'}
                        />
                    {:else}
                        <CheckEditor
                            fieldName={field}
                            setValue={(val) => {
                                form[field] = val;
                            }}
                            defaultVal={form[field] ?? []}
                            {fieldTable}
                            {field}
                        />
                    {/if}
                </div>
            {/each}

            <button
                class="btn btn-outline btn-error btn-sm mt-4"
                onclick={() => deleteItem(i)}
            >
                Remove form
            </button>
        </div>
    {/each}

    <button
        class="btn btn-primary btn-sm"
        onclick={() => {
            forms.push({
                w: '',
                ph: '',
                en: ['']
            } satisfies Form);
        }}
    >
        Add form
    </button>
</div>
