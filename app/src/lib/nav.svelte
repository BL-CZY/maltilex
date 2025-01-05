<header class="bg-base-100 border-base-200 border-b shadow-sm">
	<div class="navbar mx-auto flex min-h-16 max-w-7xl items-center justify-center px-4">
		<div class="flex-none gap-2"><a class="btn btn-ghost btn-md" href="/">Home</a></div>
		<form class="flex-1 justify-center" action="/search" method="POST">
			<input
				class="input input-sm input-bordered w-[50%]"
				placeholder="Search something..."
				type="text"
			/>
			<input class="btn btn-sm ml-2" type="submit" value="search" />
		</form>
		<div class="flex-none gap-2"><a class="btn btn-ghost btn-md" href="/about">About</a></div>
	</div>
</header>
