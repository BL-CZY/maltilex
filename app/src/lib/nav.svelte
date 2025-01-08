<script lang="ts">
    import { goto } from '$app/navigation';

    let value: string;
    const submit = () => {
        goto(`search?keyword=${value.trim()}`);
    };
</script>

<header class="bg-base-100 border-base-200 fixed left-0 right-0 top-0 z-10 border-b shadow-sm">
    <div class="navbar mx-auto flex min-h-16 max-w-7xl items-center justify-center px-4">
        <div class="flex-none gap-2"><a class="btn btn-ghost btn-md" href="/">Home</a></div>
        <form class="flex-1 justify-center" on:submit|preventDefault={submit}>
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
        <div class="flex-none gap-2"><a class="btn btn-ghost btn-md" href="/about">About</a></div>
    </div>
</header>

<div class="h-[70px]"></div>
