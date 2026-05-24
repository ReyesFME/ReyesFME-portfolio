import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../../styles/professional-sidebar.css';

import linkedinIcon from '../../assets/shared/linkedin-icon.png';
import gmailIcon    from '../../assets/shared/gmail-icon.png';
// import resumeQR  from '../../assets/shared/resume-qr.png';

emailjs.init('i3eNdHriCFdmyPQbS');

const EMAILJS_CONFIG = {
  serviceId:  'service_ayl3utp',
  templateId: 'template_lm65jib',
  publicKey:  'i3eNdHriCFdmyPQbS',
};

// ── Sidebar icon class maps───────────────────────────
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
};

const ProfessionalSidebar = ({ variant = 'artist' }) => {
  const s = STYLES[variant];

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isEmailOpen,  setIsEmailOpen]  = useState(false);
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

        <button className={`${s.iconBtn} resume-btn-cell`} type="button" onClick={() => setIsResumeOpen(true)}>
          <div className={s.qrFrame}>
            {typeof resumeQR !== 'undefined'
              ? <img src={resumeQR} alt="Resume" className={s.qrImg} />
              : <div className={s.qrFallback} />}
          </div>
          <span className={s.iconLabel}>Resume</span>
        </button>
      </aside>

      {/* ── Resume Modal ── */}
      {isResumeOpen && (
        <div className="psb-overlay" onClick={() => setIsResumeOpen(false)}>
          <div className="psb-window" onClick={e => e.stopPropagation()}>

            <div className="psb-header">
              <span className="psb-title">📄 resume_viewer.exe</span>
              <button type="button" className="psb-close-btn" onClick={() => setIsResumeOpen(false)}>✕</button>
            </div>

            <div className="psb-body">
              <div className="psb-sheet">
                <div className="psb-sheet-line psb-sheet-line--header" />
                <div className="psb-sheet-line psb-sheet-line--full" />
                <div className="psb-sheet-line psb-sheet-line--mid" />
                <div className="psb-sheet-line psb-sheet-line--short psb-sheet-line--spacer" />
                <div className="psb-sheet-line psb-sheet-line--full" />
                <div className="psb-sheet-line psb-sheet-line--mid" />
                <div className="psb-sheet-line psb-sheet-line--short-alt" />
              </div>
            </div>

            <div className="psb-footer">
              <span className="psb-file-count">1 file(s) ready for download.</span>
              <a href="/resume.pdf" download="Fiona_Reyes_Resume.pdf" className="psb-btn">Download File</a>
              <button type="button" className="psb-btn psb-btn--muted" onClick={() => setIsResumeOpen(false)}>Cancel</button>
            </div>

          </div>
        </div>
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