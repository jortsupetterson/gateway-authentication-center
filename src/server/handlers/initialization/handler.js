export async function handleInitialization({
	cf,
	env,
	ctx,
	lang,
	nonce,
	cookie,
	params,
	headers,
	pageGenerator,
	relyingParty,
	responseHeaders,
}) {
	const initialEmail = params.email_address;
	const credentialAddress = await env.addressService.getAddressFromEmail(initialEmail);
	if (credentialAddress) {
		await responseHeaders.set('Content-Type', 'application/json');
		return new Response(JSON.stringify(credentialAddress), { status: 200, headers: responseHeaders });
	}
	const oneTimePasscode = await utils.crypter.getEightDigits();

	const state = await utils.maccer.mac(oneTimePasscode);
	const pkce = await utils.crypter.getProofKeyForCodeExchange();
}
