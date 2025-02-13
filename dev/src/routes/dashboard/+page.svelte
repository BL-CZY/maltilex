<script lang="ts">
    import ReqDisplay from '$lib/components/req-display.svelte';

    const { data } = $props();
    const { addReqs, updateReqs } = $derived(data);
</script>

<div class="mx-5 flex gap-2">
    <div
        class="bg-base-100 flex flex-1 flex-col items-center space-y-4 rounded-md p-5 text-center shadow-lg"
    >
        <p>Your add requests</p>
        <ReqDisplay reqs={addReqs} path="add" />
        <a href="/dashboard/add/new" class="btn btn-primary"> Add Word </a>
    </div>
    <div
        class="bg-base-100 flex flex-1 flex-col items-center space-y-4 rounded-md p-5 text-center shadow-lg"
    >
        <p>Your Update Requests</p>
        <ReqDisplay reqs={updateReqs} path="update" />
        <a href="/dashboard/update" class="btn btn-primary">Update Word</a>
    </div>
</div>
