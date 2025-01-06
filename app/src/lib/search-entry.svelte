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

<button class="card-body">
	<div class="flex-1">
		<p>{word}</p>
		<p>{matched}</p>
	</div>
	<p class="flex-1">{pos}</p>
	<div class="flex-1">
		{#each en as ele}
			<p>{ele}</p>
		{/each}
	</div>
</button>
