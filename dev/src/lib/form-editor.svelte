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

    let fieldTable = $state({
        singular: 'sg',
        plural: 'pl',
        'bi-plural': 'bp',
        male: 'm',
        female: 'f',
        positive: 'pos',
        negative: 'neg',
        'first person': 'p1',
        'second person': 'p2',
        'third person': 'p3',
        perfect: 'pf',
        imperfect: 'ip',
        imperative: 'im'
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
    //     $inspect(formOptionsMap);
    //     $inspect(formOptions);
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
                            bind:fields={fieldOptions[field]}
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
