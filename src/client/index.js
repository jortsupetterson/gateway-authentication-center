import { initializeAuth } from './components/authInitializer';
import updateLanguage from './components/languageUpdater';
async function handleAnonymousAuthenticationOnTheWeb() {
	const input = document.getElementById('email_address');
	const sessionEmail = sessionStorage.getItem('email_address');
	if (input && sessionEmail) input.value = sessionEmail;
	input?.addEventListener('input', (event) => {
		sessionStorage.setItem('email_address', event.target.value);
	});

	document.getElementById('initialize')?.addEventListener('click', async () => initializeAuth(input.value));
	document.body.querySelector('form')?.addEventListener('submit', (event) => {
		event.preventDefault();
		initializeAuth(input.value);
	});

	const langList = document.querySelector('#langSelector ul');
	const langBtn = document.getElementById('langBtn');

	langBtn.addEventListener('click', (event) => {
		event.stopPropagation();
		langList.classList.toggle('active');

		if (langList.classList.contains('active')) {
			const outsideHandler = (e) => {
				if (!langList.contains(e.target) && e.target !== langBtn) {
					langList.classList.remove('active');
					document.removeEventListener('click', outsideHandler);
				}
			};
			document.addEventListener('click', outsideHandler);
		}
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
