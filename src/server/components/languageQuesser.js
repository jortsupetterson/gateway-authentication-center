const _supportedLanguages = new Set(['fi', 'sv', 'en']);

export async function quessLanguage(virtualPath, virtualCookie, languageHeader) {
	if (_supportedLanguages.has(virtualPath[0])) return virtualPath[0];
	if (virtualCookie['lang']) return virtualCookie['lang'];
	if (!languageHeader) return 'en';
	for (const part of languageHeader.split(',')) {
		const tag = part.trim().split(';', 1)[0].split('-', 1)[0];
		if (_supportedLanguages.has(tag)) return tag;
	}
	return 'en';
}

globalThis._supportedLanguages = _supportedLanguages;
