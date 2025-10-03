import crypter from '../../components/crypter.js';
import view from '../../views/default.js';
import { fetchWebAuthnCredentials } from './modules/fetchWebAuthnCredentials.js';

export async function handleDefault({ cf, env, ctx, lang, nonce, cookie, params, requestHeaders, relyingParty, responseHeaders }) {
	if (cookie['encrypted_email']) {
		const credential = await fetchWebAuthnCredentials(env);
		if (!credential) throw new Error('Invalid "encrypted_email" cookie');
	}
	return new Response(await utils.pageGenerator(env, lang, await view(lang, await relyingParty), nonce, cookie, requestHeaders), {
		status: 200,
		headers: responseHeaders,
	});
}
