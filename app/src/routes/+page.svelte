<script lang="ts">
    import SearchBarMain from '$lib/search-bar-main.svelte';
    let element: HTMLElement | undefined = $state();
</script>

<h1 class="text-content mt-[150px] select-none text-center text-8xl font-bold">Maltilex</h1>
<p class="text-base-content mb-3 select-none text-center font-bold">A Maltese Dictionary</p>
<SearchBarMain bind:ref={element} />

<svelte:window
    on:keydown={() => {
        if (element) {
            if (element != document.activeElement) {
                element.focus();
            }
        }
    }}
/>
