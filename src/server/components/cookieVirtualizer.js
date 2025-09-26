export async function virtualizeCookie(cookieHeader) {
	if (!cookieHeader) return {};

	const entries = cookieHeader
		.split(';')
		.map((slice) => slice.trim())
		.filter(Boolean)
		.map((pair) => {
			const index = pair.indexOf('=');
			const name = decodeURIComponent(pair.substring(0, index));
			const value = decodeURIComponent(pair.substring(index + 1));
			return [name, value];
		});

	return Object.fromEntries(entries);
}
