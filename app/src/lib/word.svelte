<script lang="ts">
    import { type Word } from '$lib/search-types';

    type Props = {
        word: Word;
    };

    let props: Props = $props();
    let { word } = $derived(props);
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
