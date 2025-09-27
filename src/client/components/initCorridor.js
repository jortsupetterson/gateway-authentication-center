export function initCorridor() {
	const canvasElement = document.getElementById('auth-corridor');
	if (!canvasElement) return;

	// Estä duplikaatti-instanssit (SPA/HMR/tab-paluu)
	if (canvasElement.dataset.corridorInitialized === '1' || globalThis.__corridorWorker) {
		globalThis.__corridorWorker?.postMessage({
			type: 'config',
			cfg: {
				doorWidthFactor: 0.82,
				doorWidthMaxPx: 1800,
				doorHeightFactor: 0.25,
				doorHeightMaxPx: 460,
				pulseAmp: 0.01,
			},
		});
		return;
	}

	canvasElement.dataset.corridorInitialized = '1';

	const offscreen = canvasElement.transferControlToOffscreen();
	// ÄLÄ MUUTA URL:ia
	const worker = new Worker('/V£RSION/workers/authCorridorPainter.worker.js', { type: 'module' });
	globalThis.__corridorWorker = worker;

	// Määritä media ENNEN ensimmäistä käyttöä
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	const getThemeMode = () => (media.matches ? 'dark' : 'light');

	function postSize() {
		const devicePixelRatioValue = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
		const rect = canvasElement.getBoundingClientRect();
		worker.postMessage({
			type: 'resize',
			widthCSSPixels: rect.width,
			heightCSSPixels: rect.height,
			devicePixelRatioValue,
		});
	}

	// Init (OK nyt, koska getThemeMode ei viittaa alustamattomaan muuttujaan)
	worker.postMessage(
		{
			type: 'init',
			canvas: offscreen,
			theme: getThemeMode(),
		},
		[offscreen]
	);

	// Ensimmäinen konfiguraatio (LEVEÄ OVI)
	worker.postMessage({
		type: 'config',
		cfg: {
			doorWidthFactor: 0.82, // leveys suhteessa viewport-leveyteen (0..1)
			doorWidthMaxPx: 1800, // leveyskatto px
			doorHeightFactor: 0.25, // korkeus suhteessa viewport-korkeuteen
			doorHeightMaxPx: 460, // korkeuskatto px
			pulseAmp: 0.01,
		},
	});

	// Reaktiot
	media.addEventListener?.('change', () => {
		worker.postMessage({ type: 'theme', theme: getThemeMode() });
	});

	window.addEventListener('resize', postSize, { passive: true });
	document.addEventListener('visibilitychange', () => {
		worker.postMessage({ type: 'visibility', hidden: document.hidden });
	});

	// BFCache (back/forward)
	window.addEventListener(
		'pageshow',
		(evt) => {
			if (evt.persisted) postSize();
		},
		{ passive: true }
	);

	postSize();
}
