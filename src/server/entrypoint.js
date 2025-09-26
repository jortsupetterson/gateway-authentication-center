import { virtualizeCookie } from './components/cookieVirtualizer.js';
import { generateHeaders } from './components/headersGenerator.js';
import { generateNonce } from './components/nonceGenerator.js';
import { quessLanguage } from './components/languageQuesser.js';
import pageGenerator from './components/pageGenerator.js';
import handlerMap from './components/handlerMap.js';
import { fetchRelyingParty } from './components/relyingPartyFetcher.js';
export default {
	async fetch({ cf, url, headers }, env, ctx) {
		try {
			const { origin, pathname, searchParams } = new URL(url);
			const [nonce, virtualCookie, virtualPath] = await Promise.all([
				generateNonce(24),
				virtualizeCookie(await headers.get('cookie')),
				pathname.split('/').filter(Boolean),
			]);
			const [lang, handler] = await Promise.all([
				quessLanguage(virtualPath, virtualCookie, await headers.get('accept-language')),
				handlerMap[virtualPath.pop()] ? handlerMap[virtualPath.pop()] : handlerMap['default'],
			]);

			return await handler({
				cf,
				env,
				ctx,
				lang,
				nonce,
				cookie: virtualCookie,
				params: searchParams,
				headers,
				pageGenerator,
				responseHeaders: await generateHeaders(lang, nonce),
			});
		} catch (error) {
			console.error(error);
			return new Response(error);
		}
	},
};
