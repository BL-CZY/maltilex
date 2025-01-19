<script lang="ts">
    import '../app.css';
    let { children } = $props();

    import Nav from '$lib/nav.svelte';
    import { setContext } from 'svelte';

    let isLoading = $state({ value: false });
    setContext('isLoading', isLoading);
</script>

<Nav
    setLoading={(state: boolean) => {
        isLoading.value = state;
    }}
/>

{@render children()}
