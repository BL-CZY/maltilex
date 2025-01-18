<script lang="ts">
    import { type Form, type Word, type FormField } from '$lib/search-types';
    import { type Filter as FilterType, type FilterField, nameMap } from '$lib/filter';
    import { untrack } from 'svelte';
    import Filter from './filter.svelte';

    type Props = {
        word: Word;
    };

    let props: Props = $props();
    let { word } = $derived(props);

    let formKeyNames: FormField[] = $state([]);
    let displayedForms: Form[] = $state([]);
    let acceptedFilters: FilterType = $state({});
    let filter: FilterType = $state({});

    $effect(() => {
        if (word.forms.length == 0) {
            return;
        }

        let names = Object.keys(word.forms[0]) as FormField[];

        // sort it in the order
        names.sort((a, b) => {
            console.log(a);
            console.log(b);
            console.log((nameMap.get(a) ?? 0) - (nameMap.get(b) ?? 0));
            return (nameMap.get(a) ?? 0) - (nameMap.get(b) ?? 0);
        });

        console.log(names);

        formKeyNames = names;
        filter = {};
        acceptedFilters = {};

        word.forms.forEach((form) => {
            names.forEach((name) => {
                untrack(() => {
                    if (name === 'word' || name === 'phonetic' || name === 'english') {
                        return;
                    }

                    let key = name as FilterField;
                    if (!form[key]) {
                        return;
                    }

                    if (!acceptedFilters[key]) {
                        acceptedFilters[key] = form[key];
                        filter[key] = form[key];
                    } else {
                        form[key].forEach((property) => {
                            if (
                                filter[key] &&
                                acceptedFilters[key] &&
                                !acceptedFilters[key].includes(property)
                            ) {
                                acceptedFilters[key].push(property);
                                filter[key].push(property);
                            }
                        });
                    }
                });
            });
        });
    });

    $effect(() => {
        displayedForms = [];
        word.forms.forEach((form) => {
            let keys = Object.keys(filter) as FilterField[];
            for (const key of keys) {
                let propertyFilter = filter[key];
                if (!propertyFilter) {
                    continue;
                }
                let property = form[key];
                if (!property) {
                    continue;
                }
                let hasAtLeastOne = false;
                for (const val of propertyFilter) {
                    if (property.includes(val)) {
                        hasAtLeastOne = true;
                        break;
                    }
                }
                if (!hasAtLeastOne) {
                    return;
                }
            }
            untrack(() => {
                displayedForms.push(form);
            });
        });
    });
</script>

<div class="flex w-full flex-col gap-6 p-4 md:flex-row">
    <div class="bg-base-100 rounded-lg p-6 text-center shadow-lg md:w-[20%]">
        <h2 class="text-base-content mb-2 text-2xl font-bold">{word.word}</h2>
        <div class="space-y-3">
            <p class="text-base-content/80 text-lg font-medium">{word.phonetic}</p>
            <div class="divider"></div>
            <p class="badge badge-primary">{word.part_of_speech}</p>
            <p class="text-base-content/70 text-sm">{word.root}</p>
            <div class="mt-4 space-y-2">
                {#each word.en_display as en}
                    <p class="text-base-content/90">{en}</p>
                {/each}
            </div>
        </div>
    </div>

    <div class="bg-base-100 min-h-screen overflow-x-auto rounded-lg shadow-lg md:w-[80%]">
        <table class="mb-1 table w-full">
            <tbody>
                <tr class="bg-base-200">
                    {#each formKeyNames as name}
                        {#if name === 'word' || name === 'english' || name === 'phonetic'}
                            <th class="text-base-content min-w-[100px] text-center font-bold"
                                >{(() => {
                                    let display = name.replaceAll('_', ' ');
                                    return display.charAt(0).toUpperCase() + display.slice(1);
                                })()}</th
                            >
                        {:else}
                            <th class="text-center">
                                <Filter
                                    name={(() => {
                                        let display = name.replaceAll('_', ' ');
                                        return display.charAt(0).toUpperCase() + display.slice(1);
                                    })()}
                                    options={acceptedFilters[name as FilterField] ?? []}
                                    callback={(options) => {
                                        filter[name as FilterField] = options;
                                    }}
                                />
                            </th>
                        {/if}
                    {/each}
                </tr>
                {#each displayedForms as form}
                    <tr class="hover:bg-base-200/50 text-center transition-colors">
                        {#each formKeyNames as name}
                            <td class="text-base-content/80">{form[name]}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
        <p class="text-base-content ml-5 font-bold">Examples:</p>
        <ul>
            {#each word.examples as example}
                <li><p>{example}</p></li>
            {/each}
        </ul>
        <p class="text-base-content ml-5 font-bold">Contributors:</p>
        <ul>
            {#each word.contributors as contributor}
                <li><p>{contributor}</p></li>
            {/each}
        </ul>
    </div>
</div>
