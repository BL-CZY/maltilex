<script lang="ts">
    import { goto } from '$app/navigation';
    import type { AddRequestFull } from '../req-types';

    let {
        req,
        getProfile
    }: {
        req: AddRequestFull;
        getProfile: (id: number) => Promise<{ username: string; bio: string }>;
    } = $props();
</script>

<button
    class="btn btn-primary mb-5 mt-5 flex w-[90%] gap-2"
    onclick={() => {
        goto(`/dashboard/admin/add-requests/${req.id}`);
    }}
>
    <p>{req.w}</p>
    {#await getProfile(req.profile_id)}
        <p>loading..</p>
    {:then profile}
        <p>{profile.username}</p>
    {:catch e}
        <p>error: {String(e)}</p>
    {/await}
    <p>{req.time_created}</p>
</button>
