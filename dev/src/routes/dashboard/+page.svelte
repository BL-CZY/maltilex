<script lang="ts">
    const { data } = $props();
    const { req } = $derived(data);
</script>

<div class="mx-5 flex gap-2">
    <div
        class="bg-base-100 flex flex-1 flex-col items-center space-y-4 rounded-md p-5 text-center shadow-lg"
    >
        <p>Your add requests</p>
        <div
            class="flex max-h-svh w-[80%] flex-col items-center gap-2 overflow-y-auto"
        >
            {#each req as { id, w, state }}
                <a href="/dashboard/add/{id}" class="btn w-full max-w-md">
                    <div class="flex w-full items-center justify-between">
                        <p class="flex-[0.1] text-left">{id}</p>
                        <p class="flex-1 text-left">{w}</p>
                        <p class="text-right">
                            {(() => {
                                if (state == '0') {
                                    return 'In Progress';
                                } else if (state == '1') {
                                    return 'In Review';
                                } else if (state == '2') {
                                    return 'Accepted';
                                } else {
                                    return 'Canceled';
                                }
                            })()}
                        </p>
                    </div>
                </a>
            {/each}
        </div>
        <a href="/dashboard/add" class="btn btn-primary"> Add Word </a>
    </div>
    <div class="bg-base-100 min-h-10 flex-1"></div>
</div>
