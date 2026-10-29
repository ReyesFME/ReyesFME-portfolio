import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../../styles/professional-sidebar.css';

import ResumeViewer from './ResumeViewer';

import linkedinIcon from '../../assets/shared/linkedin-icon.png';
import gmailIcon    from '../../assets/shared/gmail-icon.png';
// import resumeQR  from '../../assets/shared/resume-qr.png';

emailjs.init('i3eNdHriCFdmyPQbS');

const EMAILJS_CONFIG = {
  serviceId:  'service_ayl3utp',
  templateId: 'template_lm65jib',
  publicKey:  'i3eNdHriCFdmyPQbS',
};

// Drawer resume: the width (px) the resume is laid out at before it is scaled to fit the drawer.
// 816 = US Letter at 96dpi. Smaller = bigger text in the drawer, larger = smaller text.
const RESUME_PAGE_W = 816;

// ── Sidebar icon class maps ───────────────────────────
const STYLES = {
  artist: {
    sidebar:          'professional-sidebar',
    iconBtn:          'pro-desktop-icon',
    iconFrame:        'pro-icon-frame',
    iconImg:          'icon-graphic',
    iconLabel:        'pro-icon-label',
    qrFrame:          'pro-icon-frame qr-frame',
    qrImg:            'icon-graphic qr-thumbnail-img',
    qrFallback:       'pro-icon-fallback qr-block',
    linkedinFallback: 'pro-icon-fallback linkedin-block',
    gmailFallback:    'pro-icon-fallback gmail-block',
  },
  it: {
    sidebar:          'itd-right-column',
    iconBtn:          'itd-right-icon-btn',
    iconFrame:        'itd-right-icon-frame',
    iconImg:          'itd-right-icon-img',
    iconLabel:        'itd-right-label-pill',
    qrFrame:          'itd-right-icon-frame qr-frame',
    qrImg:            'itd-right-icon-img',
    qrFallback:       'itd-qr-placeholder',
    linkedinFallback: null,
    gmailFallback:    null,
  },
  // IT desktop top navbar (buttons in a row)
  itnav: {
    sidebar:          'itd-nav-actions',
    iconBtn:          'itd-nav-btn',
    iconFrame:        'itd-nav-icon-frame',
    iconImg:          'itd-nav-icon-img',
    iconLabel:        'itd-nav-label',
    qrFrame:          'itd-nav-icon-frame',
    qrImg:            'itd-nav-icon-img',
    qrFallback:       'itd-nav-qr',
    linkedinFallback: null,
    gmailFallback:    null,
  },
};

const ProfessionalSidebar = ({ variant = 'artist' }) => {
  const s = STYLES[variant];
  const useDrawer = variant === 'itnav';   // desktop IT page: resume opens as a side drawer

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isEmailOpen,  setIsEmailOpen]  = useState(false);

  // Zoom state for the resume viewer
  const [resumeZoom, setResumeZoom] = useState(1);

  // Drawer only: keep the resume mounted after first open, and fit it to the drawer width
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const [fitScale, setFitScale] = useState(1);
  const [natural, setNatural] = useState({ w: RESUME_PAGE_W, h: 0 });
  const drawerBodyRef = useRef(null);
  const resumeInnerRef = useRef(null);

  useEffect(() => {
    if (!useDrawer || !isResumeOpen) return undefined;
    const body = drawerBodyRef.current;
    const inner = resumeInnerRef.current;
    if (!body || !inner || typeof ResizeObserver === 'undefined') return undefined;

    const measure = () => {
      // scrollWidth/scrollHeight also count content that spills past the fixed page width,
      // so the scale always fits whatever the resume actually draws.
      const w = Math.max(inner.offsetWidth,  inner.scrollWidth);
      const h = Math.max(inner.offsetHeight, inner.scrollHeight);
      if (w > 0) {
        setNatural({ w, h });
        setFitScale(Math.min(1, (body.clientWidth - 24) / w));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [useDrawer, isResumeOpen]);

  // Esc closes the drawer
  useEffect(() => {
    if (!useDrawer || !isResumeOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setIsResumeOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [useDrawer, isResumeOpen]);

  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [cloudLink,    setCloudLink]    = useState('');

  const handleSendEmail = (e) => {
    e.preventDefault();
    emailjs
      .send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        { subject: emailSubject, message: emailMessage, cloudLink: cloudLink || 'None provided' },
        EMAILJS_CONFIG.publicKey,
      )
      .then(() => {
        alert('✉ SYSTEM: Transmission successfully routed.');
        setEmailSubject('');
        setEmailMessage('');
        setCloudLink('');
        setIsEmailOpen(false);
      })
      .catch(() => alert('ERROR: Terminal link delivery failed. Verify dashboard API credentials.'));
  };

  return (
    <>
      {/* ── Sidebar Icons ── */}
      <aside className={s.sidebar}>
        <a href="https://www.linkedin.com/in/ReyesFME7/" target="_blank" rel="noopener noreferrer" className={s.iconBtn}>
          <div className={s.iconFrame}>
            {linkedinIcon
              ? <img src={linkedinIcon} alt="LinkedIn" className={s.iconImg} />
              : s.linkedinFallback && <div className={s.linkedinFallback} />}
          </div>
          <span className={s.iconLabel}>LinkedIn</span>
        </a>

        <button className={s.iconBtn} type="button" onClick={() => setIsEmailOpen(true)}>
          <div className={s.iconFrame}>
            {gmailIcon
              ? <img src={gmailIcon} alt="Gmail" className={s.iconImg} />
              : s.gmailFallback && <div className={s.gmailFallback} />}
          </div>
          <span className={s.iconLabel}>Gmail</span>
        </button>

        <button className={`${s.iconBtn} resume-btn-cell`} type="button" onClick={() => {
          setResumeZoom(1); // Reset zoom to 100% every time it is opened
          if (useDrawer) {
            setResumeLoaded(true);
            setIsResumeOpen(open => !open);   // the nav button toggles the drawer
            return;
          }
          setIsResumeOpen(true);
        }}>
          <div className={s.qrFrame}>
            {typeof resumeQR !== 'undefined'
              ? <img src={resumeQR} alt="Resume" className={s.qrImg} />
              : <div className={s.qrFallback} />}
          </div>
          <span className={s.iconLabel}>Resume</span>
        </button>
      </aside>

      {/* ── Resume Modal (all variants except the IT navbar) ── */}
      {isResumeOpen && !useDrawer && (
        <div className="psb-overlay" onClick={() => setIsResumeOpen(false)}>
          <div className="psb-window psb-window--resume" onClick={e => e.stopPropagation()}>

            <div className="psb-header">
              <span className="psb-title">&#9881; resume_viewer.exe</span>
              <button type="button" className="psb-close-btn" onClick={() => setIsResumeOpen(false)}>✕</button>
            </div>

            <div className="psb-body psb-body--resume-preview">
              {/* Dynamic Zoom Container */}
              <div style={{ zoom: resumeZoom, display: 'flex', justifyContent: 'center' }}>
                <ResumeViewer bare={true} />
              </div>
            </div>

            <div className="psb-footer">
              <span className="psb-file-count">1 file(s) ready for download.</span>

              {/* Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '16px' }}>
                <button
                  type="button"
                  className="psb-btn"
                  style={{ minWidth: '30px', padding: '3px 8px' }}
                  onClick={() => setResumeZoom(z => Math.max(0.5, z - 0.2))}
                >
                  -
                </button>
                <span style={{ color: '#000', fontFamily: 'Courier New', fontSize: '12px', fontWeight: 'bold', minWidth: '45px', textAlign: 'center' }}>
                  {Math.round(resumeZoom * 100)}%
                </span>
                <button
                  type="button"
                  className="psb-btn"
                  style={{ minWidth: '30px', padding: '3px 8px' }}
                  onClick={() => setResumeZoom(z => Math.min(2.5, z + 0.2))}
                >
                  +
                </button>
              </div>

              <a href="/Reyes-Resume.pdf" download="Reyes-Resume.pdf" className="psb-btn">Download File</a>
              <button type="button" className="psb-btn psb-btn--muted" onClick={() => setIsResumeOpen(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

      {/* ── Resume side drawer (IT navbar variant) ── */}
      {useDrawer && (
        <aside
          className={`itd-drawer${isResumeOpen ? ' itd-drawer--open' : ''}`}
          aria-hidden={!isResumeOpen}
          aria-label="Resume"
        >
          <div className="itd-drawer-header">
            <span className="itd-drawer-title">Resume</span>
            <div className="itd-drawer-actions">
              <button type="button" className="itd-drawer-btn" aria-label="Zoom out" onClick={() => setResumeZoom(z => Math.max(0.5, +(z - 0.2).toFixed(2)))}>-</button>
              <span className="itd-drawer-zoom">{Math.round(resumeZoom * 100)}%</span>
              <button type="button" className="itd-drawer-btn" aria-label="Zoom in" onClick={() => setResumeZoom(z => Math.min(2.5, +(z + 0.2).toFixed(2)))}>+</button>
              <a href="/Reyes-Resume.pdf" download="Reyes-Resume.pdf" className="itd-drawer-btn itd-drawer-download">Download</a>
              <button type="button" className="itd-drawer-btn itd-drawer-close" aria-label="Close resume" onClick={() => setIsResumeOpen(false)}>✕</button>
            </div>
          </div>

          <div className="itd-drawer-body" ref={drawerBodyRef}>
            {resumeLoaded && (
              <div className="itd-drawer-sheet" style={{ width: natural.w * fitScale * resumeZoom, height: natural.h * fitScale * resumeZoom }}>
                <div
                  ref={resumeInnerRef}
                  className="itd-drawer-sheet-inner"
                  style={{ width: RESUME_PAGE_W, transform: `scale(${fitScale * resumeZoom})` }}
                >
                  <ResumeViewer bare={true} />
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ── Gmail Modal ── */}
      {isEmailOpen && (
        <div className="psb-overlay" onClick={() => setIsEmailOpen(false)}>
          <form className="psb-window" onClick={e => e.stopPropagation()} onSubmit={handleSendEmail}>

            <div className="psb-header">
              <span className="psb-title">✉ gmail_sender.exe</span>
              <button type="button" className="psb-close-btn" onClick={() => setIsEmailOpen(false)}>✕</button>
            </div>

            <div className="psb-body">

              <div className="psb-form-row">
                <span className="psb-label">To:</span>
                <div className="psb-input-wrap">
                  <input type="text" className="psb-input psb-input--static" value="technofiona607@gmail.com" disabled />
                </div>
              </div>

              <div className="psb-form-row">
                <span className="psb-label">Subject:</span>
                <div className="psb-input-wrap">
                  <input type="text" className="psb-input" placeholder="Project Inquiry / Job Opportunity" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} required />
                </div>
              </div>

              <div className="psb-form-row">
                <span className="psb-label">Cloud Link:</span>
                <div className="psb-input-wrap">
                  <input type="url" className="psb-input" placeholder="Paste Google Drive / Dropbox link here..." value={cloudLink} onChange={e => setCloudLink(e.target.value)} />
                  <span className="psb-disclaimer">⚠ Make sure to enable public sharing access permissions!</span>
                </div>
              </div>

              <div className="psb-form-row">
                <span className="psb-label">Message:</span>
                <div className="psb-input-wrap">
                  <textarea className="psb-textarea" placeholder="Type your transmission details here..." value={emailMessage} onChange={e => setEmailMessage(e.target.value)} required />
                </div>
              </div>

            </div>

            <div className="psb-footer">
              <button type="submit" className="psb-btn">Send Mail</button>
              <button type="button" className="psb-btn psb-btn--muted" onClick={() => setIsEmailOpen(false)}>Cancel</button>
            </div>

          </form>
        </div>
      )}
    </>
  );
};

export default ProfessionalSidebar;