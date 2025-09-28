import updateLanguage from './components/languageUpdater';
async function handleAnonymousAuthenticationOnTheWeb() {
	const input = document.getElementById('email_address');
	const sessionEmail = sessionStorage.getItem('email_address');
	if (input && sessionEmail) input.value = sessionEmail;
	input?.addEventListener('input', (event) => {
		sessionStorage.setItem('email_address', event.target.value);
	});

	const langList = document.querySelector('#langSelector ul');
	const langBtn = document.getElementById('langBtn');
	langBtn.addEventListener('mouseenter', async () => {
		langList.classList.toggle('active');
	});
	document.addEventListener('click', async () => {
		langList.classList.toggle('active');
	});

	langList.querySelectorAll('button').forEach((btn) => {
		btn.addEventListener('click', () => {
			const lang = btn.textContent.trim().toLowerCase();
			history.pushState({ lang }, '', `/${lang}`);
			window.location.href = `/${lang}`;
		});
	});
}

if (document.readyState === 'loading') {
	window.addEventListener('DOMContentLoaded', handleAnonymousAuthenticationOnTheWeb);
} else {
	handleAnonymousAuthenticationOnTheWeb();
}
