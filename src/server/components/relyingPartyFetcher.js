export async function fetchRelyingParty(env, clientId) {
	return env.AAOTW_RP_REGISTRY.prepare(
		/*sql*/ `
        SELECT * FROM aaotw_client WHERE client_id = ? LIMIT 1
        `
	)
		.bind(clientId)
		.first();
}
