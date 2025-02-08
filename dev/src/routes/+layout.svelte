<script lang="ts">
    import '../app.css';
    import { goto, invalidate, invalidateAll } from '$app/navigation';
    import Nav from '$lib/components/nav.svelte';

    let { data, children } = $props();
    let { session, supabase, isAdmin, bio, username, email } = $derived(data);

    $effect(() => {
        const { data } = supabase.auth.onAuthStateChange(
            async (evt, newSession) => {
                if (evt === 'SIGNED_OUT') {
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
    username={String(username)}
    email={String(email)}
    bio={String(bio)}
    loggedIn={session != null}
    logout={async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log(error);
        }
    }}
/>

{@render children()}
