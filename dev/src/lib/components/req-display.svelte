<script lang="ts">
    const {
        reqs,
        path
    }: { reqs: { id: number; w: string; state: number }[]; path: string } =
        $props();
</script>

<div class="flex max-h-svh w-[80%] flex-col items-center gap-2 overflow-y-auto">
    {#each reqs as { id, w, state }}
        <a href="/dashboard/{path}/{id}" class="btn w-full max-w-md">
            <div class="flex w-full items-center justify-between">
                <p class="flex-[0.1] text-left">{id}</p>
                <p class="flex-1 text-left">{w}</p>
                <p class="text-right">
                    {(() => {
                        if (state == 0) {
                            return 'In Progress';
                        } else if (state == 1) {
                            return 'Cancelled';
                        }
                    })()}
                </p>
            </div>
        </a>
    {/each}
</div>
