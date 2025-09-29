const row = await env.DB.prepare(
	`SELECT u.user_id
   FROM email_index_map e
   JOIN users u ON u.user_pk = e.user_pk
   WHERE e.kid=? AND e.pseudonymous_index=? LIMIT 1`
)
	.bind(kid, pseudoIdxBytes)
	.first();
