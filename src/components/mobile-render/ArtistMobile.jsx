import React, { useState, useEffect } from 'react';
import { artProjects } from '../../data/projects';
import FilmStrip from '../../components/FilmStrip.jsx';
import SocialBar from '../shared/SocialBar.jsx';
import MultimediaViewer, { Lightbox } from '../shared/MultimediaViewer.jsx';
import '../../styles/artist-mobile.css';
import emailjs from '@emailjs/browser';

import artistName      from '../../assets/shared/Reystarrie.png';
import digitalIcon     from '../../assets/shared/laptop.png';
import traditionalIcon from '../../assets/shared/draw.png';
import writtenIcon     from '../../assets/shared/notepad.png';
import artistCharacter from '../../assets/shared/ArtistModel.png';
import ResumeViewer    from '../shared/ResumeViewer.jsx';
import linkedinIcon    from '../../assets/shared/linkedin-icon.png';
import gmailIcon       from '../../assets/shared/gmail-icon.png';

const ART_FOLDER_CATEGORIES = [
  { id: 'digital',     label: 'Digital',     icon: digitalIcon,     dataKey: 'digital'     },
  { id: 'traditional', label: 'Traditional', icon: traditionalIcon, dataKey: 'traditional' },
  { id: 'written',     label: 'Written',     icon: writtenIcon,     dataKey: 'written'     },
];

const ArtistMobile = ({ personaToggle }) => {

  const EMAILJS_CONFIG = {
    serviceId:  'service_ayl3utp',
    templateId: 'template_lm65jib',
    publicKey:  'i3eNdHriCFdmyPQbS',
  };
  emailjs.init(EMAILJS_CONFIG.publicKey);

  const [showMoreInfo,  setShowMoreInfo]  = useState(false);
  const [activeFolder,  setActiveFolder]  = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen]   = useState(false);

  const [isEmailOpen,   setIsEmailOpen]   = useState(false);
  const [emailSubject,  setEmailSubject]  = useState('');
  const [emailMessage,  setEmailMessage]  = useState('');
  const [cloudLink,     setCloudLink]     = useState('');

  const [mobileLightbox, setMobileLightbox] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const folderParam = params.get('folder');
    const fileParam = params.get('file');

    if (folderParam) {
      const foundFolder = ART_FOLDER_CATEGORIES.find(f => f.id === folderParam);
      
      if (foundFolder) {
        setActiveFolder(foundFolder);

        if (fileParam) {
          const foundProject = artProjects.find(p => p.id === fileParam);
          
          if (foundProject && foundProject.category === foundFolder.dataKey) {
            setActiveProject(foundProject);
          }
        }
      }
    }
  }, []);

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

  const filteredProjects = activeFolder
    ? artProjects.filter(p => p.category === activeFolder.dataKey)
    : [];

  const handleCloseFolder    = () => { setActiveFolder(null); setActiveProject(null); };
  const handleBackToExplorer = () => { setActiveProject(null); };

  return (
    <div className="am-container">

      <header className="am-header">
        <div className="am-name-block">
          <img src={artistName} alt="Reystarrie" className="am-name-img" draggable="false" />
        </div>

        <div className="am-persona-row">
          {personaToggle}
        </div>

        <p className="am-info-tagline">
          A self-taught artist that's always up to something,
          always have ideas to creatively manifest the vision.
        </p>
        
        <button
          className="am-show-more-btn"
          type="button"
          onClick={() => setShowMoreInfo(v => !v)}
        >
          {showMoreInfo ? '∧ hide information' : 'v show more information'}
        </button>

        {showMoreInfo && (
          <div className="am-info-panel">
            <div className="am-info-links">
                <a href="https://www.linkedin.com/in/reyesfme7/" target="_blank" rel="noopener noreferrer" className="am-info-link-btn">
                  <img src={linkedinIcon} alt="LinkedIn" className="am-info-link-icon" />
                  <span>LinkedIn</span>
                </a>
                <button 
                  type="button" 
                  className="itm-info-link-btn" 
                  onClick={() => setIsEmailOpen(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <img src={gmailIcon} alt="Gmail" className="itm-info-link-icon" />
                  <span>Gmail</span>
                </button>
                <button 
                  type="button" 
                  className="itm-info-link-btn" 
                  onClick={() => setIsResumeOpen(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <div className="itm-info-link-icon itm-info-link-icon--qr" aria-hidden="true" />
                  <span>Resume</span>
                </button>
              </div>
          </div>
        )}
      </header>

      <main className="am-main">
        <h2 className="am-section-heading">Personal Projects</h2>

        <div className="am-folders-grid">
          <div className="am-folders-row">
            {ART_FOLDER_CATEGORIES.slice(0, 2).map(folder => (
              <button
                key={folder.id}
                className="am-folder-btn"
                type="button"
                onClick={() => { setActiveFolder(folder); setActiveProject(null); }}
              >
                <div className="am-folder-icon-wrap">
                  <img src={folder.icon} alt={folder.label} className="am-folder-img" />
                </div>
                <span className="am-folder-label">{folder.label}</span>
              </button>
            ))}
          </div>

          <div className="am-folders-row am-folders-row--offset">
            {ART_FOLDER_CATEGORIES.slice(2).map(folder => (
              <button
                key={folder.id}
                className="am-folder-btn"
                type="button"
                onClick={() => { setActiveFolder(folder); setActiveProject(null); }}
              >
                <div className="am-folder-icon-wrap">
                  <img src={folder.icon} alt={folder.label} className="am-folder-img" />
                </div>
                <span className="am-folder-label">{folder.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="am-footer">
        <div className="am-reel-stage">
          <div className="am-character-overlay">
            <img
              src={artistCharacter}
              alt="Character Illustration"
              className="am-character-img"
              draggable="false"
            />
          </div>

          <div className="am-filmstrip-wrap">
            <FilmStrip />
          </div>
        </div>

        <SocialBar />
      </footer>

      {activeFolder && (
        <div className="am-overlay">
          {!activeProject && (
            <div className="am-window am-fullscreen-window">
              <div className="am-window-header">
                <span className="am-window-title">🗁 Art\{activeFolder.label}</span>
                <button type="button" className="am-window-close-btn" onClick={handleCloseFolder}>✕</button>
              </div>
              <div className="am-explorer-body">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <button
                      key={project.id}
                      className="am-explorer-file"
                      type="button"
                      onClick={() => setActiveProject(project)}
                    >
                      <div className="am-file-icon">🗎</div>
                      <span className="am-file-name">{project.title}</span>
                    </button>
                  ))
                ) : (
                  <div className="am-empty-dir">[ SYSTEM ALERT: Directory is currently unpopulated ]</div>
                )}
              </div>
              <div className="am-window-footer">
                <span className="am-file-count">{filteredProjects.length} object(s) detected.</span>
                <button type="button" className="am-btn am-btn--muted" onClick={handleCloseFolder}>Close Directory</button>
              </div>
            </div>
          )}

          {activeProject && (
            <div className="am-window am-fullscreen-window">
              <div className="am-window-header">
                <span className="am-window-title">🗁 {activeProject.title}</span>
                <button type="button" className="am-window-close-btn" onClick={handleCloseFolder}>✕</button>
              </div>
              <div className="am-detail-body">
                <MultimediaViewer
                  project={activeProject}
                  onMobileLightboxOpen={(src, alt) => setMobileLightbox({ src, alt })}
                />
              </div>
              <div className="am-window-footer">
                <button type="button" className="am-btn am-btn--muted" onClick={handleBackToExplorer}>← Back to files</button>
                <button type="button" className="am-btn am-btn--muted" onClick={handleCloseFolder}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}

      {isResumeOpen && (
        <div className="itm-overlay">
          <div className="itm-window itm-fullscreen-window">
            <div className="itm-window-header">
              <span className="itm-window-title">🗎 resume_viewer.exe</span>
              <button 
                type="button" 
                className="itm-window-close-btn" 
                onClick={() => setIsResumeOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="itm-detail-body">
              <ResumeViewer bare={true} /> 
            </div>

            <div className="itm-window-footer">
              <a 
                href="/Reyes-Resume.pdf" 
                download="Reyes-Resume.pdf" 
                className="itm-btn"
              >
                Download File
              </a>
              <button 
                type="button" 
                className="itm-btn itm-btn--muted" 
                onClick={() => setIsResumeOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEmailOpen && (
        <div className="itm-overlay">
          <form className="itm-window itm-fullscreen-window" onSubmit={handleSendEmail}>
            
            <div className="itm-window-header">
              <span className="itm-window-title">✉ gmail_sender.exe</span>
              <button 
                type="button" 
                className="itm-window-close-btn" 
                onClick={() => setIsEmailOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="itm-detail-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' }}>To:</label>
                <input type="text" value="technofiona607@gmail.com" disabled style={{ padding: '10px', background: '#222', border: '1px solid #444', color: '#888', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' }}>Subject:</label>
                <input type="text" placeholder="Project Inquiry / Job Opportunity" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} required style={{ padding: '10px', background: '#111', border: '1px solid #555', color: '#fff', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' }}>Cloud Link:</label>
                <input type="url" placeholder="Paste Google Drive / Dropbox link here..." value={cloudLink} onChange={e => setCloudLink(e.target.value)} style={{ padding: '10px', background: '#111', border: '1px solid #555', color: '#fff', borderRadius: '4px' }} />
                <span style={{ color: '#888', fontSize: '0.7rem', fontStyle: 'italic' }}>⚠ Make sure to enable public sharing access permissions!</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <label style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' }}>Message:</label>
                <textarea placeholder="Type your transmission details here..." value={emailMessage} onChange={e => setEmailMessage(e.target.value)} required style={{ padding: '10px', background: '#111', border: '1px solid #555', color: '#fff', minHeight: '150px', resize: 'none', borderRadius: '4px' }} />
              </div>

            </div>

            <div className="itm-window-footer">
              <button type="submit" className="itm-btn itm-btn--muted" style={{ background: '#333', color: '#fff', borderColor: '#666' }}>
                Send Mail
              </button>
              <button type="button" className="itm-btn itm-btn--muted" onClick={() => setIsEmailOpen(false)}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {mobileLightbox && (
        <Lightbox
          src={mobileLightbox.src}
          alt={mobileLightbox.alt}
          onClose={() => setMobileLightbox(null)}
          mobileMode={true}
        />
      )}
      
    </div>
  );
};

export default ArtistMobile;