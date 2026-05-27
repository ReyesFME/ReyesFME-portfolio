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

    const handleToggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setTimeout(() => { if (bookRef.current) bookRef.current.pageFlip().update(); }, 50);
    };

    const handleCloseBook = () => {
        setZoomLevel(1);
        setIsDragging(false);
        if (bookRef.current) bookRef.current.pageFlip().turnToPage(0); 
    };

    const onMouseDown = (e) => {
        if (zoomLevel <= 1) return;
        setIsDragging(true);
        setDragStart({ x: e.pageX, y: e.pageY });
        setScrollPos({ left: zoomContainerRef.current.scrollLeft, top: zoomContainerRef.current.scrollTop });
    };

    const onMouseMove = (e) => {
        if (!isDragging || zoomLevel <= 1) return;
        e.preventDefault();
        zoomContainerRef.current.scrollLeft = scrollPos.left - (e.pageX - dragStart.x);
        zoomContainerRef.current.scrollTop = scrollPos.top - (e.pageY - dragStart.y);
    };

    const onMouseUpOrLeave = () => setIsDragging(false);

    const onPageFlip = (e) => {
        const pageIndex = e.data;
        setCurrentPage(pageIndex);
        const start = pageIndex + 1;
        if (isMobile || pageIndex === 0) setPageInput(start.toString());
        else {
            const end = Math.min(start + 1, totalPages);
            setPageInput(start === end ? start.toString() : `${start}-${end}`);
        }
    };

    return (
        <div className={`ttrpg-viewer-container ${isFullscreen ? 'ttrpg-viewer-container--fullscreen' : ''}`}>
            <div style={{ position: 'absolute', top: isMobile ? '10px' : '20px', left: isMobile ? '10px' : '30px', zIndex: 10000 }}>
                <button onClick={onClose} className="ttrpg-nav-btn" style={{ backgroundColor: 'rgba(10, 10, 12, 0.8)', border: '1px solid #4e4e4e' }}>
                    ← BACK TO SELECTION
                </button>
            </div>

            <div className="ttrpg-top-utils">
                <button onClick={handleToggleFullscreen} className="ttrpg-util-btn ttrpg-util-btn--exit">
                    {isFullscreen ? (isMobile ? '↙ EXIT' : '↙ EXIT FULLSCREEN') : (isMobile ? '⛶ FULL' : '⛶ FULLSCREEN')}
                </button>
                <button onClick={handleCloseBook} className="ttrpg-util-btn ttrpg-util-btn--close">
                    {isMobile ? '✕ COVER' : '✕ CLOSE BOOK'}
                </button>
            </div>

            <div 
                ref={zoomContainerRef}
                className="ttrpg-zoom-container"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUpOrLeave}
                onMouseLeave={onMouseUpOrLeave}
                style={{
                    justifyContent: zoomLevel > 1 ? 'flex-start' : 'center',
                    alignItems: zoomLevel > 1 ? 'flex-start' : 'center',
                    overflow: zoomLevel > 1 ? 'auto' : 'hidden',
                    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'auto'
                }}
            >
                <div 
                    className={`ttrpg-zoom-wrapper ${!isDragging ? 'ttrpg-zoom-wrapper--transition' : ''}`}
                    style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: zoomLevel > 1 ? '0 0' : 'center center',
                        pointerEvents: isDragging ? 'none' : 'auto',
                        margin: zoomLevel > 1 ? 'auto' : '0 auto' 
                    }}
                >
                    <HTMLFlipBook 
                        ref={bookRef}
                        width={400} height={600} size="stretch" 
                        minWidth={315} maxWidth={1000} minHeight={400} maxHeight={1533}
                        maxShadowOpacity={0.6} showCover={true} mobileScrollSupport={true}
                        usePortrait={isMobile} className="ttrpg-flipbook"
                        onFlip={onPageFlip} 
                        // The CSS pointer-events trick makes the book "deaf" to clicks when zoomed
                        style={{ margin: '0 auto', pointerEvents: zoomLevel > 1 ? 'none' : 'auto' }}
                    >
                        {bookPages.map((url, index) => <Page key={index} imageUrl={url} pageNumber={index + 1} />)}
                    </HTMLFlipBook>
                </div>
            </div>

            <div className="ttrpg-bottom-nav">
                <div className="ttrpg-zoom-controls">
                    <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))} disabled={zoomLevel <= 1} className="ttrpg-zoom-btn">-</button>
                    <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))} disabled={zoomLevel >= 3} className="ttrpg-zoom-btn">+</button>
                </div>
                <button onClick={() => bookRef.current.pageFlip().flipPrev()} disabled={currentPage === 0} className="ttrpg-nav-btn">◄ PREV</button>
                <div className="ttrpg-page-tracker">
                    <input type="text" value={pageInput} onChange={(e) => setPageInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') bookRef.current.pageFlip().turnToPage(parseInt(pageInput)-1)}} className="ttrpg-page-input" style={{ width: pageInput.length > 3 ? '65px' : '40px' }} />
                    <span>/ {totalPages}</span>
                </div>
                <button onClick={() => bookRef.current.pageFlip().flipNext()} disabled={currentPage >= totalPages - 1} className="ttrpg-nav-btn"><span className="ttrpg-next-text">NEXT</span> ►</button>
            </div>
        </div>
    );
};

export default ImmersiveTtrpgReader;