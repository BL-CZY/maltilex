<script lang="ts">
    import AddEntry from '$lib/components/add-entry.svelte';
    import type { AddRequestFull } from '$lib/req-types.js';
    import { getProfile } from '$lib/utils.js';

    let { data } = $props();
    let { supabase } = $derived(data);

    const getReq = async () => {
        const { data, error } = await supabase
            .from('add_requests_ready')
            .select('id, w, profile_id, time_created')
            .eq('state', 1);
        if (error) {
            throw new Error(error.message);
        }

        return data as AddRequestFull[];
    };
</script>

{#await getReq() then list}
    <ul>
        {#each list as req}
            <AddEntry
                {req}
                getProfile={(id) => {
                    return getProfile(id, supabase);
                }}
            />
        {/each}
    </ul>
{:catch e}
    <p>Error fetching list: {String(e)}</p>
{/await}
