import React, { useEffect, useRef } from 'react';

// ── comet cursor + constellation trail (desktop pointers only) ─
// Dark mode : white stars.
// Light mode: reddish-orange → golden-yellow stars (the colour drifts along the trail).
// It detects light mode by looking for  .itd-page.it-light-mode  in the page,

// ── trail settings: edit these numbers ──────────────────────
const HEAD_DELAY_MS         = 0;      // 0 = the comet sits exactly on your real cursor. Raise it (e.g. 60) for a soft lag
const STAR_SPACING          = 18;     // px the comet travels before it leaves a star. Lower = fuller trail
const STAR_MIN_INTERVAL     = 35;     // ms between stars at most
const STAR_JITTER           = 3;      // px of random scatter around the cursor path
const STARS_PER_CONSTELLATION = 12;   // the trail is built in chunks of this many stars; each chunk fades together
const CONSTELLATION_PAUSE_MS  = 250;  // pause in movement that finishes the current chunk
const HOLD_MS               = 500;    // how long a finished chunk stays fully visible before fading (shorter = shorter trail)
const FADE_OUT_MS           = 700;    // the fade-out animation
const BURST_HOLD_MS         = 1500;   // the click constellation on previews lingers a bit longer than the hover trail
const STAR_FADE_IN_MS       = 250;    // each new star eases in over this long
const TWINKLE               = 0.3;    // how deep the twinkle goes. 0 = steady, 0.5 = strong
const TWINKLE_PERIOD_MS     = 2200;   // one full twinkle cycle (slower = calmer)
const MAX_GROUPS            = 14;
const MAX_LINK_DIST         = 170;    // longer lines are skipped so fast flicks don't draw long streaks
const LINE_ALPHA            = 0.6;    // brightness of lines between neighbouring stars
const LINE2_ALPHA           = 0.15;   // extra "triangle" lines. 0 = cleaner chain, higher = fuller web
const LINE_WIDTH            = 1;      // thickness of the bright core of each line (px)
const LINE_GLOW_WIDTH       = 5;      // extra width of the soft glow around each line (px). 0 = no line glow
const LINE_GLOW_ALPHA       = 0.2;    // brightness of that glow
const STAR_ALPHA            = 1;      // brightness of the star dots
const STAR_SIZE_MIN         = 1.2;    // star radius range (px)
const STAR_SIZE_MAX         = 2.6;
const STAR_GLOW             = 9;      // soft halo around each star. 0 = no halo
const HEAD_GLOW             = 0.22;   // brightness of the soft glow around the comet head
const HEAD_CORE             = 0.6;    // brightness of the comet head's centre dot

// ── light-mode palette ──────────────────────────────────────
const LIGHT_HUE_MIN         = 6;      // reddish-orange
const LIGHT_HUE_MAX         = 46;     // golden yellow
const LIGHT_HUE_SPEED_MS    = 450;    // smaller = the colour shifts faster along the trail
const LIGHT_LIGHTNESS       = 50;     // 0-100. Lower = deeper colours (easier to see on a light page)
const LIGHT_LINE_BOOST      = 1.5;    // lines/glow are stronger on a light background
const LIGHT_LINE_WIDTH      = 1.5;
const LIGHT_STAR_GLOW       = 12;
const LIGHT_HEAD_BOOST      = 2.2;

const POPUP_SELECTOR = '.psb-overlay, .itd-drawer--open';
const LIGHT_SELECTOR = '.itd-page.it-light-mode';

const rand = (min, max) => min + Math.random() * (max - min);
const ease = (t) => t * t * (3 - 2 * t);   // smooth ease in and out, t from 0 to 1

// colour of the moment: slides back and forth between reddish-orange and yellow
const hueAt = (now) =>
  LIGHT_HUE_MIN + (LIGHT_HUE_MAX - LIGHT_HUE_MIN) * (0.5 + 0.5 * Math.sin(now / LIGHT_HUE_SPEED_MS));

// white in dark mode, hsl() in light mode
const tint = (light, h, a, l = LIGHT_LIGHTNESS) =>
  light ? `hsla(${h},100%,${l}%,${a})` : `rgba(255,255,255,${a})`;

const CursorTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const fine   =
      window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(any-pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const groups = [];            // each group is one constellation
    let current = null;           // the constellation the comet is drawing right now
    const mouse = { x: 0, y: 0, seen: false, inside: true };
    const head  = { x: 0, y: 0, a: 0 };
    let lastDrop = { x: 0, y: 0, t: 0 };
    let raf = 0;
    let prevNow = 0;
    let popupOpen = false;
    let light = false;            // re-read every frame
    let calm = 1;                 // 1 = trail visible, fades to 0 while a window is open

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const newGroup = (now, closedLoop, hold) => {
      const g = { stars: [], closedAt: 0, lastAdd: now, loop: !!closedLoop, hold: hold || HOLD_MS };
      groups.push(g);
      if (groups.length > MAX_GROUPS) groups.shift();
      return g;
    };

    const addStar = (g, x, y, r, fadeIn, now, h) => {
      g.stars.push({ x, y, r, fadeIn, born: now, seed: Math.random() * Math.PI * 2, h });
      g.lastAdd = now;
    };

    const closeGroup = (g, now) => {
      if (!g.closedAt) g.closedAt = now;
      if (current === g) current = null;
    };

    // whole-constellation brightness: full while it's being drawn and during the hold, then one smooth fade
    const groupAlpha = (g, now) => {
      if (!g.closedAt) return 1;
      const age = now - g.closedAt;
      if (age <= g.hold) return 1;
      const t = (age - g.hold) / FADE_OUT_MS;
      return t >= 1 ? 0 : 1 - ease(t);
    };

    const starIn = (st, now) => ease(Math.min(1, (now - st.born) / st.fadeIn));

    const twinkle = (st, now) =>
      1 - TWINKLE + TWINKLE * (0.5 + 0.5 * Math.sin((now / TWINKLE_PERIOD_MS) * Math.PI * 2 + st.seed));

    const drawLink = (A, B, ga, now, strength) => {
      if (!A || !B) return;
      if (Math.hypot(A.x - B.x, A.y - B.y) > MAX_LINK_DIST) return;
      const boost = light ? LIGHT_LINE_BOOST : 1;
      const a = Math.min(1, ga * Math.min(starIn(A, now), starIn(B, now)) * strength * boost);
      if (a < 0.01) return;
      const h = ((A.h || 0) + (B.h || 0)) / 2;
      const core = light ? LIGHT_LINE_WIDTH : LINE_WIDTH;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      if (LINE_GLOW_WIDTH > 0) {            // soft wide pass first, then the bright core on top
        ctx.lineWidth = core + LINE_GLOW_WIDTH;
        ctx.strokeStyle = tint(light, h, a * LINE_GLOW_ALPHA);
        ctx.stroke();
      }
      ctx.lineWidth = core;
      ctx.strokeStyle = tint(light, h, a);
      ctx.stroke();
    };

    const loop = (now) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // comet head follows the real cursor (exactly, when HEAD_DELAY_MS is 0)
      const dt = prevNow ? Math.min(now - prevNow, 50) : 16;
      prevNow = now;
      popupOpen = !!document.querySelector(POPUP_SELECTOR);
      light = !!document.querySelector(LIGHT_SELECTOR);
      calm += ((popupOpen ? 0 : 1) - calm) * 0.2;
      if (mouse.seen) {
        const follow = HEAD_DELAY_MS > 0 ? 1 - Math.exp(-dt / HEAD_DELAY_MS) : 1;
        head.x += (mouse.x - head.x) * follow;
        head.y += (mouse.y - head.y) * follow;
      }
      const headTarget = mouse.seen && mouse.inside && !popupOpen ? 1 : 0;
      head.a += (headTarget - head.a) * 0.1;

      // leave a star each time the comet has travelled far enough
      if (
        !popupOpen &&
        head.a > 0.3 &&
        Math.hypot(head.x - lastDrop.x, head.y - lastDrop.y) > STAR_SPACING &&
        now - lastDrop.t > STAR_MIN_INTERVAL
      ) {
        if (current && current.stars.length >= STARS_PER_CONSTELLATION) {
          // start the next chunk from the same spot (an invisible copy of the last star) so the line stays continuous
          const tail = current.stars[current.stars.length - 1];
          closeGroup(current, now);
          current = newGroup(now, false);
          current.stars.push({ ...tail, dup: true });
        }
        if (!current) current = newGroup(now, false);
        addStar(
          current,
          head.x + rand(-STAR_JITTER, STAR_JITTER),
          head.y + rand(-STAR_JITTER, STAR_JITTER),
          rand(STAR_SIZE_MIN, STAR_SIZE_MAX),
          STAR_FADE_IN_MS,
          now,
          hueAt(now) + rand(-4, 4),
        );
        lastDrop = { x: head.x, y: head.y, t: now };
      }

      if (popupOpen && current) closeGroup(current, now);

      // a pause in movement finishes the constellation being drawn
      if (current && now - current.lastAdd > CONSTELLATION_PAUSE_MS) closeGroup(current, now);

      // forget constellations that have fully faded out
      for (let i = groups.length - 1; i >= 0; i--) {
        const g = groups[i];
        if (g.closedAt && now - g.closedAt > g.hold + FADE_OUT_MS) groups.splice(i, 1);
      }

      // lines first, then stars on top
      ctx.lineCap = 'round';
      for (const g of groups) {
        const ga = groupAlpha(g, now) * calm;
        const st = g.stars;
        for (let i = 1; i < st.length; i++) {
          drawLink(st[i], st[i - 1], ga, now, LINE_ALPHA);
          if (i > 1) drawLink(st[i], st[i - 2], ga, now, LINE2_ALPHA);
        }
        if (g.loop && st.length > 2) drawLink(st[st.length - 1], st[0], ga, now, LINE_ALPHA);
      }

      // faint line from the comet head to the newest star
      if (current && current.stars.length && head.a > 0.05) {
        const last = current.stars[current.stars.length - 1];
        const a = starIn(last, now) * (light ? 0.3 : 0.08) * head.a;
        if (a > 0.01) {
          ctx.strokeStyle = tint(light, last.h || 0, a);
          ctx.lineWidth = light ? LIGHT_LINE_WIDTH : LINE_WIDTH;
          ctx.beginPath();
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(head.x, head.y);
          ctx.stroke();
        }
      }

      // stars: bright dot with a soft halo; larger ones also get a sparkle. They twinkle, the lines stay steady.
      const bigStar = STAR_SIZE_MIN + 0.7 * (STAR_SIZE_MAX - STAR_SIZE_MIN);
      const glow = light ? LIGHT_STAR_GLOW : STAR_GLOW;
      for (const g of groups) {
        const ga = groupAlpha(g, now) * calm;
        for (const st of g.stars) {
          if (st.dup) continue;
          const a = ga * starIn(st, now) * twinkle(st, now);
          if (a < 0.01) continue;
          ctx.shadowColor = tint(light, st.h, 0.9);
          ctx.shadowBlur = glow * a;
          ctx.fillStyle = tint(light, st.h, Math.min(1, a * STAR_ALPHA));
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fill();
          if (st.r > bigStar) {
            const len = st.r * 2.4;
            ctx.shadowBlur = 0;
            ctx.strokeStyle = tint(light, st.h, a * 0.6);
            ctx.beginPath();
            ctx.moveTo(st.x - len, st.y); ctx.lineTo(st.x + len, st.y);
            ctx.moveTo(st.x, st.y - len); ctx.lineTo(st.x, st.y + len);
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      // comet head: soft glow + small core
      if (head.a > 0.02) {
        const hh = hueAt(now);
        const boost = light ? LIGHT_HEAD_BOOST : 1;
        const gr = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
        gr.addColorStop(0, tint(light, hh, Math.min(1, HEAD_GLOW * boost * head.a)));
        gr.addColorStop(1, tint(light, hh, 0));
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = tint(light, hh, Math.min(1, HEAD_CORE * head.a * (light ? 1.4 : 1)), 46);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      const settling =
        (mouse.seen && Math.hypot(mouse.x - head.x, mouse.y - head.y) > 0.5) ||
        Math.abs(headTarget - head.a) > 0.02 ||
        Math.abs((popupOpen ? 0 : 1) - calm) > 0.02;
      if (groups.length || settling) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0; // idle: stop drawing until the next move or click
        prevNow = 0;
        if (head.a < 0.05) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const onMove = (e) => {
      if (!mouse.seen) {
        head.x = e.clientX;
        head.y = e.clientY;
        lastDrop = { x: e.clientX, y: e.clientY, t: performance.now() };
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.seen = true;
      mouse.inside = true;
      start();
    };

    const onLeave = () => {
      mouse.inside = false;
      if (current) closeGroup(current, performance.now());
      start();
    };

    // click on a preview: a small closed constellation blooms around the click point
    const onDown = (e) => {
      setTimeout(start, 150);   // re-check shortly after any click, in case it opened a window
      const t = e.target;
      if (!(t.closest && t.closest('.itd-mini'))) return;
      const now = performance.now();
      const g = newGroup(now, true, BURST_HOLD_MS);
      const n = 6;
      const base = Math.random() * Math.PI * 2;
      for (let k = 0; k < n; k++) {
        const ang = base + (k / n) * Math.PI * 2 + rand(-0.3, 0.3);
        const d = rand(16, 42);
        addStar(
          g,
          e.clientX + Math.cos(ang) * d,
          e.clientY + Math.sin(ang) * d,
          rand(STAR_SIZE_MIN, STAR_SIZE_MAX),
          250,
          now,
          rand(LIGHT_HUE_MIN, LIGHT_HUE_MAX),
        );
      }
      g.closedAt = now;
      start();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('resize', resize);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="itd-cursor-canvas" aria-hidden="true" />;
};

export default CursorTrail;