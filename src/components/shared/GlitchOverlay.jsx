import { useEffect, useRef } from 'react';

/**
 * GlitchOverlay — Analog Horror Canvas Transition
 *
 * Renders per-scanline horizontal displacement (the "wavy VHS warp"),
 * corrupt block artifacts, signal dropout flickers, chromatic red bleed,
 * and vertical static columns — all drawn directly to a fullscreen canvas.
 */

const GlitchOverlay = ({ active, onDone, onComplete }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const startRef  = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    // ── TIMING ────────────────────────────────────────────────────────────────
    const TOTAL      = 1000;
    const PEAK_START = 60;
    const PEAK_END   = 750;
    const SWAP_AT    = 420;

    let swapped   = false;
    let completed = false;

    // ── PRE-BAKE NOISE TEXTURE ─────────────────────────────────────────────────
    // Mostly black, sparse bright specks — matches the dark reference
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width  = W;
    noiseCanvas.height = H * 2; // extra height so we can scroll/wrap
    const nCtx   = noiseCanvas.getContext('2d');
    const imgData = nCtx.createImageData(W, H * 2);
    const px      = imgData.data;
    for (let i = 0; i < px.length; i += 4) {
      const r = Math.random();
      let v;
      if      (r < 0.62) v = 0;
      else if (r < 0.82) v = Math.floor(Math.random() * 35);
      else if (r < 0.94) v = Math.floor(Math.random() * 110);
      else               v = 160 + Math.floor(Math.random() * 95);
      px[i] = px[i+1] = px[i+2] = v;
      px[i+3] = 255;
    }
    nCtx.putImageData(imgData, 0, 0);

    // ── OFFSCREEN DRAW BUFFER ─────────────────────────────────────────────────
    // We draw the warped image here scanline-by-scanline, then composite to main
    const buf    = document.createElement('canvas');
    buf.width    = W;
    buf.height   = H;
    const bCtx   = buf.getContext('2d');

    // ── COLUMN DEFINITIONS ────────────────────────────────────────────────────
    const NUM_COLS = 5 + Math.floor(Math.random() * 5);
    const cols = Array.from({ length: NUM_COLS }, (_, i) => ({
      x:       (W / NUM_COLS) * i + Math.random() * (W / NUM_COLS * 0.6),
      width:   18 + Math.random() * 130,
      driftY:  0.2 + Math.random() * 1.2,
      noiseY:  Math.random() * H,
      alpha:   0.55 + Math.random() * 0.45,
      phase:   Math.random() * Math.PI * 2,
      hasEdge: Math.random() > 0.35,
    }));

    // ── CORRUPT BLOCK ARTIFACTS ───────────────────────────────────────────────
    const NUM_BLOCKS = 6 + Math.floor(Math.random() * 6);
    const blocks = Array.from({ length: NUM_BLOCKS }, () => ({
      x:       Math.random() * W,
      y:       Math.random() * H,
      w:       20 + Math.random() * 200,
      h:       4  + Math.random() * 30,
      life:    Math.random(),
      maxLife: 0.1 + Math.random() * 0.35,
      shiftX:  (Math.random() - 0.5) * 60,
      speed:   1 + Math.random() * 3,
    }));

    // ── WAVE PARAMETERS ───────────────────────────────────────────────────────
    // Multiple sine waves layered — makes the warp feel organic/unpredictable
    const waves = [
      { amp: 0,  freq: 0,     speed: 0 },    // filled dynamically each frame
      { amp: 0,  freq: 0,     speed: 0 },
      { amp: 0,  freq: 0,     speed: 0 },
    ];

    // ── RENDER LOOP ───────────────────────────────────────────────────────────
    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;

      // Intensity envelope
      let intensity;
      if      (elapsed < PEAK_START) intensity = elapsed / PEAK_START;
      else if (elapsed < PEAK_END)   intensity = 1;
      else                           intensity = 1 - (elapsed - PEAK_END) / (TOTAL - PEAK_END);
      intensity = Math.max(0, Math.min(1, intensity));

      // Ease-in curve so it snaps in rather than fading in weakly
      const eased = Math.pow(intensity, 0.6);

      if (!swapped && elapsed >= SWAP_AT) {
        swapped = true;
        onDone?.();
      }

      ctx.clearRect(0, 0, W, H);

      if (eased > 0.01) {

        // ── UPDATE WAVE PARAMS each frame (animated) ─────────────────────────
        // Wave 1: slow broad sway — the primary VHS tape warp
        waves[0] = {
          amp:   18 + Math.sin(ts * 0.0008) * 10,
          freq:  0.012 + Math.sin(ts * 0.0003) * 0.005,
          speed: ts * 0.0025,
        };
        // Wave 2: fast shallow ripple — signal interference
        waves[1] = {
          amp:   6 + Math.sin(ts * 0.002) * 4,
          freq:  0.04  + Math.cos(ts * 0.0007) * 0.015,
          speed: ts * 0.007,
        };
        // Wave 3: intermittent hard jerk — tape dropout spike
        const jerkPhase = Math.sin(ts * 0.0015);
        waves[2] = {
          amp:   jerkPhase > 0.7 ? 28 + Math.random() * 20 : 0,
          freq:  0.08,
          speed: ts * 0.012,
        };

        // ── 1. DRAW WARPED NOISE TO BUFFER (per-scanline) ─────────────────────
        bCtx.clearRect(0, 0, W, H);

        // Draw noise columns to buffer first
        cols.forEach((col) => {
          const srcY = ((col.noiseY + ts * col.driftY * 0.12) % (H * 2) + H * 2) % (H * 2);
          bCtx.save();
          bCtx.globalAlpha = col.alpha;

          // Two-pass wrap: fill top chunk then bottom
          const chunk1H = Math.min(H * 2 - srcY, H);
          bCtx.drawImage(noiseCanvas, 0, srcY, col.width, chunk1H, col.x, 0, col.width, chunk1H);
          if (chunk1H < H) {
            bCtx.drawImage(noiseCanvas, 0, 0, col.width, H - chunk1H, col.x, chunk1H, col.width, H - chunk1H);
          }

          // Bright edge streak
          if (col.hasEdge) {
            const eg = bCtx.createLinearGradient(col.x, 0, col.x + Math.min(col.width, 16), 0);
            eg.addColorStop(0,   `rgba(210,210,210,0.8)`);
            eg.addColorStop(0.4, `rgba(80,80,80,0.2)`);
            eg.addColorStop(1,   'rgba(0,0,0,0)');
            bCtx.fillStyle   = eg;
            bCtx.globalAlpha = 1;
            bCtx.fillRect(col.x, 0, Math.min(col.width, 16), H);
          }
          bCtx.restore();
        });

        // ── 2. APPLY PER-SCANLINE WAVE DISPLACEMENT ────────────────────────────
        // Read buffer, shift each scanline horizontally by summed wave offset
        // This is the core VHS warp — every horizontal line moves independently
        const STEP = 2; // process every N pixels (performance vs quality)
        for (let y = 0; y < H; y += STEP) {
          // Sum wave contributions for this scanline
          let totalShift = 0;
          for (const w of waves) {
            totalShift += Math.sin(y * w.freq + w.speed) * w.amp;
          }
          totalShift *= eased;

          // Only shift lines that cross a column (avoid shifting empty black)
          // We do it globally for the VHS feel — all lines warp together
          if (Math.abs(totalShift) < 0.5) continue;

          const lineData = bCtx.getImageData(0, y, W, STEP);
          bCtx.clearRect(0, y, W, STEP);
          bCtx.putImageData(lineData, Math.round(totalShift), y);
        }

        // ── 3. COMPOSITE BUFFER TO MAIN CANVAS ───────────────────────────────
        // Base dark fill first
        ctx.fillStyle = `rgba(0,0,0,${0.82 * eased})`;
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.globalAlpha = eased;
        ctx.drawImage(buf, 0, 0);
        ctx.restore();

        // ── 4. CORRUPT BLOCK ARTIFACTS ────────────────────────────────────────
        blocks.forEach((blk) => {
          blk.life += 0.016 * blk.speed;
          if (blk.life > blk.maxLife) {
            blk.x       = Math.random() * W;
            blk.y       = Math.random() * H;
            blk.w       = 20 + Math.random() * 200;
            blk.h       = 4  + Math.random() * 30;
            blk.shiftX  = (Math.random() - 0.5) * 60;
            blk.life    = 0;
            blk.maxLife = 0.1 + Math.random() * 0.35;
            blk.speed   = 1   + Math.random() * 3;
          }

          const ba = Math.sin((blk.life / blk.maxLife) * Math.PI) * eased * 0.95;
          if (ba < 0.01) return;

          ctx.save();
          ctx.globalAlpha = ba;
          // Grab a shifted slice from the noise as the "corrupt" block content
          const srcY = Math.random() * H;
          ctx.drawImage(noiseCanvas, 0, srcY % (H * 2), blk.w, blk.h, blk.x + blk.shiftX, blk.y, blk.w, blk.h);
          // Occasional red tint on corrupt blocks
          if (Math.random() < 0.3) {
            ctx.fillStyle = `rgba(100,0,0,0.35)`;
            ctx.fillRect(blk.x + blk.shiftX, blk.y, blk.w, blk.h);
          }
          ctx.restore();
        });

        // ── 5. SCANLINE GRID ──────────────────────────────────────────────────
        ctx.save();
        ctx.globalAlpha = 0.22 * eased;
        ctx.fillStyle   = 'rgba(0,0,0,1)';
        for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
        ctx.restore();

        // ── 6. DRIFTING RED BLEED BAND ────────────────────────────────────────
        const bandY    = ((ts * 0.065) % (H + 240)) - 120;
        const bandGrad = ctx.createLinearGradient(0, bandY, 0, bandY + 200);
        bandGrad.addColorStop(0,    'rgba(80,0,0,0)');
        bandGrad.addColorStop(0.45, `rgba(80,0,0,${0.2 * eased})`);
        bandGrad.addColorStop(0.55, `rgba(80,0,0,${0.2 * eased})`);
        bandGrad.addColorStop(1,    'rgba(80,0,0,0)');
        ctx.fillStyle = bandGrad;
        ctx.fillRect(0, bandY, W, 200);

        // ── 7. SIGNAL DROPOUT FLICKER ─────────────────────────────────────────
        // Random full-frame dark flash — tape losing tracking entirely
        if (Math.random() < 0.06 * eased) {
          ctx.fillStyle = `rgba(0,0,0,${0.7 + Math.random() * 0.25})`;
          ctx.fillRect(0, 0, W, H);
        }

        // ── 8. VIGNETTE ───────────────────────────────────────────────────────
        const vign = ctx.createRadialGradient(W/2, H/2, H * 0.1, W/2, H/2, H * 0.88);
        vign.addColorStop(0, 'rgba(0,0,0,0)');
        vign.addColorStop(1, `rgba(0,0,0,${0.94 * eased})`);
        ctx.fillStyle = vign;
        ctx.fillRect(0, 0, W, H);
      }

      if (elapsed >= TOTAL) {
        ctx.clearRect(0, 0, W, H);
        if (!completed) { completed = true; onComplete?.(); }
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    startRef.current = null;
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100vw',
        height:        '100vh',
        zIndex:        999999,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  );
};

export default GlitchOverlay;