/**
 * "Agentic Void" starfield — vanilla canvas, no build step.
 * - Three parallax layers (deep static, mid drift, foreground twinkle)
 * - Mood shifts: calm → uneasy (warmer / faster) → danger (red tint + jitter)
 * - Optional "technical" look for inner pages (system grey, calmer)
 */
(function () {
  const VAR_NAMES = {
    dim: "--star-dim",
    bright: "--star-bright",
    highlight: "--star-highlight",
  };

  function readCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#ffffff";
  }

  function parseHexColor(hex) {
    const h = hex.replace("#", "");
    const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return { r, g, b };
  }

  function lerpColor(a, b, t) {
    return {
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t,
    };
  }

  function rgba(c, a) {
    return `rgba(${c.r|0},${c.g|0},${c.b|0},${a})`;
  }

  const MOODS = {
    calm: { drift: 0.12, twinkle: 0.4, redMix: 0, jitter: 0, greyBoost: 0 },
    uneasy: { drift: 0.45, twinkle: 0.7, redMix: 0.2, jitter: 0.15, greyBoost: 0 },
    danger: { drift: 0.9, twinkle: 0.95, redMix: 0.75, jitter: 1.2, greyBoost: 0 },
    /** Calmer, grey-forward — good for "under the hood" / technical pages */
    technical: { drift: 0.08, twinkle: 0.35, redMix: 0, jitter: 0, greyBoost: 0.35 },
  };

  const state = {
    mood: "calm",
    moodLerp: { ...MOODS.calm },
    targetMood: "calm",
    scroll01: 0,
    w: 0,
    h: 0,
    dpr: 1,
    stars: [],
    time: 0,
    raf: null,
    options: { canvasId: "starfield" },
  };

  function lerpMood() {
    const t = state.targetMood;
    const target = MOODS[t] || MOODS.calm;
    const cur = state.moodLerp;
    const k = 0.08;
    for (const key of Object.keys(target)) {
      cur[key] = cur[key] === undefined ? target[key] : cur[key] + (target[key] - cur[key]) * k;
    }
  }

  function makeStar(w, h, layer) {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      layer,
      r:
        layer === 0
          ? Math.random() * 0.7 + 0.3
          : layer === 1
            ? Math.random() * 1.0 + 0.7
            : Math.random() * 1.6 + 0.8,
      driftX: (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
      twDelay: Math.random() * Math.PI * 2,
      twSpeed: 0.6 + Math.random() * 0.7,
    };
  }

  function buildStars() {
    const w = state.w;
    const h = state.h;
    state.stars = [];
    const n0 = Math.floor((w * h) / 9000);
    const n1 = Math.floor((w * h) / 15000);
    const n2 = Math.floor((w * h) / 45000);
    for (let i = 0; i < n0; i += 1) state.stars.push(makeStar(w, h, 0));
    for (let i = 0; i < n1; i += 1) state.stars.push(makeStar(w, h, 1));
    for (let i = 0; i < Math.max(8, n2); i += 1) state.stars.push(makeStar(w, h, 2));
  }

  function wrap(v, max) {
    if (v < 0) return v + max;
    if (v > max) return v - max;
    return v;
  }

  function drawFrame() {
    const canvas = document.getElementById(state.options.canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = state.w;
    const h = state.h;
    const m = state.moodLerp;
    lerpMood();
    state.time += 0.016;

    const cDim = parseHexColor(readCssVar(VAR_NAMES.dim));
    const cBri = parseHexColor(readCssVar(VAR_NAMES.bright));
    const cHigh = parseHexColor(readCssVar(VAR_NAMES.highlight));
    const cRed = { r: 200, g: 60, b: 60 };
    const grey = { r: 75, g: 76, b: 82 };

    const parallaxX = (state.scroll01 - 0.5) * 24;

    const bgR = 10 + m.redMix * 40 + (m.greyBoost || 0) * 15;
    const bgG = 8 + m.redMix * 10 + (m.greyBoost || 0) * 18;
    const bgB = 18 + m.redMix * 5 + (m.greyBoost || 0) * 25;
    ctx.fillStyle = `rgb(${bgR|0},${bgG|0},${bgB|0})`;
    ctx.fillRect(0, 0, w, h);

    for (const s of state.stars) {
      const greyT = m.greyBoost || 0;
      const baseC =
        s.layer === 0
          ? lerpColor(cDim, lerpColor(cDim, grey, greyT + 0.2), 1)
          : s.layer === 1
            ? lerpColor(lerpColor(cDim, cBri, 0.5), lerpColor(cBri, grey, greyT), 1)
            : lerpColor(lerpColor(cBri, cHigh, 0.4), cHigh, 0.6);
      const colored = lerpColor(baseC, cRed, m.redMix);
      const driftK = s.layer * m.drift;
      const ox = s.x + parallaxX * s.layer * 0.2;
      const px = wrap(
        ox +
          state.time * driftK * 12 * s.driftX * (0.2 + s.layer * 0.5) * (0.2 + m.drift),
        w
      );
      const py = wrap(
        s.y + Math.sin(state.time * 0.05 * s.driftX + s.twDelay) * 0.3 * s.layer * m.drift * 6,
        h
      );
      const jit = m.jitter * 2.2;
      const jx = jit > 0 ? (Math.random() - 0.5) * jit * s.layer : 0;
      const jy = jit > 0 ? (Math.random() - 0.5) * jit * s.layer : 0;
      const tw = s.layer === 2
        ? 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(state.time * s.twSpeed + s.twDelay)) * m.twinkle
        : 0.4 + 0.45 * m.twinkle;

      ctx.beginPath();
      ctx.arc(px + jx, py + jy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(colored, s.layer === 0 ? 0.35 * tw : s.layer === 1 ? 0.55 * tw : tw);
      ctx.fill();
    }

    state.raf = requestAnimationFrame(drawFrame);
  }

  function resize() {
    const canvas = document.getElementById(state.options.canvasId);
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.dpr = dpr;
    state.w = window.innerWidth;
    state.h = window.innerHeight;
    canvas.width = state.w * dpr;
    canvas.height = state.h * dpr;
    canvas.style.width = `${state.w}px`;
    canvas.style.height = `${state.h}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function updateBodyClass() {
    const mood = state.targetMood;
    document.body.classList.remove(
      "star-mood--calm",
      "star-mood--uneasy",
      "star-mood--danger",
      "star-mood--technical"
    );
    if (mood === "uneasy") document.body.classList.add("star-mood--uneasy");
    else if (mood === "danger") document.body.classList.add("star-mood--danger");
    else if (mood === "technical") document.body.classList.add("star-mood--technical");
    else document.body.classList.add("star-mood--calm");
  }

  function setMood(moodName) {
    if (!MOODS[moodName]) return;
    state.targetMood = moodName;
    updateBodyClass();
  }

  function setFromPhoneTheme(theme) {
    if (theme === "safe") setMood("calm");
    else if (theme === "odd") setMood("uneasy");
    else if (theme === "danger") setMood("danger");
    else setMood("calm");
  }

  function setScroll01(t) {
    state.scroll01 = Math.max(0, Math.min(1, t));
  }

  function onScroll() {
    const scrolly = document.getElementById("hook");
    if (!scrolly) {
      setScroll01(0);
      return;
    }
    const rect = scrolly.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = scrolly.offsetHeight - vh;
    const p = total > 0 ? (-rect.top) / total : 0;
    setScroll01(Number.isFinite(p) ? p : 0);
  }

  function init(userOptions) {
    state.options = { ...state.options, ...userOptions };
    if (!document.getElementById(state.options.canvasId)) return;
    resize();
    if (userOptions && userOptions.mood) setMood(userOptions.mood);
    window.addEventListener("resize", () => {
      resize();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (state.raf) cancelAnimationFrame(state.raf);
    drawFrame();
  }

  window.Starfield = {
    init,
    setMood,
    setFromPhoneTheme,
    setScroll01,
  };
})();
