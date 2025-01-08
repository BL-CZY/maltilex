<script lang="ts">
    type Props = {
        word: string;
        pos: string;
        matched: string;
        en: Array<string>;
    };

    let props: Props = $props();
    let { word, pos, matched, en } = props;
</script>

<div class="my-2 flex w-full justify-center">
    <button
        class="btn bg-base-100 hover:bg-accent hover:text-accent-content min-h-[100px] w-[90%] p-4 shadow-md"
    >
        <div class="flex w-full items-start justify-between gap-4">
            <div class="ml-10 flex-1 text-left">
                <p class="text-lg font-medium">{word}</p>
                <p class="text-base-content/70 text-sm">matched: {matched}</p>
            </div>

            <div class="ml-10 flex-1 text-left">
                <p class="text-base">{pos}.</p>
            </div>

            <div class="flex flex-[8] flex-col items-start space-y-1">
                {#each en as ele}
                    <p class="text-lef text-sm">{ele}</p>
                {/each}
            </div>
        </div>
    </button>
</div>
