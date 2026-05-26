import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/mm-viewer.css';

// ── Lightbox with zoom/pan locked to image bounds ──────────
function Lightbox({ src, alt, onClose }) {
  const [scale, setScale]     = useState(1);
  const [offset, setOffset]   = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart  = useRef(null);
  const imgRef     = useRef(null);
  const frameRef   = useRef(null);

  const MIN = 1, MAX = 4;

  const clampOffset = useCallback((nx, ny, s) => {
    const img   = imgRef.current;
    const frame = frameRef.current;
    if (!img || !frame) return { x: nx, y: ny };

    const iw = img.naturalWidth  || img.offsetWidth;
    const ih = img.naturalHeight || img.offsetHeight;
    const fw = frame.offsetWidth;
    const fh = frame.offsetHeight;

    // Rendered size at current scale
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
      // Zoom toward cursor
      setOffset(o => {
        const frame = frameRef.current;
        if (!frame) return o;
        const fw = frame.offsetWidth;
        const fh = frame.offsetHeight;
        const rx = cx - fw / 2;
        const ry = cy - fh / 2;
        const nx = o.x - rx * (next / prev - 1);
        const ny = o.y - ry * (next / prev - 1);
        return clampOffset(nx, ny, next);
      });
      return next;
    });
  }, [clampOffset]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    zoom(e.deltaY < 0 ? 0.3 : -0.3, e.clientX - rect.left, e.clientY - rect.top);
  }, [zoom]);

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

  // Reset when image changes
  useEffect(() => { setScale(1); setOffset({ x: 0, y: 0 }); }, [src]);

  // Reset pan when zoomed back to 1
  useEffect(() => { if (scale === 1) setOffset({ x: 0, y: 0 }); }, [scale]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const handleZoomBtn = (delta) => {
    const frame = frameRef.current;
    if (!frame) return;
    zoom(delta, frame.offsetWidth / 2, frame.offsetHeight / 2);
  };

  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="lb-window" onClick={e => e.stopPropagation()}>

        {/* Toolbar */}
        <div className="lb-toolbar">
          <button className="lb-btn" onClick={() => handleZoomBtn(0.5)}>＋</button>
          <span className="lb-scale-label">{Math.round(scale * 100)}%</span>
          <button className="lb-btn" onClick={() => handleZoomBtn(-0.5)}>－</button>
          <button className="lb-btn" onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}>↺</button>
          <button className="lb-btn lb-close" onClick={onClose}>✕</button>
        </div>

        {/* Image frame — zoom/pan locked here */}
        <div
          className="lb-frame"
          ref={frameRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
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
export default function MultimediaViewer({ project }) {
  const [textContent, setTextContent] = useState("Loading document...");
  const [lightbox, setLightbox]       = useState(null); // { src, alt }

  useEffect(() => {
    if (project && project.fileUrl) {
      setTextContent("Loading document...");
      fetch(project.fileUrl)
        .then(r => { if (!r.ok) throw new Error(); return r.text(); })
        .then(t => setTextContent(t))
        .catch(() => setTextContent("[ ERROR: Unable to load text file. Verify path. ]"));
    }
  }, [project]);

  if (!project) return null;

  const openLightbox = (src, alt) => setLightbox({ src, alt });
  const closeLightbox = () => setLightbox(null);

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
                onClick={() => openLightbox(src, `${project.title} ${i + 1}`)}
                title="Click to enlarge"
              >
                <img src={src} alt={`${project.title} ${i + 1}`} draggable="false" />
                <div className="mm-grid-hover">🔍</div>
              </div>
            ))}
          </div>

        /* Single image */
        ) : project.image ? (
          <div
            className="mm-image-canvas mm-image-clickable"
            onClick={() => openLightbox(project.image, project.title)}
            title="Click to enlarge"
          >
            <img src={project.image} alt={project.title} draggable="false" />
            <div className="mm-grid-hover">🔍</div>
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

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />
      )}
    </div>
  );
}