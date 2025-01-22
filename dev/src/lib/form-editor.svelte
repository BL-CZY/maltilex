<script lang="ts">
    import type { Form, FormOptions } from '$lib/common/index';
    import CheckEditor from './check-editor.svelte';
    import ListEditor from './list-editor.svelte';
    import StrEditor from './str-editor.svelte';
    let {
        forms = $bindable(),
        deleteItem
    }: { forms: Array<Form>; deleteItem: (index: number) => void } = $props();
    let formFieldsMap = $state({
        number: false,
        gender: false,
        polarity: false,
        extra: false,
        subject: false,
        object: false,
        object_number: false,
        object_gender: false,
        indirect_object: false,
        indirect_object_number: false,
        indirect_object_gender: false,
        tense: false
    });

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

<p>Forms:</p>
<div class="flex gap-2">
    {#each fields as option}
        <div class="flex">
            <input type="checkbox" bind:checked={formFieldsMap[option]} />
            <p>{option}</p>
        </div>
    {/each}
</div>
{#each forms as form, i}
    <StrEditor fieldName="Word" bind:data={form.word} />
    <StrEditor fieldName="Phonetic" bind:data={form.phonetic} />
    <ListEditor
        fieldName="English"
        setValue={(val) => {
            form.english = val;
        }}
        sep=","
        placeholder={'Use "," to separate words'}
    />
    {#each formFields as field}
        {#if field === 'extra'}
            <ListEditor
                fieldName={field}
                setValue={(val) => {
                    form[field] = val;
                }}
                sep=","
                placeholder={'Use "," to separate words'}
            />
        {:else}
            <CheckEditor
                fieldName={field}
                setValue={(val) => {
                    form[field] = val;
                }}
                bind:fields={fieldOptions[field]}
            />
        {/if}
    {/each}
    <button
        class="btn btn-outline"
        onclick={() => {
            deleteItem(i);
        }}>Remove form</button
    >
{/each}
<button
    class="btn btn-outline btn-sm"
    onclick={() => {
        forms.push({
            word: '',
            phonetic: '',
            english: ['']
        } satisfies Form);
    }}>Add form</button
>
