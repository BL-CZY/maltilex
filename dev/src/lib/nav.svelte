<script lang="ts">
	let { loggedIn, logout }: { loggedIn: boolean; logout: () => void } = $props();
</script>

<header class="bg-base-100 border-base-200 fixed left-0 right-0 top-0 border-b shadow-sm">
	<nav class="navbar mx-auto min-h-16 max-w-7xl px-4">
		<div class="flex-1">
			{#if loggedIn}
				<a href="/dashboard" class="btn btn-ghost hover:bg-primary/50 normal-case"> Dashboard </a>
			{:else}
				<a href="/" class="btn btn-ghost hover:bg-primary/50 normal-case"> Home </a>
			{/if}
		</div>

		<div class="flex-none gap-2">
			{#if loggedIn}
				<button onclick={logout} class="btn btn-ghost hover:bg-secondary/50 normal-case">
					👤 Log out</button
				>
			{:else}
				<a href="/auth" class="btn btn-ghost hover:bg-secondary/50 normal-case"> 👤 Login </a>
			{/if}
		</div>
	</nav>
</header>

<div class="h-[70px]"></div>
