import { redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import type { AuthError } from '@supabase/supabase-js';

const handlError = (err: AuthError) => {
	console.log(err.message);
	redirect(303, `/auth?msg=${err.message}`);
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			handlError(error);
		} else {
			let id = (await supabase.auth.getUser()).data.user?.id;
			if (id === undefined) {
				console.log('no id');
				redirect(303, '/auth/error');
			}

			if (error) {
				console.log("can't insert: " + String(error));
				redirect(303, '/auth/error');
			}

			redirect(303, '/dashboard');
		}
	},

	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			handlError(error);
		} else {
			redirect(303, '/dashboard');
		}
	}
};
