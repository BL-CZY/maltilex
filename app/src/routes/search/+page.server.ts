import { PRIVATE_API_URL } from '$env/static/private';

export type SearchResultEntry = {
	word: string;
	distance: number;
	pos: string;
	en: Array<string>;
	matched: string;
};

export const actions = {
	default: async ({ fetch, request }) => {
		console.log('hello');
		try {
			let req = await request.formData();
			let res = await fetch(`${PRIVATE_API_URL}/search`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					keyword: req.get('keyword'),
					// TODO: these should be customizable
					mode: [true, true],
					skip: 0,
					limit: 10,
					maxDis: 5
				})
			});
			let data: Array<SearchResultEntry> = await res.json();
			return { result: data, err: false };
		} catch (e) {
			// console.log(e);
			return { err: true };
		}
	}
};
