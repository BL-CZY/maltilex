<script lang="ts">
    import type { Word } from '$lib/common/index';
    import FormEditor from '$lib/form-editor.svelte';
    import ListEditor from '$lib/list-editor.svelte';
    import StrEditor from '$lib/str-editor.svelte';
    let word: Word = $state({
        word: '',
        phonetic: '',
        part_of_speech: '',
        root: '',
        forms: [],
        en_display: [],
        examples: [],
        contributors: []
    });
</script>

<StrEditor bind:data={word.word} fieldName="Word" />
<StrEditor bind:data={word.phonetic} fieldName="Phonetic" />
<StrEditor bind:data={word.part_of_speech} fieldName="Part of Speech" />
<StrEditor bind:data={word.root} fieldName="Root" />
<FormEditor
    bind:forms={word.forms}
    deleteItem={(i) => {
        word.forms.splice(i, 1);
    }}
/>
<ListEditor
    fieldName="English"
    sep=","
    placeholder={'use "," to separate words'}
    setValue={(value) => {
        word.en_display = value;
    }}
/>
<ListEditor
    fieldName="Examples"
    sep=","
    placeholder={'Start a new line to separate sentences'}
    setValue={(value) => {
        word.en_display = value;
    }}
/>

<div>
    <pre>{JSON.stringify(word, null, 4)}</pre>
</div>
