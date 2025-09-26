export async function generateHeaders() {
	return new Headers({
		'Content-Type': 'text/html',
		'Cache-control': 'max-age=0, no-store, must-revalidate',
	});
}
