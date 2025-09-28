export async function generateHeaders() {
	return new Headers({
		'Content-Type': 'text/html',
		'X-Robots-Tag': 'noindex, follow',
		'Cache-control': 'max-age=0, no-store, must-revalidate',
	});
}
