// authCorridorPainter.worker.js — Doorway Inflow (adaptive, clamped) — NO DOOR
let ctx;
let widthDevicePixels = 0;
let heightDevicePixels = 0;
let devicePixelRatioValue = 1;
let running = true;

const state = {
	theme: 'dark',
	timeStartMs: performance.now(),
	frameBudgetMs: 1000 / 60,
	frameTimeAvgMs: 16,
	qualityTier: 3,
	gradients: null,
	gradientsKey: '',
};

const config = {
	doorWidthFactor: 1, // säilytetään partikkelien leveyssäännöksi
	doorWidthMaxPx: 1000,
	doorHeightFactor: 0.26, // ei käytössä enää piirrossa
	doorHeightMaxPx: 1000, // ei käytössä enää piirrossa
	pulseAmp: 0.012,
};

const params = {
	beamsHigh: 7,
	beamsMed: 5,
	beamsLow: 3,
	particlesHigh: 140,
	particlesMed: 90,
	particlesLow: 50,
	noiseTileHigh: 64,
	noiseTileMed: 96,
	noiseTileLow: 128,
	dprMax: 2.5,
	minFpsTier2: 40,
	minFpsTier1: 28,
};

self.onmessage = (e) => {
	const m = e.data;
	if (m.type === 'init') {
		const cvs = m.canvas;
		state.theme = m.theme || state.theme;
		ctx = cvs.getContext('2d', { alpha: false, desynchronized: true });
		loop();
	} else if (m.type === 'resize') {
		const dprRaw = Number(m.devicePixelRatioValue);
		devicePixelRatioValue = Math.min(params.dprMax, Math.max(1, Number.isFinite(dprRaw) ? dprRaw : 1));
		widthDevicePixels = Math.max(2, Math.floor(m.widthCSSPixels * devicePixelRatioValue));
		heightDevicePixels = Math.max(2, Math.floor(m.heightCSSPixels * devicePixelRatioValue));
		ctx.canvas.width = widthDevicePixels;
		ctx.canvas.height = heightDevicePixels;
		rebuildCaches();
	} else if (m.type === 'theme') {
		state.theme = m.theme || state.theme;
		rebuildCaches();
	} else if (m.type === 'visibility') {
		running = !m.hidden;
		if (running) loop();
	} else if (m.type === 'config') {
		const c = m.cfg || {};
		if (Number.isFinite(c.doorWidthFactor)) config.doorWidthFactor = clamp(c.doorWidthFactor, 0.05, 1.0);
		if (Number.isFinite(c.doorWidthMaxPx)) config.doorWidthMaxPx = Math.max(100, c.doorWidthMaxPx);
		if (Number.isFinite(c.doorHeightFactor)) config.doorHeightFactor = clamp(c.doorHeightFactor, 0.05, 0.9); // ei käytössä
		if (Number.isFinite(c.doorHeightMaxPx)) config.doorHeightMaxPx = Math.max(60, c.doorHeightMaxPx); // ei käytössä
		if (Number.isFinite(c.pulseAmp)) config.pulseAmp = clamp(c.pulseAmp, 0, 0.05);
		rebuildCaches();
	}
};

function loop() {
	if (!running) return;
	const t0 = performance.now();
	renderFrame(t0 - state.timeStartMs);
	const spent = performance.now() - t0;

	state.frameTimeAvgMs = state.frameTimeAvgMs * 0.9 + spent * 0.1;
	const fps = 1000 / Math.max(1, state.frameTimeAvgMs);
	if (fps < params.minFpsTier1) {
		state.qualityTier = 1;
		state.frameBudgetMs = 1000 / 30;
	} else if (fps < params.minFpsTier2) {
		state.qualityTier = 2;
		state.frameBudgetMs = 1000 / 45;
	} else {
		state.qualityTier = 3;
		state.frameBudgetMs = 1000 / 60;
	}

	setTimeout(loop, Math.max(0, state.frameBudgetMs - spent));
}

function palette(theme) {
	if (theme === 'dark') {
		return { space: '#000000', light: '#FFFFFF', beamTint: '#dfe8ff', vignetteEdge: '#000000' };
	}
	return { space: '#FFFFFF', light: '#000000', beamTint: '#222833', vignetteEdge: '#FFFFFF' };
}

function rebuildCaches() {
	state.gradients = null;
	state.gradientsKey = `${state.theme}-${widthDevicePixels}x${heightDevicePixels}`;
}

function renderFrame(elapsedMs) {
	if (!ctx || widthDevicePixels === 0 || heightDevicePixels === 0) return;

	const w = widthDevicePixels;
	const h = heightDevicePixels;
	const colors = palette(state.theme);

	// tausta
	ctx.fillStyle = colors.space;
	ctx.fillRect(0, 0, w, h);

	// “lähtölinja” alareunassa
	const cx = w * 0.5;
	const baseY = h - 1 * devicePixelRatioValue;

	// käytetään entistä doorWidthFactor’ia vain leveyssäännöksi (leviämä/partikkelit)
	const baseW = Math.min(w * config.doorWidthFactor, config.doorWidthMaxPx * devicePixelRatioValue);
	const pulse = 1 + config.pulseAmp * Math.sin(elapsedMs * 0.0025);
	const spreadW = baseW * pulse;

	const gKey = `${state.theme}-${w}x${h}`;
	if (!state.gradients || state.gradientsKey !== gKey) {
		state.gradients = buildGradients(ctx, colors, w, h);
		state.gradientsKey = gKey;
	}

	// säteet
	const counts = chooseCounts(state.qualityTier);
	drawUpwardRays(ctx, colors, cx, baseY, w, h, elapsedMs, counts.beamCount);

	// partikkeleiden leviäminen skaalataan spreadW:llä
	drawDoorParticles(ctx, colors, cx, baseY, w, h, elapsedMs, spreadW, counts.particleCount);

	// kevyt kohina
	drawSoftNoise(ctx, colors, w, h, elapsedMs, counts.noiseTile);

	// vignette
	ctx.fillStyle = state.gradients.vignette;
	ctx.fillRect(0, 0, w, h);
}

function chooseCounts(tier) {
	if (tier === 3)
		return {
			beamCount: params.beamsHigh,
			particleCount: params.particlesHigh,
			noiseTile: Math.floor(params.noiseTileHigh * devicePixelRatioValue),
		};
	if (tier === 2)
		return {
			beamCount: params.beamsMed,
			particleCount: params.particlesMed,
			noiseTile: Math.floor(params.noiseTileMed * devicePixelRatioValue),
		};
	return {
		beamCount: params.beamsLow,
		particleCount: params.particlesLow,
		noiseTile: Math.floor(params.noiseTileLow * devicePixelRatioValue),
	};
}

// ——— ei enää ovea/glow’ta — vain vignette
function buildGradients(context, colors, width, height) {
	const vignette = context.createRadialGradient(
		width * 0.5,
		height * 0.55,
		Math.min(width, height) * 0.25,
		width * 0.5,
		height * 0.55,
		Math.hypot(width, height) * 0.6
	);
	vignette.addColorStop(0.0, withAlpha(colors.vignetteEdge, 0.0));
	vignette.addColorStop(1.0, withAlpha(colors.vignetteEdge, 0.28));
	return { vignette };
}

function drawUpwardRays(context, colors, centerX, baseY, width, height, elapsedMs, beamCount) {
	const base = -Math.PI / 2;
	const t = elapsedMs * 0.001;

	context.save();
	context.globalCompositeOperation = colors.space === '#000000' ? 'screen' : 'multiply';

	for (let i = 0; i < beamCount; i++) {
		const wobble = Math.sin(t * 0.7 + i * 1.37) * 0.09;
		const angle = base + wobble + (i - (beamCount - 1) / 2) * 0.06;
		const beamW = width * 0.22 * (0.78 + 0.22 * Math.sin(t * 0.9 + i));
		const len = height * 1.1;

		const endX = centerX + Math.cos(angle) * len;
		const endY = baseY + Math.sin(angle) * len;

		const grad = context.createLinearGradient(centerX, baseY, endX, endY);
		grad.addColorStop(0.0, withAlpha(colors.beamTint, 0.2));
		grad.addColorStop(0.35, withAlpha(colors.beamTint, 0.07));
		grad.addColorStop(1.0, withAlpha(colors.beamTint, 0.0));

		const normal = angle + Math.PI / 2;
		const ox = Math.cos(normal) * (beamW * 0.5);
		const oy = Math.sin(normal) * (beamW * 0.5);

		context.fillStyle = grad;
		context.beginPath();
		context.moveTo(centerX - ox, baseY - oy);
		context.lineTo(centerX + ox, baseY + oy);
		context.lineTo(endX + ox, endY + oy);
		context.lineTo(endX - ox, endY - oy);
		context.closePath();
		context.fill();
	}
	context.restore();
}

function drawDoorParticles(context, colors, centerX, baseY, width, height, elapsedMs, spreadWidthPx, particleCount) {
	const t = elapsedMs * 0.001;
	const spreadX = Math.min(spreadWidthPx * 0.55, width * 0.45);
	const rise = height * 0.95;

	context.save();
	context.globalCompositeOperation = colors.space === '#000000' ? 'screen' : 'multiply';

	for (let i = 0; i < particleCount; i++) {
		const seed = lcg01(i * 1664525);
		const speed = 0.06 + 0.12 * seed;
		const life = 6 + 6 * seed;
		const lt = (t * speed + seed * 10) % life;
		const prog = lt / life;

		const x = centerX + (seed - 0.5) * 2 * spreadX + Math.sin((t + seed) * 0.8) * (6 * devicePixelRatioValue);
		const y = baseY - prog * rise;

		if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
		if (y < -20 * devicePixelRatioValue) continue;

		const rawSize = (0.8 + seed * 2.2) * devicePixelRatioValue;
		const size = Math.max(0.5, Number.isFinite(rawSize) ? rawSize : 0.5);

		const rawAlpha = 0.05 + 0.25 * Math.sin(prog * Math.PI);
		const alpha = clamp(Number.isFinite(rawAlpha) ? rawAlpha : 0.15, 0, 0.3);

		context.fillStyle = withAlpha(colors.light, alpha);
		context.beginPath();
		context.arc(x, y, size, 0, Math.PI * 2);
		context.fill();
	}
	context.restore();
}

function drawSoftNoise(context, colors, width, height, elapsedMs, tile) {
	const t = elapsedMs * 0.00025;
	const tilePx = Math.max(8, Math.floor(tile));
	context.save();
	context.globalAlpha = 0.03;
	context.globalCompositeOperation = colors.space === '#000000' ? 'screen' : 'multiply';

	for (let yy = 0; yy < height; yy += tilePx) {
		const py = Math.sin(t + yy * 0.003);
		for (let xx = 0; xx < width; xx += tilePx) {
			const px = Math.cos(t + xx * 0.003);
			const v = (px + py + 2) / 4;
			context.fillStyle = withAlpha(colors.light, v * 0.22);
			context.fillRect(xx, yy, tilePx, tilePx);
		}
	}
	context.restore();
}

// apurit
function withAlpha(hex, a) {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const aa = clamp(a, 0, 1);
	return `rgba(${r},${g},${b},${aa})`;
}
function lcg01(seed) {
	let v = seed >>> 0;
	v = (1664525 * v + 1013904223) >>> 0;
	return (v & 0xffffffff) / 0x100000000;
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
