<script lang="ts">
    type Props = {
        id: string;
        word: string;
        pos: string;
        matched: string;
        en: Array<string>;
        index: number;
    };

    let props: Props = $props();
    let { id, word, pos, matched, en, index } = $derived(props);
</script>

<div class="my-2 flex w-full justify-center">
    <button
        class="btn bg-base-100 hover:bg-accent hover:text-accent-content min-h-[100px] w-[90%] p-4 shadow-md"
    >
        <div class="flex w-full items-start justify-between gap-4">
            <div class="ml-[10px] flex-1 text-left">
                <p class="text-lg font-bold">{word}</p>
                <p class="text-base-content/70 text-sm">matched: {matched}</p>
            </div>

            <div class="flex-1 text-left">
                <p class="text-base">{pos}.</p>
            </div>

            <div class="flex flex-1 flex-col items-start space-y-1">
                {#each en as ele}
                    <p class="text-left text-sm">{ele}</p>
                {/each}
            </div>

            <div class="flex h-[50px] flex-[0.4] items-center">
                <p>{index}</p>
            </div>
        </div>
    </button>
</div>
