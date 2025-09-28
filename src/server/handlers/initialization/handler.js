const DOT_ATOM_LOCAL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
// RFC 1035 label: a–z0–9 (xn-- sallitaan), väleissä - ok, ei alussa/eikä lopussa, 1–63 merkkiä.
const DNS_LABEL_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)$/;

export function normalizeAndValidateEmail(input, { lowercaseLocal = true } = {}) {
	if (typeof input !== 'string') return { ok: false, error: 'type' };

	// 1) Trim + yhdenmukaista whitespace + poista kontrollimerkit
	let s = input.replace(/\p{C}/gu, '').replace(/\s+/g, ' ').trim();
	if (s.length === 0) return { ok: false, error: 'empty' };

	// 2) Varmista tasan yksi @
	const atCount = (s.match(/@/g) || []).length;
	if (atCount !== 1) return { ok: false, error: 'at_count' };

	// 3) NFKC normalisointi
	try {
		s = s.normalize('NFKC');
	} catch {
		/* ei tuettu ympäristössä → ohita */
	}

	// 4) Erota local ja domain
	let [local, domain] = s.split('@');

	// 5) Local-osa sanity
	if (!local || local.length > 64) return { ok: false, error: 'local_len' };
	if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
		return { ok: false, error: 'local_dots' };
	}
	if (!DOT_ATOM_LOCAL_RE.test(local)) return { ok: false, error: 'local_format' };
	if (lowercaseLocal) local = local.toLowerCase();

	// 6) Domain: IDNA → ASCII + lowercase
	if (!domain) return { ok: false, error: 'domain_empty' };
	try {
		// Käytä WHATWG URL:ia ToASCII-muunnokseen (punycode) ilman ulkoisia kirjastoja
		domain = new URL('http://' + domain).hostname; // normalisoi ja parsii
	} catch {
		return { ok: false, error: 'domain_parse' };
	}
	domain = domain.toLowerCase();

	// 7) Domainin perusrajat
	if (domain.length > 253) return { ok: false, error: 'domain_len' };
	const labels = domain.split('.');
	if (labels.some((lbl) => lbl.length === 0)) return { ok: false, error: 'domain_empty_label' };
	if (labels.some((lbl) => lbl.length > 63)) return { ok: false, error: 'domain_label_len' };
	if (labels.some((lbl) => !DNS_LABEL_RE.test(lbl))) return { ok: false, error: 'domain_label_chars' };

	// 8) Kokonaispituus
	const normalized = `${local}@${domain}`;
	if (normalized.length > 254) return { ok: false, error: 'addr_len' };

	return { ok: true, normalized, local, domain };
}

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
	const norm = normalizeAndValidateEmail(initialEmail, { lowercaseLocal: true });

	if (!norm.ok) {
		return Response.json(400, { error: 'invalid_email', code: norm.error });
	}
	const normalizedEmail = norm.normalized;
	await responseHeaders.set('Content-Type', 'application/json');
	return new Response(JSON.stringify({ email: normalizedEmail }), { status: 200, headers: responseHeaders });
}
