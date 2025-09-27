export default function renderDefault(lang) {
	return /*html*/ `
    <form>
    <div class="row">
        <img src="${'https://assets.authentication.center/authentication_center_logo.png'}" alt="">
        <h2>
            Olet tunnistautumassa palveluun
                <span id="serviceProvider">My Authentication Center</span>
        </h2>
    </div>
    <div>
        <p>Palvelu saa sinusta seuraavat tiedot:</p>
        <ul>
            <li>
                Palvelukohtainen anonyymi tunniste
            </li>
        </ul>
    </div>
    <div>
        <div class="row">
        <input 
        id="email_address" 
        type="email" 
placeholder="${
		{
			fi: 'sinun.sähköposti@example.com',
			sv: 'din.e-post@example.com',
			en: 'your.email@example.com',
		}[lang]
	}"

        >
        <button id="passkey">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M400 416C497.2 416 576 337.2 576 240C576 142.8 497.2 64 400 64C302.8 64 224 142.8 224 240C224 258.7 226.9 276.8 232.3 293.7L71 455C66.5 459.5 64 465.6 64 472L64 552C64 565.3 74.7 576 88 576L168 576C181.3 576 192 565.3 192 552L192 512L232 512C245.3 512 256 501.3 256 488L256 448L296 448C302.4 448 308.5 445.5 313 441L346.3 407.7C363.2 413.1 381.3 416 400 416zM440 160C462.1 160 480 177.9 480 200C480 222.1 462.1 240 440 240C417.9 240 400 222.1 400 200C400 177.9 417.9 160 440 160z" fill = "var(-c)"/></svg>
        </button>
        </div>
    </div>

    <div>
        <small>
  ${
		{
			fi: 'Käytämme osoitettasi vain kertakäyttökoodeihin, turvailmoituksiin, laitteiden väliseen synkronointiin ja varmistuspalautuksiin. Emme tallenna osoitetta, vain yksisuuntaisen hajautusarvon.',
			sv: 'Vi använder din adress endast för engångskoder, säkerhetsmeddelanden, synkronisering mellan enheter och återställning. Vi lagrar inte adressen, endast ett envägshashvärde.',
			en: 'We use your address only for one-time codes, security notifications, cross-device sync, and disaster recovery. We do not store the address, only a one-way hash.',
		}[lang]
	}
</small>

<small>
  <a href="/privacy#email">${
		{
			fi: 'Opi kuinka käsittelemme sähköpostiasi',
			sv: 'Lär dig hur vi hanterar din e-post',
			en: 'Learn how we handle your email',
		}[lang]
	}</a>
</small>
    </div>

    <div>
        <button id="no-passkey" type="button">
        ${{ fi: 'Eikö laiteavain ole saatavilla?', sv: 'Ingen säkerhetsnyckel tillgänglig?', en: 'No passkey available?' }[lang]}
        </button>
    </div>
    </form>
`;
}
