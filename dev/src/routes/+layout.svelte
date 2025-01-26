<script lang="ts">
    import '../app.css';
    import { goto, invalidate, invalidateAll } from '$app/navigation';
    import Nav from '$lib/nav.svelte';
    import { onMount } from 'svelte';

    let { data, children } = $props();
    let { session, supabase, isAdmin } = $derived(data);

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange(
            async (evt, newSession) => {
                if (evt === 'SIGNED_OUT') {
                    await goto('/auth');
                    invalidateAll();
                }

                if (newSession?.expires_at !== session?.expires_at) {
                    invalidate('supabase:auth');
                }
            }
        );

        return () => data.subscription.unsubscribe();
    });
</script>

<Nav
    {isAdmin}
    loggedIn={session != null}
    logout={async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log(error);
        }
    }}
/>

{@render children()}
