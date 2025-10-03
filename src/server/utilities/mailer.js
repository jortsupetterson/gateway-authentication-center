let __accessKey;

/**
 * Hakee ja välimuistittaa ACS access keyn Cloudflare Secrets Storesta.
 * @param {Object} env - Cloudflare Workersin ympäristö.
 * @returns {Promise<string>} Palauttaa access keyn merkkijonona.
 */
async function getAccessKey(env) {
	if (__accessKey) return __accessKey;
	__accessKey = await env.ACS_ACCESS_KEY.get();
	return __accessKey;
}

export const mailer = {
	/**
	 * Lähettää sähköpostin Azure Communication Services -sähköpostipalvelun kautta.
	 * @param {Object} env - Cloudflare Workersin ympäristö.
	 * @param {Object} body - Lähetettävän viestin sisältö.
	 * @param {string} body.senderAddress - Lähettäjän osoite.
	 * @param {{to: {address: string, displayName?: string}[]}} body.recipients - Vastaanottajien lista.
	 * @param {{subject: string, plainText?: string, html?: string}} body.content - Viestin sisältö (otsikko, plainText, html).
	 * @param {{address: string}[]=} body.replyTo - Valinnainen reply-to osoitejoukko.
	 * @param {boolean=} body.userEngagementTrackingDisabled - Valinnainen seurantakytkin.
	 * @returns {Promise<{status: number, requestId: string|null, operationLocation: string|null}>} Vastauksen metatiedot.
	 */
	async send(env, body) {
		const te = new TextEncoder();
		const method = 'POST';
		const endpoint = env.ACS_EMAIL_ENDPOINT;
		const url = new URL(endpoint);
		const pathAndQuery = url.pathname + url.search;
		const dateRfc1123 = new Date().toUTCString();

		// Salausavain (base64 -> Uint8Array)
		const keyBytes = Uint8Array.from(atob(await getAccessKey(env)), (c) => c.charCodeAt(0));

		// Body + hash
		const bodyJson = JSON.stringify(body);
		const bodyHashBytes = new Uint8Array(await crypto.subtle.digest('SHA-256', te.encode(bodyJson)));
		const bodyHashB64 = btoa(String.fromCharCode(...bodyHashBytes));

		// String to sign
		const stringToSign = `${method}\n${pathAndQuery}\n${dateRfc1123};${url.host};${bodyHashB64}`;

		// HMAC-allekirjoitus
		const hmacKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
		const sigBytes = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, te.encode(stringToSign)));
		const signature = btoa(String.fromCharCode(...sigBytes));

		const auth = `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`;

		// Lähetys
		const res = await fetch(endpoint, {
			method,
			headers: {
				Authorization: auth,
				'x-ms-date': dateRfc1123,
				'x-ms-content-sha256': bodyHashB64,
				'Content-Type': 'application/json',
			},
			body: bodyJson,
		});

		return {
			status: res.status,
			requestId: res.headers.get('x-ms-request-id') || null,
			operationLocation: res.headers.get('operation-location') || null,
		};
	},
};
