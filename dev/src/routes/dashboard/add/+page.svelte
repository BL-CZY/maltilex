<script lang="ts">
    import { goto } from '$app/navigation';

    const { data } = $props();
    const { supabase, user, profileID } = $derived(data);

    const callback = async () => {
        const { data, error } = await supabase
            .from('add_requests')
            .insert({
                user_id: user?.id,
                profile_id: profileID ?? 0,
                w: value
            })
            .select();

        if (!error) {
            if (data[0]) {
                console.log('add phase');
                console.log(`/dashboard/add/${data[0].id}`);
                goto(`/dashboard/add/${data[0].id}`);
            }
        }

        console.log(error);
    };

    let value = $state('');
</script>

<p>Input your word</p>
<input type="text" bind:value />
<button onclick={callback}>Add</button>
