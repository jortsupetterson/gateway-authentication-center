export async function fetchRelyingParty(env, params) {
	// params voi olla URLSearchParams tai plain object
	const q = params instanceof URLSearchParams ? Object.fromEntries(params) : params;
	const client_id = q.client_id?.trim();
	if (!client_id) return null;

	const row = await env.AAOTW_RP_REGISTRY.prepare(
		/*sql*/ `
      SELECT
        client_id,
        display_name,
        domain,
        domain_verification_status,
        allowed_origins,
        policy_uri,
        tos_uri,
        status,
        redirect_uris,
        response_types,
        scopes
        -- (suosittelen lisäämään sarakkeen logo_uri TEXT NULL)
        -- , logo_uri
      FROM aaotw_clients
      WHERE client_id = ?1
      LIMIT 1
    `
	)
		.bind(client_id)
		.first();

	if (!row) return null;
	if (row.status !== 1) return null; // ei aktiivinen
	if (row.domain_verification_status !== 1) return null; // domain ei verifioitu

	// Syötteet
	const redirect_uri = q.redirect_uri?.trim();
	const response_type = q.response_type?.trim();
	const requestedScopesStr = (q.scopes ?? q.scope ?? '').trim(); // salli 'scope' OIDC-tyyliin
	const code_challenge = q.code_challenge?.trim();
	const code_challenge_method = (q.code_challenge_method ?? 'S256').trim();

	// Sallitut arvot riviltä (JSON-kentät)
	let allowedRedirects, allowedResponseTypes, allowedScopes, allowedOrigins;
	try {
		allowedRedirects = JSON.parse(row.redirect_uris);
		allowedResponseTypes = JSON.parse(row.response_types);
		allowedScopes = JSON.parse(row.scopes);
		allowedOrigins = row.allowed_origins ? JSON.parse(row.allowed_origins) : null;
	} catch {
		// väärä JSON skeemassa → hylätään
		return null;
	}

	// 1) redirect_uri: OIDC-sääntö on käytännössä tarkka string-match (älä tee löysiä prefix-matchoja)
	if (redirect_uri && !allowedRedirects.includes(redirect_uri)) {
		return { error: 'invalid_redirect_uri' };
	}

	// 2) response_type: pitää olla sallittu
	if (response_type && !allowedResponseTypes.includes(response_type)) {
		return { error: 'unsupported_response_type' };
	}

	// 3) scope(t): jokaisen pyydetyn scopen pitää sisältyä sallittuihin
	if (requestedScopesStr) {
		const req = new Set(requestedScopesStr.split(/\s+/).filter(Boolean));
		const allowed = new Set(allowedScopes);
		for (const s of req) {
			if (!allowed.has(s)) return { error: 'invalid_scope', scope: s };
		}
	}

	// 4) PKCE (vaadi S256 koodivirtalle)
	if (response_type === 'code') {
		const b64url = /^[A-Za-z0-9\-_]{43,128}$/; // käytännöllinen raja
		if (!code_challenge || code_challenge_method !== 'S256' || !b64url.test(code_challenge)) {
			return { error: 'invalid_request', error_description: 'PKCE S256 required' };
		}
	}

	// 5) (valinnainen) tarkista että redirect_uri:n host päättyy domainiin (eTLD+1 tarkka vertailu vaatisi PSL-kirjaston)
	if (redirect_uri) {
		try {
			const u = new URL(redirect_uri);
			if (!u.hostname.toLowerCase().endsWith(row.domain.toLowerCase())) {
				return { error: 'invalid_redirect_uri_domain' };
			}
		} catch {
			return { error: 'invalid_redirect_uri_format' };
		}
	}

	// DTO näkymän renderöintiin – vain safe-kentät
	return {
		client_id: row.client_id,
		display_name: row.display_name,
		domain: row.domain,
		logo_uri: row.logo_uri ?? null, // lisää sarake jos haluat logon
		policy_uri: row.policy_uri ?? null,
		tos_uri: row.tos_uri ?? null,
		allowed_origins: allowedOrigins ?? null,

		// heijasta takaisin, jos syötteissä oli nämä – UI voi rakentaa next stepin
		redirect_uri: redirect_uri ?? null,
		response_type: response_type ?? null,
		scopes: requestedScopesStr || null,
	};
}
