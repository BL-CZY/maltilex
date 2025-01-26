<script lang="ts">
    let { data } = $props();
    let { supabase } = $derived(data);

    type reqInfoShort = {
        id: number;
        word: string;
        user: string;
    };

    let reqList = $state();
</script>
