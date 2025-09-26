async function handleAnonymousAuthenticationOnTheWeb() {}
if (document.readyState === 'loading') {
	window.addEventListener('DOMContentLoaded', handleAnonymousAuthenticationOnTheWeb);
} else {
	await handleAnonymousAuthenticationOnTheWeb();
}
