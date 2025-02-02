<script lang="ts">
    import type { Form, FormOptions } from '$lib/common/index';
    import CheckEditor from './check-editor.svelte';
    import ListEditor from './list-editor.svelte';
    import type { FormFieldsMap } from './req-types';
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
        'number',
        'gender',
        'polarity',
        'extra',
        'subject',
        'object',
        'object_number',
        'object_gender',
        'indirect_object',
        'indirect_object_number',
        'indirect_object_gender',
        'tense'
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
    <div class="rounded-lg bg-gray-50 p-4">
        <p class="mb-3 font-semibold">Form Fields:</p>
        <div class="flex flex-wrap gap-3">
            {#each fields as option}
                <label
                    class="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 shadow-sm"
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
            class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
            <StrEditor fieldName="Word" bind:data={form.word} />
            <StrEditor fieldName="Phonetic" bind:data={form.phonetic} />
            <ListEditor
                fieldName="English"
                setValue={(val) => {
                    form.english = val;
                }}
                sep=","
                defaultVal={form.english}
                placeholder={'Use "," to separate words'}
            />

            {#each formFields as field}
                <div class="mt-2">
                    {#if field === 'extra'}
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
                word: '',
                phonetic: '',
                english: ['']
            } satisfies Form);
        }}
    >
        Add form
    </button>
</div>
