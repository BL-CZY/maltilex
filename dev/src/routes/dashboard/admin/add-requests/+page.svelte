<script lang="ts">
    import type { AddRequestFull } from '$lib/req-types.js';
    import { getProfile } from '$lib/utils.js';

    let { data } = $props();
    let { supabase } = $derived(data);

    type reqInfoShort = {
        id: number;
        word: string;
        user_profile_id: string;
    };

    const getReq = async () => {
        const { data, error } = await supabase.from('add_requests').select('*');
        if (error) {
            throw new Error(error.message);
        }

        return data as AddRequestFull[];
    };
</script>

{#await getReq() then list}
    <ul>
        {#each list as req}
            <div class="flex gap-2">
                <p>{req.w}</p>
                {#await getProfile(req.profile_id, supabase)}
                    <p>loading..</p>
                {:then profile}
                    <p>{profile.username}</p>
                {:catch e}
                    <p>error: {String(e)}</p>
                {/await}
                <p>{req.time_created}</p>
            </div>
        {/each}
    </ul>
{:catch e}
    <p>Error fetching list: {String(e)}</p>
{/await}
