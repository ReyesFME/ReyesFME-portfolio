import React, { useState, useEffect, useRef } from 'react';
import '../../styles/dfd-viewer-styles.css';

const DFD_IMAGES = [
  { id: 'ctx-no-sys', label: 'Context Diagram (Without System)', src: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1779798592/Context_Diagram_without_system_ambzfu.png' },
  { id: 'ctx-sys',    label: 'Context Diagram (With System)',    src: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1779798592/DFD-0_with_system_vfq6xh.png' },
  { id: 'lvl1',       label: 'Level 1 DFD',                      src: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1779798617/DFD-1_y1tyq2.png' },
  { id: 'lvl2',       label: 'Level 2 DFD',                      src: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1779798619/DFD-2_kdjyzd.png' }
];

export default function DfdViewer() {
  const [activeImg, setActiveImg] = useState(DFD_IMAGES[0]);
  const [zoom, setZoom] = useState(1);

  // References and state for dragging logic
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Reset zoom when switching tabs
  useEffect(() => {
    setZoom(1);
  }, [activeImg]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  // --- Dragging Handlers ---
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault(); // Prevents default browser image dragging behavior
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5; // Drag speed multiplier
    const walkY = (y - startY) * 1.5; // Drag speed multiplier
    
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  return (
    <div className="dfd-container">
      
      {/* Top Header Area: Tabs + Zoom Controls */}
      <div className="dfd-header">
        <div className="dfd-tabs">
          {DFD_IMAGES.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImg(img)}
              className={`dfd-btn ${activeImg.id === img.id ? 'active' : ''}`}
            >
              {img.label}
            </button>
          ))}
        </div>

        <div className="dfd-zoom-controls">
          <button onClick={handleZoomOut} className="dfd-btn" title="Zoom Out">-</button>
          <span className="dfd-zoom-level">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className="dfd-btn" title="Zoom In">+</button>
          <button onClick={handleReset} className="dfd-btn">Reset</button>
        </div>
      </div>

      {/* Image Display Area with Mouse Events */}
      <div 
        className="dfd-image-area dfd-scroll" 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ 
          cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'default'),
          justifyContent: zoom > 1 ? 'flex-start' : 'center' // <-- ADD THIS LINE
        }}
      >
        <img 
          src={activeImg.src} 
          alt={activeImg.label} 
          className="dfd-image"
          draggable="false" // Crucial: Disable native HTML image dragging so custom logic works
          style={{ 
            width: zoom === 1 ? '100%' : `${zoom * 100}%`, 
            maxWidth: zoom === 1 ? '100%' : 'none',
            // Disable pointer events on the image itself when dragging to prevent ghost-drag artifacts
            pointerEvents: isDragging ? 'none' : 'auto' 
          }} 
        />
      </div>

    </div>
  );
}