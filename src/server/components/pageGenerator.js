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
		<title>${title[lang]}</title>
		<meta name="author" content="Jori Lehtinen" />
		<meta name="description" content="${description[lang]}" />
		<link rel="icon" type="image/png" sizes="512x512" href="https://assets.authentication.center/favicon.png">

		<meta property="og:locale" content="${locale[lang]}" />
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="${name}" />
		<meta property="og:title" content="${title[lang]}" />
		<meta property="og:description" content="${description[lang]}" />
		<meta property="og:url" content="https://gateway.authentication.center/${lang}" />
		<meta property="og:image" content="${social_sharing_image[lang]}" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content="${social_sharing_image.alt[lang]}" />

		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="${title[lang]}" />
		<meta name="twitter:description" content="${description[lang]}" />
		<meta name="twitter:url" content="https://gateway.authentication.center/${lang}" />
		<meta name="twitter:image" content="${social_sharing_image.url}" />
		<meta name="twitter:image:alt" content="${social_sharing_image.alt[lang]}" />
		<meta name="twitter:site" content="@vorteapp" />
		<meta name="twitter:creator" content="@vorteapp" />

		<link rel="canonical" href="https://gateway.authentication.center/fi" />
		<link rel="alternate" hreflang="fi" href="https://gateway.authentication.center/fi" />
		<link rel="alternate" hreflang="sv" href="https://gateway.authentication.center/sv" />
		<link rel="alternate" hreflang="en" href="https://gateway.authentication.center/en" />
		<link rel="alternate" hreflang="x-default" href="https://gateway.authentication.center/en" />

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
						"@id": "https://gateway.authentication.center/#jori",
						"name": "Jori Lehtinen"
					},
					{
						"@type": "WebAPI",
						"@id": "https://gateway.authentication.center/#aaotw",
						"name": "AAOTW API",
						"alternateName": "Anonymous Authentication on the Web API",
						"url": "https://gateway.authentication.center",
						"category": "Identity and Access Management",
						"description": "${description[lang]}",
						"inLanguage": ["fi", "sv", "en"],
						"isAccessibleForFree": true,
						"provider": { "@id": "https://gateway.authentication.center/#jori" },
						"endpointUrl": "https://gateway.authentication.center/v1",
						"documentation": "https://gateway.authentication.center",
						"termsOfService": "https://authentication.center/terms",
						"privacyPolicy": "https://authentication.center/privacy"
					},
					{
						"@type": "APIReference",
						"@id": "https://gateway.authentication.center/#docs",
						"name": "AAOTW API Documentation",
						"about": { "@id": "https://gateway.authentication.center/#aaotw" },
						"url": "https://docs.authentication.center",
						"inLanguage": ["fi", "sv", "en"],
						"author": { "@id": "https://gateway.authentication.center/#jori" },
						"publisher": { "@id": "https://gateway.authentication.center/#jori" },
						"dateModified": "${new Date().toISOString()}",
						"image": {
							"@type": "ImageObject",
							"url": "https://assets.authentication.center/social_sharing_image.png"
						}
					},
					{
						"@type": "WebPage",
						"@id": "https://gateway.authentication.center/#webpage",
						"url": "https://gateway.authentication.center",
						"name": "AAOTW API",
						"inLanguage": ["fi", "sv", "en"],
						"author": { "@id": "https://gateway.authentication.center/#jori" },
						"publisher": { "@id": "https://gateway.authentication.center/#jori" },
						"primaryImageOfPage": {
							"@type": "ImageObject",
							"url": "https://assets.authentication.center/social_sharing_image.png"
						},
						"isPartOf": {
							"@type": "WebSite",
							"@id": "https://authentication.center/#website",
							"url": "https://authentication.center",
							"name": "Authentication Center",
							"publisher": { "@id": "https://gateway.authentication.center/#jori" }
						}
					}
				]
			}
		</script>
		<script type="module" src="/V£RSION/index.js"></script>
	</head>
	<body>
<header>
  <figure>
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-labelledby="t3">
  <title id="t3">Authentication Center - Anonymous authentication on the web</title>

  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="0.8" flood-opacity="0.25"/>
    </filter>
  </defs>

  <path d="M48 18c8 5 16 6 24 8v18c0 16-13 28-24 34-11-6-24-18-24-34V26c8-2 16-3 24-8Z"
        fill="none" stroke="var(--c)" stroke-width="3" stroke-opacity="0.6"
        transform="translate(15.36 15.36) scale(0.68)" />

  <g>
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

  <div id="langSelector" class="closed">
	<button id="langBtn">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path 
		d="M192 64C209.7 64 224 78.3 224 96L224 128L352 128C369.7 128 384 142.3 384 160C384 177.7 369.7 192 352 192L342.4 192L334 215.1C317.6 260.3 292.9 301.6 261.8 337.1C276 345.9 290.8 353.7 306.2 360.6L356.6 383L418.8 243C423.9 231.4 435.4 224 448 224C460.6 224 472.1 231.4 477.2 243L605.2 531C612.4 547.2 605.1 566.1 589 573.2C572.9 580.3 553.9 573.1 546.8 557L526.8 512L369.3 512L349.3 557C342.1 573.2 323.2 580.4 307.1 573.2C291 566 283.7 547.1 290.9 531L330.7 441.5L280.3 419.1C257.3 408.9 235.3 396.7 214.5 382.7C193.2 399.9 169.9 414.9 145 427.4L110.3 444.6C94.5 452.5 75.3 446.1 67.4 430.3C59.5 414.5 65.9 395.3 81.7 387.4L116.2 370.1C132.5 361.9 148 352.4 162.6 341.8C148.8 329.1 135.8 315.4 123.7 300.9L113.6 288.7C102.3 275.1 104.1 254.9 117.7 243.6C131.3 232.3 151.5 234.1 162.8 247.7L173 259.9C184.5 273.8 197.1 286.7 210.4 298.6C237.9 268.2 259.6 232.5 273.9 193.2L274.4 192L64.1 192C46.3 192 32 177.7 32 160C32 142.3 46.3 128 64 128L160 128L160 96C160 78.3 174.3 64 192 64zM448 334.8L397.7 448L498.3 448L448 334.8z"
		fill="var(--c)"
		/></svg>
	</button>
	<ul>
    ${(() => {
			let options = '';
			_supportedLanguages.forEach((l) => (options += /*html*/ `<li><button>${l}</button></li>`));
			return options;
		})()}
	</ul>
  </div>
</header>
		<main>
            ${view ?? ''}
        </main>
		<footer role="contentinfo">
<nav aria-label="Legal">
  <small>
    <a href="https://authentication.center/${lang}/privacy" rel="nofollow" hreflang="${lang}">${
		{
			fi: 'Tietosuojakäytäntö',
			sv: 'Integritetspolicy',
			en: 'Privacy Policy',
		}[lang]
	}</a>
  </small>
  <span></span>
  <small>
    <a href="https://authentication.center/${lang}/terms" rel="nofollow" hreflang="${lang}">${
		{
			fi: 'Käyttöehdot',
			sv: 'Användarvillkor',
			en: 'Terms of Service',
		}[lang]
	}</a>
  </small>
</nav>
			<small>&copy; ${new Date().getFullYear()} \u0020 Authentication Center</small>
		</footer>
	</body>
	</html>
    `;
}
