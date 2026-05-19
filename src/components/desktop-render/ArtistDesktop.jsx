// Components Import
import React, { useState } from 'react';
import { artProjects } from '../../data/projects';
import FilmStrip from '../../components/FilmStrip.jsx';
import SocialBar from '../shared/SocialBar.jsx';
import '../../styles/artist-desktop.css';
import emailjs from '@emailjs/browser';

// Asset Imports
import artistname from '../../assets/shared/Reystarrie.png';
import digitalIcon from '../../assets/shared/laptop.png';
import traditionalIcon from '../../assets/shared/draw.png';
import writtenIcon from '../../assets/shared/notepad.png';
import artistCharacter from '../../assets/shared/ArtistModel.png'; 
import linkedinIcon from '../../assets/shared/linkedin-icon.png';
import gmailIcon from '../../assets/shared/gmail-icon.png';
// import resumeQR from '../../assets/shared/resume-qr.png';

const ArtistDesktop = () => {
  emailjs.init("i3eNdHriCFdmyPQbS");

  // Modal toggle state controls
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  
  // Folder state control: Tracks if 'digital', 'traditional', or 'written' explorer window is active
  const [activeFolder, setActiveFolder] = useState(null); 

  // Contact Form Input State Parameters
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [cloudLink, setCloudLink] = useState('');

  // Triggers the retro OS file explorer window pop-up
  const handleFolderClick = (category) => {
    setActiveFolder(category);
  };

  // Filter project arrays dynamically matching the active directory choice context
  const filteredProjects = artProjects.filter(project => project.category === activeFolder);

  const handleSendEmail = (e) => {
    e.preventDefault();
    
    // Clean data mapping without attachment overhead data streams
    const templateParams = {
      subject: emailSubject,
      message: emailMessage,
      cloudLink: cloudLink || "None provided",
    };

    const SERVICE_ID = "service_ayl3utp";
    const TEMPLATE_ID = "template_lm65jib"; 
    const PUBLIC_KEY = "i3eNdHriCFdmyPQbS"; 

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('✉ SYSTEM: Transmission successfully routed.');
        
        // Reset inputs back to default blank states
        setEmailSubject('');
        setEmailMessage('');
        setCloudLink('');
        setIsEmailOpen(false); 
      })
      .catch((error) => {
        console.error('FAILED...', error);
        alert('ERROR: Terminal link delivery failed. Verify dashboard API credentials.');
      });
  };

  return (
    <div className="artist-desktop-container">

      <div className="artist-intro-block">
        <div className="artist-name">
          <img src={artistname} alt="Reystarrie" />
        </div>
        <p className="artist-tagline">
          A self-taught artist that's always up to something,<br />
          always have ideas to creatively manifest the vision.
        </p>
      </div>

      <div className="desktop-icon-workspace">
        <h2 className="workspace-heading">Personal Projects</h2>
        <div className="desktop-icons-row">
          <button className="desktop-icon-btn" onClick={() => handleFolderClick('digital')} type="button">
            <div className="icon-frame"><img src={digitalIcon} alt="Digital works" className="icon-graphic" /></div>
            <span className="icon-label">Digital</span>
          </button>
          <button className="desktop-icon-btn" onClick={() => handleFolderClick('traditional')} type="button">
            <div className="icon-frame"><img src={traditionalIcon} alt="Traditional works" className="icon-graphic" /></div>
            <span className="icon-label">Traditional</span>
          </button>
          <button className="desktop-icon-btn" onClick={() => handleFolderClick('written')} type="button">
            <div className="icon-frame"><img src={writtenIcon} alt="Written works" className="icon-graphic" /></div>
            <span className="icon-label">Written</span>
          </button>
        </div>
      </div>

      <div className="artist-gallery">
        {artProjects.map((art) => (
          <div key={art.id} className="artist-gallery-card">
            <span className="artist-card-title">{art.title}</span>
          </div>
        ))}
      </div>

      <div className="artist-filmstrip-tilt">
        <div className="artist-footer-bar">
          <FilmStrip />
        </div>
      </div>

      <div className="artist-character-overlay">
        <img src={artistCharacter} alt="Character Illustration" className="character-img" draggable="false" />
      </div>

      <div className="professional-sidebar">
        <a href="https://www.linkedin.com/in/ReyesFME7/" target="_blank" rel="noopener noreferrer" className="pro-desktop-icon">
          <div className="pro-icon-frame">
            {typeof linkedinIcon !== 'undefined' ? <img src={linkedinIcon} alt="LinkedIn" className="icon-graphic" /> : <div className="pro-icon-fallback linkedin-block" />}
          </div>
          <span className="pro-icon-label">LinkedIn</span>
        </a>

        <button className="pro-desktop-icon gmail-btn-cell" onClick={() => setIsEmailOpen(true)} type="button">
          <div className="pro-icon-frame">
            {typeof gmailIcon !== 'undefined' ? <img src={gmailIcon} alt="Gmail" className="icon-graphic" /> : <div className="pro-icon-fallback gmail-block" />}
          </div>
          <span className="pro-icon-label">Gmail</span>
        </button>

        <button className="pro-desktop-icon resume-btn-cell" onClick={() => setIsResumeOpen(true)} type="button">
          <div className="pro-icon-frame qr-frame">
            {typeof resumeQR !== 'undefined' ? <img src={resumeQR} alt="Resume" className="icon-graphic qr-thumbnail-img" /> : <div className="pro-icon-fallback qr-block" />}
          </div>
          <span className="pro-icon-label">Resume</span>
        </button>
      </div>

      {isResumeOpen && (
        <div className="resume-modal-overlay" onClick={() => setIsResumeOpen(false)}>
          <div className="retro-window-box" onClick={(e) => e.stopPropagation()}>
            <div className="retro-window-header">
              <span className="window-title">resume_viewer.exe</span>
              <button type="button" className="window-close-btn" onClick={() => setIsResumeOpen(false)}>×</button>
            </div>
            <div className="retro-window-body">
              <div className="mock-resume-sheet">
                <div className="sheet-line header-line"></div>
                <div className="sheet-line description-line"></div>
                <div className="sheet-line section-line"></div>
              </div>
            </div>
            <div className="retro-window-footer">
              <a href="/resume.pdf" download="Fiona_Reyes_Resume.pdf" className="retro-action-btn download-action">Download File</a>
              <button type="button" className="retro-action-btn close-action" onClick={() => setIsResumeOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* GMAIL SYSTEM WINDOW */}
      {isEmailOpen && (
        <div className="resume-modal-overlay" onClick={() => setIsEmailOpen(false)}>
          <form className="retro-window-box" onClick={(e) => e.stopPropagation()} onSubmit={handleSendEmail}>
            
            <div className="retro-window-header">
              <span className="window-title">✉ gmail_sender.exe</span>
              <button type="button" className="window-close-btn" onClick={() => setIsEmailOpen(false)}>×</button>
            </div>

            <div className="retro-window-body email-window-padding">
              <div className="retro-email-form">
                
                <div className="email-form-row">
                  <label className="email-label-text">To:</label>
                  <input type="text" className="email-input-field static-to-field" value="technofiona607@gmail.com" disabled />
                </div>

                <div className="email-form-row">
                  <label className="email-label-text">Subject:</label>
                  <input 
                    type="text" 
                    className="email-input-field" 
                    placeholder="Project Inquiry / Job Opportunity"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                  />
                </div>

                {/* CLOUD LINK INPUT ROW (For Large Files) */}
                <div className="email-form-row cloud-link-row">
                  <label className="email-label-text">Cloud Link:</label>
                  <div className="input-with-note-wrapper">
                    <input 
                      type="url" 
                      className="email-input-field" 
                      placeholder="Paste Google Drive/Dropbox link here..."
                      value={cloudLink}
                      onChange={(e) => setCloudLink(e.target.value)}
                    />
                    <span className="field-disclaimer-note">
                      ⚠ Make sure to enable public sharing access permissions!
                    </span>
                  </div>
                </div>

                <div className="email-form-row message-textarea-row">
                  <textarea 
                    className="email-textarea-field" 
                    placeholder="Type your transmission details here..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    required
                  />
                </div>

              </div>
            </div>

            <div className="retro-window-footer">
              <button type="submit" className="retro-action-btn download-action">
                Send Mail
              </button>
              <button type="button" className="retro-action-btn close-action" onClick={() => setIsEmailOpen(false)}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* RETRO DYNAMIC EXPLORER WINDOW SYSTEM */}
      {activeFolder && (
        <div className="resume-modal-overlay" onClick={() => setActiveFolder(null)}>
          <div className="retro-window-box folder-explorer-box" onClick={(e) => e.stopPropagation()}>
            
            <div className="retro-window-header">
              <span className="window-title">🗁 file_explorer.exe - C:\Projects\{activeFolder}</span>
              <button type="button" className="window-close-btn" onClick={() => setActiveFolder(null)}>×</button>
            </div>

            <div className="retro-window-body explorer-body-grid">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div key={project.id} className="explorer-file-item">
                    <div className="file-icon-placeholder">🗎</div>
                    <span className="file-item-name">{project.title}</span>
                  </div>
                ))
              ) : (
                <div className="empty-directory-fallback">
                  <span className="empty-text">[ SYSTEM ALERT: Directory is currently unpopulated ]</span>
                </div>
              )}
            </div>

            <div className="retro-window-footer">
              <span className="system-file-count">
                {filteredProjects.length} object(s) detected in matrix cluster.
              </span>
              <button type="button" className="retro-action-btn close-action" onClick={() => setActiveFolder(null)}>
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

      <SocialBar />

    </div>
  );
};

export default ArtistDesktop;