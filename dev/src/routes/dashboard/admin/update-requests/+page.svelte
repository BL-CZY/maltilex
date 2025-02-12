<script lang="ts">
    import ReqEntry from '$lib/components/req-entry.svelte';
    import type { AddRequestFull } from '$lib/req-types.js';
    import { getProfile } from '$lib/utils.js';

    let { data } = $props();
    let { supabase } = $derived(data);

    const getReq = async () => {
        const { data, error } = await supabase
            .from('update_requests_ready')
            .select('id, w, profile_id, time_created');
        if (error) {
            throw new Error(error.message);
        }

        return data as AddRequestFull[];
    };
</script>

<div class="flex justify-center">
    <div class="bg-base-100 max-w-lg flex-1 rounded-lg px-10 py-5 shadow-lg">
        {#await getReq() then list}
            {#each list as req}
                <ReqEntry
                    {req}
                    getProfile={(id) => {
                        return getProfile(id, supabase);
                    }}
                    path="update-requests"
                />
            {/each}
            {#if list.length == 0}
                <p>No requests now</p>
            {/if}
        {:catch e}
            <p>Error fetching list: {String(e)}</p>
        {/await}
    </div>
</div>
