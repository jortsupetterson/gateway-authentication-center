export async function generateNonce(lengthBytes = 24) {
	const buffer = new Uint8Array(lengthBytes);
	crypto.getRandomValues(buffer);
	let binary = '';
	for (const byte of buffer) binary += String.fromCharCode(byte);
	const base64 = btoa(binary);
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
