<script lang="ts">
    import { goto } from '$app/navigation';

    let { data } = $props();
    let { url, msg } = $derived(data);
</script>

<div
    class="card bg-base-100 fixed left-[50%] top-[30%] flex translate-x-[-50%] flex-col items-center justify-center p-10"
>
    <p class="mb-4 text-lg font-medium text-gray-700">{msg}</p>
    <button
        onclick={() => {
            goto(url);
        }}
        class="btn btn-primary">go back</button
    >
</div>
