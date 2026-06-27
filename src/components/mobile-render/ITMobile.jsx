import React, { useState, useEffect } from 'react';
import { itProjects } from '../../data/projects';
import SocialBar from '../shared/SocialBar.jsx';
import PersonaToggle from '../shared/PersonaToggle.jsx';
import '../../styles/it-mobile.css';
import emailjs from '@emailjs/browser';

import professionalFirstName from '../../assets/shared/fiona-tag.png';
import professionalLastName  from '../../assets/shared/Reyes-tag.png';
import reactIcon   from '../../assets/shared/react.png';
import pythonIcon  from '../../assets/shared/python.png';
import jsIcon      from '../../assets/shared/javascript.png';
import sysArchIcon from '../../assets/shared/document.png';
import codingIcon  from '../../assets/shared/laptop.png';
import illustIcon  from '../../assets/shared/draw.png';
import sysDocIcon  from '../../assets/shared/document.png';
import mmIcon      from '../../assets/shared/floppy.png';
import gameIcon    from '../../assets/shared/game.png';
import linkedinIcon from '../../assets/shared/linkedin-icon.png';
import gmailIcon    from '../../assets/shared/gmail-icon.png';

import CPUSchedulerApp        from '../shared/CPU_Scheduling/CPUScheduler.jsx';
import TtrpgBookReader        from '../TTRPG/TtrpgBookReader.jsx';
import StevenUniverseApp      from '../shared/steven_universe/SU_winforms_native_react.jsx';
import TkinterInventoryApp    from '../shared/inventory_management/TkinterInventory.jsx';
import MockReportGeneratorApp from '../shared/Mock_Data_Generator/MockDataGenerator.jsx';
import WaveDocViewer          from '../shared/WaveDocViewer.jsx';
import DfdViewer              from '../shared/DfdViewer.jsx';
import MultimediaViewer, { Lightbox } from '../shared/MultimediaViewer.jsx';
import CardDeckViewer         from '../shared/GameDevCards/CardDeckViewer.jsx';
import ResumeViewer           from '../shared/ResumeViewer.jsx';
import CapstoneViewer         from '../shared/CapstoneViewer.jsx';

const TECH_SKILLS = [
  { id: 'react',   label: 'React',      icon: reactIcon   },
  { id: 'python',  label: 'Python',     icon: pythonIcon  },
  { id: 'js',      label: 'JavaScript', icon: jsIcon      },
  { id: 'sysarch', label: 'UML',        icon: sysArchIcon },
];

const FOLDER_CATEGORIES = [
  { id: 'coding', label: 'Coding Projects',       icon: codingIcon, dataKey: 'Coding Projects'         },
  { id: 'sysdoc', label: 'System Documentations', icon: sysDocIcon, dataKey: 'System Documentation'    },
  { id: 'mm',     label: 'Multimedia',             icon: mmIcon,     dataKey: 'Multimedia Works'         },
  { id: 'game',   label: 'GameDev Assets',         icon: gameIcon,   dataKey: 'Game Development Assets' },
];

const resolveViewer = (project, onMobileLightboxOpen) => {
  if (!project.isCustomViewer) return null;
  switch (project.customComponent) {
    case 'CPUSchedulerApp':        return <CPUSchedulerApp />;
    case 'MockReportGeneratorApp': return <MockReportGeneratorApp />;
    case 'StevenUniverseApp':      return <StevenUniverseApp />;
    case 'TkinterInventoryApp':    return <TkinterInventoryApp />;
    case 'WaveDocViewerApp':       return <WaveDocViewer />;
    case 'DfdImageViewerApp':      return <DfdViewer />;
    case 'MultimediaViewerApp':
      return (
        <MultimediaViewer
          project={project}
          onMobileLightboxOpen={onMobileLightboxOpen}
        />
      );
    case 'CardDeckViewerApp':      return <CardDeckViewer project={project} />;
    case 'CapstoneViewerApp':      return <CapstoneViewer />;
    default:                       return <TtrpgBookReader />;
  }
};

const ITMobile = ({ togglePersona }) => {

  const EMAILJS_CONFIG = {
    serviceId:  'service_ayl3utp',
    templateId: 'template_lm65jib',
    publicKey:  'i3eNdHriCFdmyPQbS',
  };
  emailjs.init(EMAILJS_CONFIG.publicKey);

  const [activeFolder,  setActiveFolder]  = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [showMoreInfo,  setShowMoreInfo]  = useState(false);
  const [isResumeOpen,  setIsResumeOpen]  = useState(false);

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
      const foundFolder = FOLDER_CATEGORIES.find(f => f.id === folderParam);
      
      if (foundFolder) {
        setActiveFolder(foundFolder); 

        if (fileParam) {
          const foundProject = itProjects.find(p => p.id === fileParam);
          
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
    ? itProjects.filter(p => p.category === activeFolder.dataKey)
    : [];

  const handleCloseFolder = () => {
    setActiveFolder(null);
    setActiveProject(null);
  };

  const handleBackToExplorer = () => {
    setActiveProject(null);
  };

  if (activeProject?.customComponent === 'TTRPGArchiveViewer') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0a0a0c',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          background: '#1a1a1a',
          borderBottom: '1px solid #2e2e2e',
          flexShrink: 0,
          zIndex: 100000,
        }}>
          <button
            type="button"
            onClick={handleBackToExplorer}
            style={{
              background: 'transparent',
              border: '1px solid #4e4e4e',
              color: '#c0c0c0',
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              padding: '4px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            ← BACK TO FILES
          </button>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.6rem',
            color: '#555',
            letterSpacing: '0.08em',
          }}>
            🗁 TTRPG Special Project
          </span>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <TtrpgBookReader />
        </div>
      </div>
    );
  }

  if (activeProject?.customComponent === 'CapstoneViewerApp') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          background: '#0f0f0f',
          borderBottom: '1px solid #2a2a2a',
          flexShrink: 0,
          zIndex: 100000,
        }}>
          <button
            type="button"
            onClick={handleBackToExplorer}
            style={{
              background: 'transparent',
              border: '1px solid #3d3d3d',
              color: '#d4d4d4',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            ← BACK TO FILES
          </button>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.6rem',
            color: '#555',
            letterSpacing: '0.08em',
          }}>
            🗁 {activeProject.title}
          </span>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <CapstoneViewer />
        </div>
      </div>
    );
  }

  return (
    <div className="itm-container">

      <header className="itm-header">
        <div className="itm-name-block">
          <img src={professionalFirstName} alt="Fiona" className="itm-name-img" draggable="false" />
          <PersonaToggle currentPersona="it" togglePersona={togglePersona} isInline={true} />
          <img src={professionalLastName}  alt="Reyes" className="itm-name-img" draggable="false" />
        </div>

        <p className="itm-info-tagline">
          Seeking an OJT opportunity to leverage strong project management, communication, and UI/UX design skills in a fast-paced environment. 
          Creative and detail-oriented 3rd-year IT student bridging the gap between technical system design and multimedia art. 
          Experienced in managing project pipelines, from initial data flow diagrams and concept art to final asset creation. 
        </p>

        <button
          className="itm-show-more-btn"
          type="button"
          onClick={() => setShowMoreInfo(v => !v)}
        >
          {showMoreInfo ? '∧ hide information' : 'v show more information'}
        </button>

        {showMoreInfo && (
          <div className="itm-info-panel">
            <div className="itm-info-links">
              <a href="https://www.linkedin.com/in/reyesfme7/" target="_blank" rel="noopener noreferrer" className="itm-info-link-btn">
                <img src={linkedinIcon} alt="LinkedIn" className="itm-info-link-icon" />
                <span>LinkedIn</span>
              </a>
              <button
                type="button"
                className="itm-info-link-btn"
                onClick={() => setIsEmailOpen(true)}
              >
                <img src={gmailIcon} alt="Gmail" className="itm-info-link-icon" />
                <span>Gmail</span>
              </button>
              <button
                type="button"
                className="itm-info-link-btn"
                onClick={() => setIsResumeOpen(true)}
              >
                <div className="itm-info-link-icon itm-info-link-icon--qr" aria-hidden="true" />
                <span>Resume</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="itm-main">
        <h2 className="itm-section-heading">Professional / School Works</h2>

        <div className="itm-folders-grid">
          <div className="itm-folders-row">
            {FOLDER_CATEGORIES.slice(0, 3).map(folder => (
              <button
                key={folder.id}
                className="itm-folder-btn"
                type="button"
                onClick={() => { setActiveFolder(folder); setActiveProject(null); }}
              >
                <div className="itm-folder-icon-wrap">
                  <img src={folder.icon} alt={folder.label} className="itm-folder-img" />
                </div>
                <span className="itm-folder-label">{folder.label}</span>
              </button>
            ))}
          </div>

          <div className="itm-folders-row itm-folders-row--offset">
            {FOLDER_CATEGORIES.slice(3).map(folder => (
              <button
                key={folder.id}
                className="itm-folder-btn"
                type="button"
                onClick={() => { setActiveFolder(folder); setActiveProject(null); }}
              >
                <div className="itm-folder-icon-wrap">
                  <img src={folder.icon} alt={folder.label} className="itm-folder-img" />
                </div>
                <span className="itm-folder-label">{folder.label}</span>
              </button>
            ))}
          </div>

          <div className="itm-skills-row">
            {TECH_SKILLS.map(skill => (
              <div key={skill.id} className="itm-skill-item">
                <div className="itm-skill-circle">
                  <img src={skill.icon} alt={skill.label} className="itm-skill-img" />
                </div>
                <span className="itm-skill-label">{skill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="itm-footer">
        <SocialBar />
      </footer>

      {activeFolder && (
        <div className="itm-overlay">

          {!activeProject && (
            <div className="itm-window itm-fullscreen-window">
              <div className="itm-window-header">
                <span className="itm-window-title">
                  🗁 C:\Projects\{activeFolder.label}
                </span>
                <button type="button" className="itm-window-close-btn" onClick={handleCloseFolder}>✕</button>
              </div>

              <div className="itm-explorer-body">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <button
                      key={project.id}
                      className="itm-explorer-file"
                      type="button"
                      onClick={() => setActiveProject(project)}
                    >
                      <div className="itm-file-icon">🗎</div>
                      <span className="itm-file-name">{project.title}</span>
                    </button>
                  ))
                ) : (
                  <div className="itm-empty-dir">
                    [ SYSTEM ALERT: Directory is currently unpopulated ]
                  </div>
                )}
              </div>

              <div className="itm-window-footer">
                <span className="itm-file-count">{filteredProjects.length} object(s) detected.</span>
                <button type="button" className="itm-btn itm-btn--muted" onClick={handleCloseFolder}>
                  Close Directory
                </button>
              </div>
            </div>
          )}

          {activeProject && activeProject.customComponent !== 'CapstoneViewerApp' && (
            <div className="itm-window itm-fullscreen-window">
              <div className="itm-window-header">
                <span className="itm-window-title">🗁 {activeProject.title}</span>
                <button type="button" className="itm-window-close-btn" onClick={handleCloseFolder}>✕</button>
              </div>

              <div className="itm-detail-body">
                {activeProject.isCustomViewer ? (
                  resolveViewer(activeProject, (src, alt) => setMobileLightbox({ src, alt }))
                ) : (
                  <>
                    <img
                      src={activeProject.previewImage}
                      alt={activeProject.title}
                      className="itm-detail-preview-img"
                    />
                    <div className="itm-detail-info">
                      <p className="itm-proj-category">{activeProject.category}</p>
                      <h2 className="itm-proj-title">{activeProject.title}</h2>
                      <p className="itm-proj-desc">{activeProject.description}</p>
                      <div className="itm-tech-stack">
                        {activeProject.techStack.map(tech => (
                          <span key={tech} className="itm-tech-tag">{tech}</span>
                        ))}
                      </div>
                      {activeProject.demoLink && (
                        <div className="itm-project-links">
                          <a
                            href={activeProject.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="itm-btn itm-btn--muted"
                          >
                            Live Demo →
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="itm-window-footer">
                <button type="button" className="itm-btn itm-btn--muted" onClick={handleBackToExplorer}>
                  ← Back to files
                </button>
                <button type="button" className="itm-btn itm-btn--muted" onClick={handleCloseFolder}>
                  Close
                </button>
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
          <form
            className="itm-window itm-fullscreen-window"
            onSubmit={handleSendEmail}
          >
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

            <div className="itm-detail-body">
              <div className="itm-email-body">

                <div className="itm-email-row">
                  <span className="itm-email-label">To:</span>
                  <input
                    type="text"
                    className="itm-email-input itm-input--static"
                    value="technofiona607@gmail.com"
                    disabled
                    readOnly
                  />
                </div>

                <div className="itm-email-row">
                  <span className="itm-email-label">Subject:</span>
                  <input
                    type="text"
                    className="itm-email-input"
                    placeholder="Project Inquiry / Job Opportunity"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="itm-email-row">
                  <span className="itm-email-label">Cloud Link:</span>
                  <div className="itm-input-stack">
                    <input
                      type="url"
                      className="itm-email-input"
                      placeholder="Paste Google Drive / Dropbox link here..."
                      value={cloudLink}
                      onChange={e => setCloudLink(e.target.value)}
                    />
                    <span className="itm-field-note">
                      ⚠ Make sure to enable public sharing access permissions!
                    </span>
                  </div>
                </div>

                <div className="itm-email-row itm-email-row--grow">
                  <span className="itm-email-label">Message:</span>
                  <textarea
                    className="itm-email-textarea"
                    placeholder="Type your transmission details here..."
                    value={emailMessage}
                    onChange={e => setEmailMessage(e.target.value)}
                    required
                  />
                </div>

              </div>
            </div>

            <div className="itm-window-footer">
              <button type="submit" className="itm-btn itm-btn--primary">
                Send Mail
              </button>
              <button
                type="button"
                className="itm-btn itm-btn--muted"
                onClick={() => setIsEmailOpen(false)}
              >
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

export default ITMobile;