import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import '../../styles/book-reader.css';

const Page = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage" ref={ref}>
            <img
                src={props.imageUrl}
                alt={`TTRPG Page ${props.pageNumber}`}
                className="ttrpg-page-image"
                loading="lazy"
            />
        </div>
    );
});

const ImmersiveTtrpgReader = ({ onClose }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [pageInput, setPageInput] = useState("1");
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

    const bookRef = useRef(null);
    const zoomContainerRef = useRef(null);

    const totalPages = 146;
    const baseUrl = "https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto,f_auto/v1779893603";

    const bookPages = Array.from({ length: totalPages }, (_, i) => {
        const paddedNumber = String(i + 1).padStart(3, '0');
        return `${baseUrl}/AP-TTRPG_${paddedNumber}.jpg`;
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (bookRef.current && bookRef.current.pageFlip()) {
                bookRef.current.pageFlip().update();
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Wheel zoom
    useEffect(() => {
        const container = zoomContainerRef.current;
        const handleWheel = (e) => {
            e.preventDefault();
            if (e.deltaY < 0) setZoomLevel(prev => Math.min(prev + 0.25, 3));
            else if (e.deltaY > 0) setZoomLevel(prev => Math.max(prev - 0.25, 1));
        };
        if (container) container.addEventListener('wheel', handleWheel, { passive: false });
        return () => { if (container) container.removeEventListener('wheel', handleWheel); };
    }, []);

    // Touch pinch-to-zoom
    useEffect(() => {
        const container = zoomContainerRef.current;
        if (!container) return;

        let lastDist = null;

        const getTouchDist = (touches) => {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const dist = getTouchDist(e.touches);
                if (lastDist !== null) {
                    const delta = dist - lastDist;
                    setZoomLevel(prev => Math.min(Math.max(prev + delta * 0.01, 1), 3));
                }
                lastDist = dist;
            }
        };
        const handleTouchEnd = () => { lastDist = null; };

        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        return () => {
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const handleToggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
        setTimeout(() => { if (bookRef.current) bookRef.current.pageFlip().update(); }, 50);
    };

    const handleCloseBook = () => {
        setZoomLevel(1);
        setIsDragging(false);
        if (bookRef.current) bookRef.current.pageFlip().turnToPage(0);
    };

    // Mouse drag (desktop zoom)
    const onMouseDown = (e) => {
        if (zoomLevel <= 1) return;
        setIsDragging(true);
        setDragStart({ x: e.pageX, y: e.pageY });
        setScrollPos({
            left: zoomContainerRef.current.scrollLeft,
            top: zoomContainerRef.current.scrollTop
        });
    };
    const onMouseMove = (e) => {
        if (!isDragging || zoomLevel <= 1) return;
        e.preventDefault();
        zoomContainerRef.current.scrollLeft = scrollPos.left - (e.pageX - dragStart.x);
        zoomContainerRef.current.scrollTop  = scrollPos.top  - (e.pageY - dragStart.y);
    };
    const onMouseUpOrLeave = () => setIsDragging(false);

    // Touch drag (mobile zoom)
    const touchDragRef = useRef(null);
    const onTouchDragStart = (e) => {
        if (zoomLevel <= 1 || e.touches.length !== 1) return;
        touchDragRef.current = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY,
            left: zoomContainerRef.current.scrollLeft,
            top: zoomContainerRef.current.scrollTop,
        };
    };
    const onTouchDragMove = (e) => {
        if (!touchDragRef.current || zoomLevel <= 1 || e.touches.length !== 1) return;
        const dx = e.touches[0].pageX - touchDragRef.current.x;
        const dy = e.touches[0].pageY - touchDragRef.current.y;
        zoomContainerRef.current.scrollLeft = touchDragRef.current.left - dx;
        zoomContainerRef.current.scrollTop  = touchDragRef.current.top  - dy;
    };
    const onTouchDragEnd = () => { touchDragRef.current = null; };

    // ─── PAGE FLIP HANDLER ───────────────────────────────────────────────────
    // react-pageflip fires onFlip with the INDEX of the first visible page (0-based).
    // In portrait/mobile mode (usePortrait=true) it shows one page at a time and
    // increments by 1, so page index === displayed page number - 1. ✓
    // In landscape/desktop mode it shows a spread, so index 0 = pages 1-2, index 2 = pages 3-4, etc.
    const onPageFlip = (e) => {
        const pageIndex = e.data; // 0-based index of the left (or only) page
        setCurrentPage(pageIndex);

        if (isMobile) {
            // Portrait: one page at a time — just show the page number
            setPageInput(String(pageIndex + 1));
        } else {
            // Landscape spread: show "N – N+1" range (capped at totalPages)
            const left  = pageIndex + 1;
            const right = Math.min(pageIndex + 2, totalPages);
            setPageInput(left === right ? String(left) : `${left}-${right}`);
        }
    };

    // ─── JUMP TO PAGE ────────────────────────────────────────────────────────
    // The input stores a human-readable page number (1-based).
    // turnToPage() expects a 0-based index.
    // In landscape mode react-pageflip requires even indices for left-page opens,
    // so we floor to the nearest even index for the spread view.
    const handleJumpToPage = () => {
        const raw = parseInt(pageInput, 10);
        if (isNaN(raw)) return;
        const clamped = Math.min(Math.max(raw, 1), totalPages);
        const idx = clamped - 1; // 0-based

        if (bookRef.current) {
            if (isMobile) {
                bookRef.current.pageFlip().turnToPage(idx);
            } else {
                // Snap to the start of the spread (even index)
                const spreadIdx = idx % 2 === 0 ? idx : idx - 1;
                bookRef.current.pageFlip().turnToPage(spreadIdx);
            }
        }
    };

    // ─── PREV / NEXT ─────────────────────────────────────────────────────────
    const handlePrev = () => {
        if (!bookRef.current) return;
        bookRef.current.pageFlip().flipPrev();
    };
    const handleNext = () => {
        if (!bookRef.current) return;
        bookRef.current.pageFlip().flipNext();
    };

    return (
        <div className={`ttrpg-viewer-container ${isFullscreen ? 'ttrpg-viewer-container--fullscreen' : ''}`}>

            {/* ── BACK BUTTON ── */}
            <div style={{
                position: 'absolute',
                top: isMobile ? '10px' : '20px',
                left: isMobile ? '10px' : '30px',
                zIndex: 10000
            }}>
               
            </div>

            {/* ── TOP UTILITIES ── */}
            <div className="ttrpg-top-utils">
                <button onClick={handleToggleFullscreen} className="ttrpg-util-btn ttrpg-util-btn--exit">
                    {isFullscreen
                        ? (isMobile ? '↙ EXIT' : '↙ EXIT FULLSCREEN')
                        : (isMobile ? '⛶ FULL' : '⛶ FULLSCREEN')}
                </button>
                <button onClick={handleCloseBook} className="ttrpg-util-btn ttrpg-util-btn--close">
                    {isMobile ? '✕ COVER' : '✕ CLOSE BOOK'}
                </button>
            </div>

            {/* ── ZOOM + BOOK ── */}
            <div
                ref={zoomContainerRef}
                className="ttrpg-zoom-container"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUpOrLeave}
                onMouseLeave={onMouseUpOrLeave}
                onTouchStart={onTouchDragStart}
                onTouchMove={onTouchDragMove}
                onTouchEnd={onTouchDragEnd}
                style={{
                    justifyContent: zoomLevel > 1 ? 'flex-start' : 'center',
                    alignItems:     zoomLevel > 1 ? 'flex-start' : 'center',
                    overflow:       zoomLevel > 1 ? 'auto'       : 'hidden',
                    cursor:         zoomLevel > 1
                        ? (isDragging ? 'grabbing' : 'grab')
                        : 'auto',
                }}
            >
                <div
                    className={`ttrpg-zoom-wrapper ${!isDragging ? 'ttrpg-zoom-wrapper--transition' : ''}`}
                    style={{
                        transform:       `scale(${zoomLevel})`,
                        transformOrigin: zoomLevel > 1 ? '0 0' : 'center center',
                        pointerEvents:   isDragging ? 'none' : 'auto',
                        margin:          zoomLevel > 1 ? 'auto' : '0 auto',
                    }}
                >
                    <HTMLFlipBook
                        ref={bookRef}
                        width={400}
                        height={600}
                        size="stretch"
                        minWidth={280}
                        maxWidth={isMobile ? 500 : 1000}
                        minHeight={400}
                        maxHeight={1533}
                        maxShadowOpacity={0.6}
                        showCover={true}
                        mobileScrollSupport={true}
                        /*
                         * usePortrait=true  → single-page portrait mode on mobile.
                         *   - Flips one page at a time (no spread skipping).
                         *   - onFlip index increments by 1 each flip. ✓
                         */
                        usePortrait={isMobile}
                        className="ttrpg-flipbook"
                        onFlip={onPageFlip}
                        style={{
                            margin: '0 auto',
                            pointerEvents: zoomLevel > 1 ? 'none' : 'auto',
                        }}
                    >
                        {bookPages.map((url, index) => (
                            <Page key={index} imageUrl={url} pageNumber={index + 1} />
                        ))}
                    </HTMLFlipBook>
                </div>
            </div>

            {/* ── BOTTOM NAV ── */}
            <div className="ttrpg-bottom-nav">
                {/* Zoom controls */}
                <div className="ttrpg-zoom-controls">
                    <button
                        onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
                        disabled={zoomLevel <= 1}
                        className="ttrpg-zoom-btn"
                        title="Zoom out"
                    >−</button>
                    <button
                        onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
                        disabled={zoomLevel >= 3}
                        className="ttrpg-zoom-btn"
                        title="Zoom in"
                    >+</button>
                </div>

                {/* Prev */}
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="ttrpg-nav-btn"
                >◄ PREV</button>

                {/* Page tracker + jump */}
                <div className="ttrpg-page-tracker">
                    <input
                        type="text"
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleJumpToPage(); }}
                        className="ttrpg-page-input"
                        style={{ width: pageInput.length > 3 ? '65px' : '40px' }}
                        inputMode="numeric"
                        aria-label="Page number"
                    />
                    <span>/ {totalPages}</span>
                </div>

                {/* Next */}
                <button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages - 1}
                    className="ttrpg-nav-btn"
                >
                    <span className="ttrpg-next-text">NEXT</span> ►
                </button>
            </div>
        </div>
    );
};

export default ImmersiveTtrpgReader;