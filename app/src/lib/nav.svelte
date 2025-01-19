<script lang="ts">
    import { page } from '$app/state';
    import SearchBar from './search-bar.svelte';

    let {
        setLoading,
        ref = $bindable()
    }: { setLoading: (state: boolean) => void; ref: HTMLElement | undefined } = $props();
</script>

<header class="bg-base-100 border-base-200 fixed left-0 right-0 top-0 z-10 border-b shadow-sm">
    <div class="navbar mx-auto flex min-h-16 max-w-7xl px-4">
        <div class="flex w-full items-center justify-between">
            <div class="flex items-center gap-2">
                <a class="btn btn-ghost btn-md" href="/">Home</a>
            </div>
            {#if page.url.pathname != '/'}
                <SearchBar isMain={false} {setLoading} bind:ref />
            {/if}
            <div class="flex items-center gap-2">
                <a class="btn btn-ghost btn-md" href="/about">About</a>
            </div>
        </div>
    </div>
</header>

<div class="h-[70px]"></div>
