<script lang="ts">
    import { type Form, type Word, type FormField } from '$lib/search-types';
    import { type Filter, type FilterField } from '$lib/filter';

    type Props = {
        word: Word;
    };

    let props: Props = $props();
    let { word } = $derived(props);

    let formNames: FormField[] = $state([]);
    let filter: Filter = $state({});

    $effect(() => {
        if (word.forms.length == 0) {
            return;
        }

        formNames = Object.keys(word.forms[0]) as FormField[];
        filter = {};
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
                {#each formNames as name}
                    <th>{name}</th>
                {/each}
            </tr>
            {#each word.forms as form}
                <tr>
                    {#each formNames as name}
                        <td>{form[name]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
