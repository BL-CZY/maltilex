<script lang="ts">
    import type { Form, FormOptions } from '$lib/common/index';
    import ListEditor from './list-editor.svelte';
    import StrEditor from './str-editor.svelte';
    let { forms = $bindable() }: { forms: Array<Form> } = $props();
    let formOptionsMap = $state({
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

    let options: FormOptions[] = [
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

    let formOptions = $derived.by(() => {
        let result: FormOptions[] = [];
        (Object.keys(formOptionsMap) as FormOptions[]).forEach(
            (key: FormOptions) => {
                if (formOptionsMap[key] === true) {
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
    {#each options as option}
        <div class="flex">
            <input type="checkbox" bind:checked={formOptionsMap[option]} />
            <p>{option}</p>
        </div>
    {/each}
</div>
{#each forms as form}
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
    {#each formOptions as option}
        <ListEditor
            fieldName={option}
            setValue={(val) => {
                form[option] = val;
            }}
            sep=","
            placeholder={'Use "," to separate words'}
        />
    {/each}
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
