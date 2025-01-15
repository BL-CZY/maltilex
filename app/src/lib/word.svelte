<script lang="ts">
    import { type Form, type Word, type FormField } from '$lib/search-types';
    import { type Filter as FilterType, type FilterField } from '$lib/filter';
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

        formKeyNames = names;
        filter = {};
        acceptedFilters = {};

        untrack(() => {
            word.forms.forEach((form) => {
                names.forEach((name) => {
                    if (name === 'word' || name === 'phon' || name === 'en') {
                        return;
                    }

                    let key = name as FilterField;
                    if (!form[key]) {
                        return;
                    }

                    if (!acceptedFilters[key]) {
                        acceptedFilters[key] = form[key];
                        filter[key] = [];
                    } else {
                        form[key].forEach((property) => {
                            if (acceptedFilters[key] && !acceptedFilters[key].includes(property)) {
                                acceptedFilters[key].push(property);
                            }
                        });
                    }
                });
            });
        });

        $inspect(acceptedFilters);
        $inspect(filter);
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

        $inspect(displayedForms);
    });
</script>

<div>
    <p>{word.word}</p>
    <p>{word.phon}</p>
    <p>{word.root}</p>
    <p>{word.pos}</p>
    {#each word.enDisplay as en}
        <p>{en}</p>
    {/each}
</div>

<div>
    <table>
        <tbody>
            <tr>
                {#each formKeyNames as name}
                    {#if name === 'word' || name === 'en' || name === 'phon'}
                        <th>{name}</th>
                    {:else}
                        <Filter
                            options={acceptedFilters[name as FilterField] ?? []}
                            callback={(options) => {
                                filter[name as FilterField] = options;
                            }}
                        />
                    {/if}
                {/each}
            </tr>
            {#each displayedForms as form}
                <tr>
                    {#each formKeyNames as name}
                        <td>{form[name]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
