<script lang="ts">
    import type { Form, Word } from '$lib/common/index.js';
    import type { AddRequestFull } from '$lib/req-types.js';
    import WordEditor from '$lib/word-editor.svelte';
    import { StreamlinedToForm } from '$lib/utils.js';
    import { goto } from '$app/navigation';

    let { data } = $props();
    let req: AddRequestFull | null = $state(null);
    let { supabase } = $derived(data);

    $effect(() => {
        req = data.result.ok();
    });
</script>

{#if req === null}
    <p>not found</p>
{:else}
    <WordEditor
        bind:word={
            {
                word: req.w,
                phonetic: req.ph,
                part_of_speech: req.p,
                root: req.r,
                forms: req.f.map((ele) => {
                    return StreamlinedToForm(ele);
                }),
                en_display: req.ed,
                examples: req.ex,
                contributors: [
                    {
                        profile_id: req.profile_id,
                        time_created: req.time_created
                    }
                ],
                related: req.re
            } satisfies Word
        }
        en_extra={req.et}
        mt_extra={req.mt}
        callback={async () => {
            const { error } = await supabase.from('words').insert({
                w: req?.w,
                ph: req?.ph,
                p: req?.p,
                r: req?.r,
                f: req?.f,
                ed: req?.ed,
                et: req?.et,
                mt: req?.mt,
                ex: req?.ex,
                c: [
                    {
                        profile_id: req?.profile_id,
                        time_created: req?.time_created
                    }
                ],
                re: req?.re
            });

            if (error) {
                goto('/dashboard/fail');
            } else {
                goto('/dashboard/success');
            }
        }}
    />
{/if}
