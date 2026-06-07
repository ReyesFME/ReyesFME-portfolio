import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/mm-viewer.css';

// ── detect mobile ──────────────────────────────────────────
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

// ── Lightbox ───────────────────────────────────────────────
export function Lightbox({ src, alt, onClose, mobileMode = false }) {
  const [scale, setScale]       = useState(1);
  const [offset, setOffset]     = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const imgRef    = useRef(null);
  const frameRef  = useRef(null);
  const lastTap   = useRef(0);
  const pinchRef  = useRef(null);

  const MIN = 1, MAX = 4;

  const clampOffset = useCallback((nx, ny, s) => {
    const img   = imgRef.current;
    const frame = frameRef.current;
    if (!img || !frame) return { x: nx, y: ny };
    const iw = img.naturalWidth  || img.offsetWidth;
    const ih = img.naturalHeight || img.offsetHeight;
    const fw = frame.offsetWidth;
    const fh = frame.offsetHeight;
    const rw = Math.min(iw, fw) * s;
    const rh = Math.min(ih, fh) * s;
    const maxX = Math.max(0, (rw - fw) / 2);
    const maxY = Math.max(0, (rh - fh) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, nx)),
      y: Math.min(maxY, Math.max(-maxY, ny)),
    };
  }, []);

  const zoom = useCallback((delta, cx, cy) => {
    setScale(prev => {
      const next = Math.min(MAX, Math.max(MIN, prev + delta));
      if (next === prev) return prev;
      setOffset(o => {
        const frame = frameRef.current;
        if (!frame) return o;
        const rx = cx - frame.offsetWidth  / 2;
        const ry = cy - frame.offsetHeight / 2;
        const nx = o.x - rx * (next / prev - 1);
        const ny = o.y - ry * (next / prev - 1);
        return clampOffset(nx, ny, next);
      });
      return next;
    });
  }, [clampOffset]);

  // ── mouse wheel (desktop) ──────────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    zoom(e.deltaY < 0 ? 0.3 : -0.3, e.clientX - rect.left, e.clientY - rect.top);
  }, [zoom]);

  // ── mouse drag (desktop) ───────────────────────────────
  const onMouseDown = useCallback((e) => {
    if (scale <= 1) return;
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }, [scale, offset]);

  const onMouseMove = useCallback((e) => {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale));
  }, [dragging, scale, clampOffset]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  // ── touch handlers (mobile) ────────────────────────────
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        dist: Math.hypot(dx, dy),
        scale,
        cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        cy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    } else if (e.touches.length === 1) {
      if (scale > 1) {
        dragStart.current = {
          mx: e.touches[0].clientX,
          my: e.touches[0].clientY,
          ox: offset.x,
          oy: offset.y,
        };
        setDragging(true);
      }
      // double-tap to reset zoom
      const now = Date.now();
      if (now - lastTap.current < 300) {
        setScale(1);
        setOffset({ x: 0, y: 0 });
      }
      lastTap.current = now;
    }
  }, [scale, offset]);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchRef.current) {
      const dx   = e.touches[0].clientX - e.touches[1].clientX;
      const dy   = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = (dist - pinchRef.current.dist) * 0.01;
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      zoom(delta, pinchRef.current.cx - rect.left, pinchRef.current.cy - rect.top);
      pinchRef.current.dist = dist;
    } else if (e.touches.length === 1 && dragging && dragStart.current) {
      const dx = e.touches[0].clientX - dragStart.current.mx;
      const dy = e.touches[0].clientY - dragStart.current.my;
      setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale));
    }
  }, [dragging, scale, zoom, clampOffset]);

  const onTouchEnd = useCallback(() => {
    setDragging(false);
    pinchRef.current = null;
  }, []);

  useEffect(() => { setScale(1); setOffset({ x: 0, y: 0 }); }, [src]);
  useEffect(() => { if (scale === 1) setOffset({ x: 0, y: 0 }); }, [scale]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    el.addEventListener('wheel',     onWheel,     { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      el.removeEventListener('wheel',     onWheel);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [onWheel, onTouchMove]);

  const zoomBtn = (delta) => {
    const frame = frameRef.current;
    if (!frame) return;
    zoom(delta, frame.offsetWidth / 2, frame.offsetHeight / 2);
  };

  // ── MOBILE: fullscreen, close button + tap-outside closes ──
  if (mobileMode) {
    return (
      <div
        className="lb-overlay lb-overlay--mobile"
        onClick={onClose}
      >
        {/* Always-visible close button */}
        <button
          className="lb-mobile-close-btn"
          onClick={onClose}
          type="button"
          aria-label="Close image viewer"
        >
          ✕
        </button>

        <div
          className="lb-frame lb-frame--mobile"
          ref={frameRef}
          onClick={e => e.stopPropagation()}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className="lb-img"
            draggable="false"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
        </div>
      </div>
    );
  }

  // ── DESKTOP: original toolbar + window chrome ──────────
  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="lb-window" onClick={e => e.stopPropagation()}>
        <div className="lb-toolbar">
          <button className="lb-btn" onClick={() => zoomBtn(0.5)}>＋</button>
          <span className="lb-scale-label">{Math.round(scale * 100)}%</span>
          <button className="lb-btn" onClick={() => zoomBtn(-0.5)}>－</button>
          <button className="lb-btn" onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}>↺</button>
          <button className="lb-btn lb-close" onClick={onClose}>✕</button>
        </div>
        <div
          className="lb-frame"
          ref={frameRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className="lb-img"
            draggable="false"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main viewer ────────────────────────────────────────────
export default function MultimediaViewer({ project, onMobileLightboxOpen }) {
  const [textContent, setTextContent] = useState("Loading document...");
  const [lightbox, setLightbox]       = useState(null);

  useEffect(() => {
    if (project?.fileUrl) {
      setTextContent("Loading document...");
      fetch(project.fileUrl)
        .then(r => { if (!r.ok) throw new Error(); return r.text(); })
        .then(t => setTextContent(t))
        .catch(() => setTextContent("[ ERROR: Unable to load text file. Verify path. ]"));
    }
  }, [project]);

  if (!project) return null;

  const handleImageClick = (src, alt) => {
    if (isMobile() && onMobileLightboxOpen) {
      // mobile: bubble up to parent, skip detail window
      onMobileLightboxOpen(src, alt);
    } else {
      // desktop: open inline lightbox as before
      setLightbox({ src, alt });
    }
  };

  return (
    <div className="mm-container">
      <div className="mm-header">
        <h2 className="mm-title">{project.title}</h2>
        <span className="mm-meta">Type: {project.medium || "Multimedia Asset"}</span>
      </div>

      <div className="mm-content-area">

        {/* Multiple images — wrapping grid */}
        {project.images ? (
          <div className="mm-images-grid">
            {project.images.map((src, i) => (
              <div
                key={i}
                className="mm-grid-cell"
                onClick={() => handleImageClick(src, `${project.title} ${i + 1}`)}
                title="Click to enlarge"
              >
                <img src={src} alt={`${project.title} ${i + 1}`} draggable="false" />
              </div>
            ))}
          </div>

        /* Single image */
        ) : project.image ? (
          <div
            className="mm-image-canvas mm-image-clickable"
            onClick={() => handleImageClick(project.image, project.title)}
            title="Click to enlarge"
          >
            <img src={project.image} alt={project.title} draggable="false" />
          </div>

        /* Text file */
        ) : project.fileUrl ? (
          <div className="mm-text-reader">{textContent}</div>

        /* Fallback */
        ) : (
          <div className="mm-text-reader" style={{ color: '#ff5555' }}>
            [ ERROR: No valid media source found for this file. ]
          </div>
        )}

      </div>

      {/* Desktop-only inline lightbox */}
      {lightbox && !isMobile() && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
          mobileMode={false}
        />
      )}
    </div>
  );
}