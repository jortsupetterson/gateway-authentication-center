const __hmacKeyCache = new Map();

async function getHmacKey(secret) {
	const raw = secret instanceof Uint8Array ? secret : te.encode(String(secret));
	const cacheId = utils.byteCodec.toBase64url('bytes', raw); // turvallinen cache-avain binäärille
	let p = __hmacKeyCache.get(cacheId);
	if (!p) {
		p = crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
		__hmacKeyCache.set(cacheId, p);
	}
	return p;
}

const maccer = {
	async mac(seed, secret, bytes = 32, namespace = '') {
		// clampataan bytes välille 1..32
		bytes = Math.min(32, Math.max(1, bytes | 0));

		const key = await getHmacKey(secret);

		let msg = seed instanceof Uint8Array ? seed : te.encode(String(seed));
		if (namespace && namespace.length) {
			const ns = te.encode(namespace + '\x1c');
			const merged = new Uint8Array(ns.length + msg.length);
			merged.set(ns, 0);
			merged.set(msg, ns.length);
			msg = merged;
		}

		const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, msg));
		return mac.subarray(0, bytes); // suoraan Uint8Array, ei konversioita
	},
};
export { maccer };
