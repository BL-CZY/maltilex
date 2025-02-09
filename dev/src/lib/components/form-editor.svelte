<script lang="ts">
    import type { Form, FormOptions } from '$lib/req-types';
    import CheckEditor from './check-editor.svelte';
    import ListEditor from './list-editor.svelte';
    import type { FormFieldsMap } from '$lib/req-types';
    import StrEditor from './str-editor.svelte';
    import { slide } from 'svelte/transition';
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
        m: 'masculine',
        f: 'feminine',
        pos: 'positive',
        neg: 'negative',
        p1: 'first person',
        p2: 'second person',
        p3: 'third person',
        pf: 'perfect',
        ip: 'imperfect',
        im: 'imperative'
    });

    let optionTable = $state({
        n: 'Number',
        g: 'Gender',
        p: 'Polarity',
        e: 'Extra',
        s: 'Subject',
        o: 'Object',
        on: 'Object Number',
        og: 'Object Gender',
        io: 'Indirect Object',
        ion: 'Indirect Object Number',
        iog: 'Indirect Object Gender',
        t: 'Tense'
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

    $effect(() => {
        (Object.keys(formFieldsMap) as FormOptions[]).forEach(
            (key: FormOptions) => {
                if (formFieldsMap[key] !== true) {
                    forms.forEach((form) => {
                        delete form[key];
                    });
                }
            }
        );
    });

    let showFormExplanations = $state(false);

    // $effect(() => {
    //     $inspect(forms);
    // });
</script>

<div class="space-y-6">
    <div class="bg-base-100 rounded-lg p-4">
        <div class="flex gap-2">
            <p class="mb-3 font-semibold">Form Fields:</p>
            <button
                onclick={() => (showFormExplanations = !showFormExplanations)}
                class="btn btn-primary btn-xs">Show explanations</button
            >
        </div>
        {#if showFormExplanations}
            <div
                class="mb-5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm"
                transition:slide
            >
                <article
                    class="prose z-0 mx-auto max-w-3xl p-6"
                    transition:slide
                >
                    <div class="space-y-4">
                        <h1 class="text-lg">
                            You can check the checkboxes to add properties to
                            forms
                        </h1>
                        <section>
                            <h2 class="text-xl font-bold text-gray-800">
                                Number
                            </h2>
                            <p>
                                This refers to whether a word is <span
                                    class="font-semibold">singular</span
                                >
                                (indicating one),
                                <span class="font-semibold">plural</span>
                                (indicating more than one), or
                                <span class="font-semibold">bi-plural</span> (a specific
                                form for when there are two of the items)
                            </p>
                        </section>

                        <section>
                            <h2 class="text-xl font-bold text-gray-800">
                                Gender
                            </h2>
                            <p>
                                Words can be either <span class="font-semibold"
                                    >masculine</span
                                >
                                or <span class="font-semibold">feminine</span>
                            </p>
                        </section>

                        <section>
                            <h2 class="text-xl font-bold text-gray-800">
                                Polarity
                            </h2>
                            <p>
                                This refers to whether the word form is <span
                                    class="font-semibold">positive</span
                                >
                                or <span class="font-semibold">negative</span>
                            </p>
                        </section>

                        <section>
                            <h2 class="text-xl font-bold text-gray-800">
                                Subject
                            </h2>
                            <p>
                                This indicates the <span class="font-semibold"
                                    >grammatical subject</span
                                > of a verb (who/what is performing the action)
                            </p>
                        </section>

                        <section>
                            <h2 class="text-xl font-bold text-gray-800">
                                Object
                            </h2>
                            <p>
                                The <span class="font-semibold"
                                    >direct recipient</span
                                > of an action in a sentence
                            </p>

                            <ul class="list-disc pl-6">
                                <li>
                                    <span class="font-semibold"
                                        >Object Number:</span
                                    > Whether the object is singular or plural
                                </li>
                                <li>
                                    <span class="font-semibold"
                                        >Object Gender:</span
                                    > The gender (masculine/feminine) of the object
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 class="text-xl font-bold text-gray-800">
                                Indirect Object
                            </h2>
                            <p>
                                A <span class="font-semibold"
                                    >third participant</span
                                > in the action, typically the recipient or beneficiary
                                of the action (often marked by prepositions like
                                "to" or "for" in English)
                            </p>

                            <ul class="mt-2 list-disc pl-6">
                                <li>
                                    <span class="font-semibold"
                                        >Indirect Object Number:</span
                                    > Whether the indirect object is singular or
                                    plural
                                </li>
                                <li>
                                    <span class="font-semibold"
                                        >Indirect Object Gender:</span
                                    > The gender of the indirect object
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 class="text-xl font-bold text-gray-800">
                                Tense
                            </h2>
                            <p>
                                The <span class="font-semibold"
                                    >time reference</span
                                > of a verb (past, present, future, etc.)
                            </p>
                        </section>

                        <section>
                            <h2 class="text-xl font-bold text-gray-800">
                                Extra
                            </h2>
                            <p>Extra information about this form</p>
                        </section>
                    </div>
                </article>
            </div>
        {/if}
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
                    <span class="text-sm">{optionTable[option]}</span>
                </label>
            {/each}
        </div>
    </div>

    {#each forms as form, i}
        <div
            class="bg-base-100 space-y-4 rounded-lg border border-gray-200 p-4 shadow-sm"
        >
            <StrEditor
                fieldName="Word"
                bind:data={form.w}
                description={'The spelling of the form.'}
                placeholder={'kotba'}
            />
            <StrEditor
                fieldName="Phonetic"
                bind:data={form.ph}
                description={"The IPA phonetic symbols of this form. If you don't know, tou can leave it blank."}
                placeholder={'/kotba/'}
            />
            <ListEditor
                fieldName="English"
                setValue={(val) => {
                    form.en = val;
                }}
                sep=","
                defaultVal={form.en}
                placeholder={'Use "," to separate words'}
                description={'The English meanings of this form.'}
            />

            {#each formFields as field}
                <div class="mt-2">
                    {#if field === 'e'}
                        <ListEditor
                            fieldName={optionTable[field]}
                            setValue={(val) => {
                                form[field] = val;
                            }}
                            sep=","
                            defaultVal={form[field] ?? []}
                            placeholder={'Use "," to separate words'}
                            description={'Extra information about this form.'}
                        />
                    {:else}
                        <CheckEditor
                            fieldName={optionTable[field]}
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
