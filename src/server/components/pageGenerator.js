import name from '../i18n/0-name.js';
import title from '../i18n/1-title.js';
import description from '../i18n/2-description.js';
import locale from '../i18n/3-locale.js';
import social_sharing_image from '../i18n/4-social-sharing-image.js';

export default async function pageGenerator(env, lang, view, nonce, cookie, headers) {
	return /*html*/ `
<!DOCTYPE html>
<html lang="${lang}">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${title[lang]} | ${name}</title>
		<meta name="author" content="Jori Lehtinen" />
		<meta name="description" content="${description[lang]}" />

		<meta property="og:locale" content="${locale[lang]}" />
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="${name}" />
		<meta property="og:title" content="${title[lang]}" />
		<meta property="og:description" content="${description[lang]}" />
		<meta property="og:url" content="https://api.authentication.center/${lang}" />
		<meta property="og:image" content="${social_sharing_image[lang]}" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content="${social_sharing_image.alt[lang]}" />

		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="${title[lang]}" />
		<meta name="twitter:description" content="${description[lang]}" />
		<meta name="twitter:url" content="https://api.authentication.center/${lang}" />
		<meta name="twitter:image" content="${social_sharing_image.url}" />
		<meta name="twitter:image:alt" content="${social_sharing_image.alt[lang]}" />
		<meta name="twitter:site" content="@vorteapp" />
		<meta name="twitter:creator" content="@vorteapp" />

		<link rel="canonical" href="https://api.authentication.center/fi" />
		<link rel="alternate" hreflang="fi" href="https://api.authentication.center/fi" />
		<link rel="alternate" hreflang="sv" href="https://api.authentication.center/sv" />
		<link rel="alternate" hreflang="en" href="https://api.authentication.center/en" />
		<link rel="alternate" hreflang="x-default" href="https://api.authentication.center/en" />

		<link rel="dns-prefetch" href="//assets.authentication.center" />
		<link rel="dns-prefetch" href="//challenges.cloudflare.com" />
		<link rel="dns-prefetch" href="//static.cloudflareinsights.com" />

		<link rel="preconnect" href="https://assets.authentication.center" crossorigin />
		<link rel="preconnect" href="https://challenges.cloudflare.com" crossorigin />
		<link rel="preconnect" href="https://static.cloudflareinsights.com" crossorigin />


        <link rel="preload" href="/V£RSION/index.css" as="style" />
		<link rel="stylesheet" href="/V£RSION/index.css" />

		<script type="application/ld+json" nonce="${nonce}">
			{
				"@context": "https://schema.org",
				"@graph": [
					{
						"@type": "Person",
						"@id": "https://api.authentication.center/#jori",
						"name": "Jori Lehtinen"
					},
					{
						"@type": "WebAPI",
						"@id": "https://api.authentication.center/#aaotw",
						"name": "AAOTW API",
						"alternateName": "Anonymous Authentication on the Web API",
						"url": "https://api.authentication.center",
						"category": "Identity and Access Management",
						"description": "${description[lang]}",
						"inLanguage": ["fi", "sv", "en"],
						"isAccessibleForFree": true,
						"provider": { "@id": "https://api.authentication.center/#jori" },
						"endpointUrl": "https://api.authentication.center/v1",
						"documentation": "https://api.authentication.center",
						"termsOfService": "https://authentication.center/terms",
						"privacyPolicy": "https://authentication.center/privacy"
					},
					{
						"@type": "APIReference",
						"@id": "https://api.authentication.center/#docs",
						"name": "AAOTW API Documentation",
						"about": { "@id": "https://api.authentication.center/#aaotw" },
						"url": "https://docs.authentication.center",
						"inLanguage": ["fi", "sv", "en"],
						"author": { "@id": "https://api.authentication.center/#jori" },
						"publisher": { "@id": "https://api.authentication.center/#jori" },
						"dateModified": "${new Date().toISOString()}",
						"image": {
							"@type": "ImageObject",
							"url": "https://assets.authentication.center/social_sharing_image.png"
						}
					},
					{
						"@type": "WebPage",
						"@id": "https://api.authentication.center/#webpage",
						"url": "https://api.authentication.center",
						"name": "AAOTW API",
						"inLanguage": ["fi", "sv", "en"],
						"author": { "@id": "https://api.authentication.center/#jori" },
						"publisher": { "@id": "https://api.authentication.center/#jori" },
						"primaryImageOfPage": {
							"@type": "ImageObject",
							"url": "https://assets.authentication.center/social_sharing_image.png"
						},
						"isPartOf": {
							"@type": "WebSite",
							"@id": "https://authentication.center/#website",
							"url": "https://authentication.center",
							"name": "Authentication Center",
							"publisher": { "@id": "https://api.authentication.center/#jori" }
						}
					}
				]
			}
		</script>
	</head>
	<body>
<header>
  <figure>
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-labelledby="t3">
  <title id="t3">Authentication Center — orbiting rings + shield seal (depth)</title>
  <style nonce=${nonce}>
    .orbit-mid  { transform-origin: 48px 48px; animation: spin 18s linear infinite; }
    .orbit-top  { transform-origin: 48px 48px; animation: spin 28s linear infinite reverse; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .keyturn { transform-origin: 48px 48px; animation: keyturn 10s ease-in-out infinite; }
    @keyframes keyturn {
      0%, 96% { transform: rotate(0deg); }
      98%     { transform: rotate(90deg); } 
      100%    { transform: rotate(0deg); }
    }
  </style>

  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="0.8" flood-opacity="0.25"/>
    </filter>
  </defs>

  <path d="M48 18c8 5 16 6 24 8v18c0 16-13 28-24 34-11-6-24-18-24-34V26c8-2 16-3 24-8Z"
        fill="none" stroke="var(--c)" stroke-width="3" stroke-opacity="0.6"
        transform="translate(15.36 15.36) scale(0.68)" />

  <g class="keyturn" id="animGroup">
    <circle class="orbit-mid" cx="48" cy="48" r="32"
            fill="none" stroke="var(--c)" stroke-width="2.2"
            stroke-linecap="round" stroke-dasharray="10 6" opacity="0.9"/>
    <circle class="orbit-top" cx="48" cy="48" r="40"
            fill="none" stroke="var(--c)" stroke-width="2.6"
            stroke-linecap="round" stroke-dasharray="14 9" opacity="0.95"
            filter="url(#softShadow)"/>

    <rect x="40" y="40" width="16" height="16" transform="rotate(45 48 48)"
          fill="var(--c)" opacity=".18" />
    <rect x="42" y="42" width="12" height="12" transform="rotate(45 48 48)"
          fill="none" stroke="var(--c)" stroke-width="3"/>
  </g>
</svg>
    <figcaption><h1>Authentication Center</h1></figcaption>
  </figure>

  <select id="langSelector">
    ${(() => {
			let options = '';
			_supportedLanguages.forEach((l) => (options += `<option value="${l}"${l === lang ? ' selected' : ''}>${l.toUpperCase()}</option>`));
			return options;
		})()}
  </select>
</header>
		<main>
            ${view ?? ''}
        </main>
		<footer role="contentinfo">
			<nav aria-label="Legal">
				<a href="https://authentication.center/privacy" rel="nofollow">Tietosuojakäytäntö</a>
				<a href="https://authentication.center/terms" rel="nofollow">Käyttöehdot</a>
			</nav>
			<small>&copy; ${new Date().getFullYear()} authentication.center</small>
		</footer>
	</body>
</html>
    `;
}
