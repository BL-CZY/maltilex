<script lang="ts">
    import { goto } from '$app/navigation';
    import type { AddRequestFull } from '../req-types';

    let {
        req,
        getProfile,
        path
    }: {
        req: AddRequestFull;
        getProfile: (id: number) => Promise<{ username: string; bio: string }>;
        path: string;
    } = $props();

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
</script>

<div class="flex w-full justify-center px-4">
    <button
        class="btn btn-primary hover:btn-primary-focus mb-5 mt-5 w-full max-w-2xl transition-all duration-200 ease-in-out"
        onclick={() => goto(`/dashboard/admin/${path}/${req.id}`)}
    >
        <div class="flex w-full items-center justify-between gap-4 px-4">
            <div class="flex-shrink-0 font-medium">
                {req.w}
            </div>

            <div class="flex-grow text-center">
                {#await getProfile(req.profile_id)}
                    <span class="loading loading-dots loading-sm"></span>
                {:then profile}
                    <span class="badge badge-ghost">{profile.username}</span>
                {:catch e}
                    <span class="badge badge-error badge-sm"
                        >Error: {String(e)}</span
                    >
                {/await}
            </div>

            <div class="flex-shrink-0 text-sm opacity-75">
                {formatDate(req.time_created)}
            </div>
        </div>
    </button>
</div>
