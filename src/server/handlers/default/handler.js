import crypter from '../../components/crypter.js';
import { fetchWebAuthnCredential } from './modules/fetchWebAuthnCredential.js';

export async function handleDefault({ cf, env, ctx, lang, nonce, cookie, params, headers, pageGenerator, responseHeaders }) {
	if (cookie['encrypted_email']) {
		const credential = await fetchWebAuthnCredential(env);
		if (!credential) throw new Error('Invalid "encrypted_email" cookie');
	}
	return new Response(await pageGenerator(env, lang, nonce, cookie, headers), { status: 200, headers: responseHeaders });
}
