import { virtualizeCookie } from './components/cookieVirtualizer.js';
import { generateHeaders } from './components/headersGenerator.js';
import { quessLanguage } from './components/languageQuesser.js';
import pageGenerator from './components/pageGenerator.js';
import handlerMap from './components/handlerMap.js';
import { fetchRelyingParty } from './components/relyingPartyFetcher.js';
import byteCodec from './utilities/byteCodec.js';
export default {
	async fetch({ cf, url, headers }, env, ctx) {
		try {
			const { origin, pathname, searchParams } = new URL(url);
			const relyingParty = fetchRelyingParty(env, searchParams);
			const [nonce, virtualCookie, virtualPath] = await Promise.all([
				byteCodec.getBase64url(24),
				virtualizeCookie(await headers.get('cookie')),
				pathname.split('/').filter(Boolean),
			]);
			const key = virtualPath.pop() ?? 'default';

			const [lang, handler] = await Promise.all([
				quessLanguage(virtualPath, virtualCookie, await headers.get('accept-language')),
				handlerMap[key] ?? handlerMap.default,
			]);

			return await handler({
				cf,
				env,
				ctx,
				lang,
				nonce,
				cookie: virtualCookie,
				params: Object.fromEntries(searchParams),
				headers,
				relyingParty,
				pageGenerator,
				responseHeaders: await generateHeaders(lang, nonce),
			});
		} catch (error) {
			console.error(error);
			return new Response(error);
		}
	},
};
