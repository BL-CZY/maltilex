<script lang="ts">
    import { page } from '$app/state';

    let is_signup = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center">
    <div class="card bg-base-100 w-96 shadow-xl">
        <div class="card-body">
            <form method="POST" action="?/login" class="space-y-4">
                {#if is_signup}
                    <div class="form-control w-full">
                        <span class="label-text">Username</span>
                        <input
                            name="username"
                            type="username"
                            class="input input-bordered w-full"
                            required
                        />
                    </div>
                {/if}

                <div class="form-control w-full">
                    <span class="label-text">Email</span>
                    <input
                        name="email"
                        type="email"
                        class="input input-bordered w-full"
                        required
                    />
                </div>

                <div class="form-control w-full">
                    <span class="label-text">Password</span>
                    <input
                        name="password"
                        type="password"
                        class="input input-bordered w-full"
                        required
                    />
                </div>
                <div class="mt-6 flex flex-col gap-3">
                    {#if is_signup}
                        <button
                            formaction="?/signup"
                            class="btn btn-primary w-full">Signup</button
                        >
                        <button
                            onclick={() => {
                                is_signup = false;
                            }}
                            class="link text-base-content w-full text-sm font-bold"
                        >
                            Have an account? Log in
                        </button>
                    {:else}
                        <button class="btn btn-primary w-full">Login</button>
                        <button
                            onclick={() => {
                                is_signup = true;
                            }}
                            class="link text-base-content w-full text-sm font-bold"
                        >
                            No account? Sign up
                        </button>
                    {/if}
                    {#if page.url.searchParams.get('msg')}
                        <p class="mb-[-15px] text-center text-sm text-red-600">
                            {page.url.searchParams.get('msg')}
                        </p>
                    {/if}
                </div>
            </form>
        </div>
    </div>
</div>
