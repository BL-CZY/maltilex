export const actions = {
	default: async ({ fetch }) => {
		try {
			let res = await fetch('http://127.0.0.1:3000/');
			let data = await res.json();
			return { a: 'a' };
		} catch (e) {
			// console.log(e);
			return { err: true };
		}
	}
};
