<script lang="ts">
    import '../app.css';
    let { children } = $props();

    import Nav from '$lib/nav.svelte';
    import { setContext } from 'svelte';

    let isLoading = $state({ value: true });
    let element: HTMLElement | undefined = $state();
    setContext('isLoading', isLoading);
</script>

<Nav
    setLoading={(state: boolean) => {
        isLoading.value = state;
    }}
    bind:ref={element}
/>

{@render children()}

<svelte:window
    on:keydown={() => {
        if (element) {
            if (element != document.activeElement) {
                element.focus();
            }
        }
    }}
/>
