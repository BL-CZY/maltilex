<script lang="ts">
    import { goto } from '$app/navigation';
    import { slide } from 'svelte/transition';

    let value: string = $state('');
    let isPanelVisible = $state(false);

    const submit = async () => {
        await goto(`/search?keyword=${value.trim().toLocaleLowerCase()}`);
    };
</script>

<form class="flex-1 justify-center" on:submit|preventDefault={submit}>
    <div></div>
    <input
        class="input input-sm input-bordered w-[50%]"
        placeholder="Search something..."
        type="text"
        name="keyword"
        bind:value
        required
    />
    <input class="btn btn-sm ml-2" type="submit" value="search" />
</form>
