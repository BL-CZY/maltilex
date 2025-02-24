import { Session, SupabaseClient, User } from '@supabase/supabase-js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            supabase: SupabaseClient;
            safeGetSession: () => Promise<{
                session: Session | null;
                user: User | null;
            }>;
            session: Session | null;
            user: User | null;
            username: string | null;
            bio: string | null;
            isAdmin: boolean;
            profileID: number | null;
        }
        interface PageData {
            session: Session | null;
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
