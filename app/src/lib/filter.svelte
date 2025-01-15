<script lang="ts">
    import { slide } from 'svelte/transition';

    type Props = {
        options: string[];
        callback: (selectedOptions: string[]) => void;
    };

    let props: Props = $props();
    let { options, callback } = $derived(props);

    let isOpen = $state(false);
    let selectedOptions: Set<string> = new Set();

    function toggleOption(option: string) {
        if (selectedOptions.has(option)) {
            selectedOptions.delete(option);
        } else {
            selectedOptions.add(option);
        }

        callback(Array.from(selectedOptions));
    }

    function togglePanel() {
        isOpen = !isOpen;
    }
</script>

<div class="relative">
    <button
        class="btn btn-primary"
        onclick={togglePanel}
        aria-expanded={isOpen}
        aria-controls="filter-panel"
    >
        {isOpen ? 'Hide Filters' : 'Show Filters'}
    </button>

    {#if isOpen}
        <div
            id="filter-panel"
            class="bg-base-100 absolute top-full z-10 mt-2 w-64 rounded-lg p-4 shadow-lg"
            transition:slide
        >
            <ul class="space-y-2">
                {#each options as option}
                    <li>
                        <label class="flex cursor-pointer items-center space-x-2">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-primary"
                                checked={selectedOptions.has(option)}
                                onchange={() => toggleOption(option)}
                            />
                            <span class="label-text">{option}</span>
                        </label>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
