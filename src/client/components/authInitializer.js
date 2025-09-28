export async function initializeAuth(email_address) {
	console.log(email_address);
	const res = await fetch(`/initialization?email_address=${email_address}`);
	const data = await res.json();
	console.log(data);
}
