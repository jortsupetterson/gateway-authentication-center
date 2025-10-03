const crypter = {
	async getEightDigits() {
		const buf = new Uint32Array(1);
		for (;;) {
			crypto.getRandomValues(buf);
			const x = buf[0];
			if (x < LIMIT) {
				const n = x % MOD;
				return n.toString().padStart(8, '0');
			}
		}
	},

	async getProofKeyForCodeExchange() {
		const array = new Uint8Array(96);
		crypto.getRandomValues(array);
		// base64url ilman riippuvuuksia
		const verifier = btoa(String.fromCharCode(...array))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

		const buf = await crypto.subtle.digest('SHA-256', te.encode(verifier));
		const challenge = btoa(String.fromCharCode(...new Uint8Array(buf)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

		return { verifier, challenge };
	},

	async verifyProofKeyForCodeExchange(challenge, verifier) {
		const digest = await crypto.subtle.digest('SHA-256', te.encode(verifier));
		const computed = btoa(String.fromCharCode(...new Uint8Array(digest)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
		return computed === challenge;
	},
};
export { crypter };
