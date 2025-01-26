<script lang="ts">
    let {
        loggedIn,
        logout,
        isAdmin,
        email,
        username,
        bio
    }: {
        loggedIn: boolean;
        logout: () => void;
        isAdmin: boolean;
        email: string;
        username: string;
        bio: string;
    } = $props();

    let showPanel = $state(false);
</script>

<header
    class="bg-base-100 border-base-200 fixed left-0 right-0 top-0 border-b shadow-sm"
>
    <nav class="navbar mx-auto min-h-16 max-w-7xl px-4">
        <div class="flex flex-1 gap-2">
            {#if loggedIn}
                <a
                    href="/dashboard"
                    class="btn btn-ghost hover:bg-primary/50 normal-case"
                >
                    Dashboard
                </a>
            {:else}
                <a
                    href="/"
                    class="btn btn-ghost hover:bg-primary/50 normal-case"
                >
                    Home
                </a>
            {/if}

            {#if isAdmin}
                <a
                    href="/admin"
                    class="btn btn-ghost hover:big-primary/50 normal-case"
                    >Admin</a
                >
            {/if}
        </div>

        <div class="flex-none gap-2">
            {#if loggedIn}
                <button
                    onclick={() => {
                        if (loggedIn) {
                            showPanel = true;
                        }
                    }}
                    class="btn btn-ghost hover:bg-secondary/50 normal-case"
                >
                    👤 Account</button
                >
            {:else}
                <a
                    href="/auth"
                    class="btn btn-ghost hover:bg-secondary/50 normal-case"
                >
                    👤 Login
                </a>
            {/if}
        </div>
    </nav>
</header>

{#if loggedIn}
    <div class="drawer drawer-end">
        <input
            id="account-drawer"
            type="checkbox"
            class="drawer-toggle"
            bind:checked={showPanel}
        />

        <div class="drawer-side z-20">
            <label for="account-drawer" class="drawer-overlay"></label>
            <div class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <!-- Account Panel Content -->
                <div class="flex flex-col gap-4">
                    <div
                        class="border-base-300 flex items-center gap-4 border-b pb-4"
                    >
                        <div class="avatar placeholder">
                            <div
                                class="bg-neutral text-neutral-content w-12 rounded-full"
                            >
                                <span>U</span>
                            </div>
                        </div>
                        <div>
                            <h3 class="font-bold">{username}</h3>
                            <p class="text-base-content/70 text-sm">
                                {email}
                            </p>
                            <p class="text-base-content/70 text-sm">
                                {bio}
                            </p>
                        </div>
                    </div>

                    <ul class="menu">
                        <li class="mt-auto">
                            <button
                                onclick={() => {
                                    showPanel = false;
                                    email = '';
                                    logout();
                                }}
                                class="text-error">🚪 Logout</button
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
{/if}

<div class="h-[70px]"></div>
