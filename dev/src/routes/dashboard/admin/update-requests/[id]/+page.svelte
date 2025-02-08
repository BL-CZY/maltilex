<script lang="ts">
    import WordEditor from '$lib/components/word-editor.svelte';
    import { goto } from '$app/navigation';
    import type { FormFieldsMap, Word, WordFullNoID } from '$lib/req-types.js';
    import StrEditor from '$lib/components/str-editor.svelte';
    import { saveRequest } from '$lib/req.js';
    import { genTokens, track } from '$lib/utils.js';

    let { data } = $props();
    let { supabase, id } = $derived(data);
    let { word, formFieldsMap, req } = $derived(data);
    let wordBind: undefined | Word = $state();
    let formFieldsMapBind: undefined | FormFieldsMap = $state();

    $effect(() => {
        wordBind = word;
        formFieldsMapBind = formFieldsMap;
        return () => {
            clearTimeout(timeout);
        };
    });

    let timeout: ReturnType<typeof setTimeout>;

    $effect(() => {
        track(wordBind);
        clearTimeout(timeout);
        timeout = setTimeout(save, 1000);
    });

    const transferTo = async (table: string, cancel: boolean) => {
        const { error } = await supabase.from(table).insert({
            ...word,
            user_id: req.user_id,
            time_created: req.time_created,
            profile_id: req.profile_id,
            state: cancel ? 1 : req.state,
            note: req.note
        });

        if (error) {
            console.log(error.message);
        }

        await supabase.from('update_requests_ready').delete().eq('id', id);
    };

    const approve = async () => {
        genTokens(word);
        const getRes = await supabase
            .from('words')
            .select('c')
            .eq('id', req.word_id);

        if (getRes.error || !getRes.data[0]) {
            console.log(getRes.error);
            return;
        }

        let contributors = getRes.data[0].c as {
            profile_id: number;
            time_contributed: string;
        }[];

        contributors.push({
            profile_id: req.profile_id,
            time_contributed: req.time_created
        });

        const { error } = await supabase
            .from('words')
            .update({
                ...word,
                c: contributors
            } satisfies WordFullNoID)
            .eq('id', req.word_id);

        if (!error) {
            await transferTo('add_requests_arch', false);
            goto('/dashboard/success?url=/dashboard/admin');
        } else {
            goto(`/dashboard/fail?url=/dashboard/admin&msg=${error.message}`);
        }
    };

    let msg = $state('');

    let isSaving = $state(false);

    let save = async () => {
        if (wordBind) {
            isSaving = true;
            await saveRequest(
                supabase,
                $state.snapshot(wordBind),
                id,
                'update_requests_ready'
            );

            isSaving = false;
        }
    };

    let cancel = async () => {
        req.note.push(msg);
        await transferTo('update_requests', true);

        goto('/dashboard/success?url=/dashboard/admin');
    };

    // $effect(() => {
    //     $inspect(wordBind);
    // });
</script>

{#snippet control()}
    <StrEditor fieldName="Extra notes" bind:data={msg} />
    <div class="flex justify-center gap-2">
        <button onclick={approve} class="btn btn-primary">
            Approve Add Request
        </button>
        <button onclick={cancel} class="btn btn-outline btn-error"
            >Cancel Request</button
        >
        <button class="btn btn-secondary" onclick={save} disabled={isSaving}>
            {#if isSaving}
                Saving...
            {:else}
                Save Progress
            {/if}
        </button>
    </div>
{/snippet}

{#if formFieldsMapBind && wordBind}
    <WordEditor
        bind:word={wordBind}
        bind:formFieldsMap={formFieldsMapBind}
        {control}
        notes={req.note}
        {supabase}
    />
{/if}
