import { initCorridor } from './components/initCorridor';
async function handleAnonymousAuthenticationOnTheWeb() {
	const input = document.getElementById('email_address');
	const sessionEmail = sessionStorage.getItem('email_address');
	if (input && sessionEmail) input.value = sessionEmail;
	input?.addEventListener('input', (event) => {
		sessionStorage.setItem('email_address', event.target.value);
	});
}

if (document.readyState === 'loading') {
	window.addEventListener('DOMContentLoaded', handleAnonymousAuthenticationOnTheWeb);
} else {
	handleAnonymousAuthenticationOnTheWeb();
}
