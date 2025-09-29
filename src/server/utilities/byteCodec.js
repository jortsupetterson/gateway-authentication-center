const byteCodec = {
	getBytes(bytesAmount = 32) {
		const bytes = new Uint8Array(bytesAmount);
		crypto.getRandomValues(bytes);
		return bytes;
	},
	getBase64url(bytesAmount = 32) {
		const bytes = new Uint8Array(bytesAmount);
		crypto.getRandomValues(bytes);
		return this.fromBytes(bytes);
	},
	fromBase64url(base64url) {
		const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
		const pad = (4 - (base64.length % 4)) % 4;
		const bin = atob(base64 + '='.repeat(pad));
		const out = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
		return out;
	},
	fromBytes(byteArray) {
		let bin = '';
		const chunk = 0x8000;
		for (let o = 0; o < byteArray.length; o += chunk) bin += String.fromCharCode(...byteArray.subarray(o, o + chunk));
		return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	},
};

export default byteCodec;
