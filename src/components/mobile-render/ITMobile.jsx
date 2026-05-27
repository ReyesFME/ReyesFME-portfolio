import React, { useState } from 'react';
import { itProjects } from '../../data/projects';
import SocialBar from '../shared/SocialBar.jsx';
import PersonaToggle from '../shared/PersonaToggle.jsx';
import '../../styles/it-mobile.css';
import emailjs from '@emailjs/browser';

import professionalFirstName from '../../assets/shared/Fiona-tag.png';
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

// --- CUSTOM INTERACTIVE VIEWERS ---
import CPUSchedulerApp        from '../shared/CPU_Scheduling/CPUScheduler.jsx';
import TtrpgBookReader        from '../TTRPG/TtrpgBookReader.jsx';
import StevenUniverseApp      from '../shared/steven_universe/SU_winforms_native_react.jsx';
import TkinterInventoryApp    from '../shared/inventory_management/TkinterInventory.jsx';
import MockReportGeneratorApp from '../shared/Mock_Data_Generator/MockDataGenerator.jsx';
import WaveDocViewer          from '../shared/WaveDocViewer.jsx';
import DfdViewer              from '../shared/DfdViewer.jsx';
import MultimediaViewer       from '../shared/MultimediaViewer.jsx';
import CardDeckViewer         from '../shared/GameDevCards/CardDeckViewer.jsx';
import ResumeViewer           from '../shared/ResumeViewer.jsx';

const TECH_SKILLS = [
  { id: 'react',   label: 'React',      icon: reactIcon   },
  { id: 'python',  label: 'Python',     icon: pythonIcon  },
  { id: 'js',      label: 'JavaScript', icon: jsIcon      },
  { id: 'sysarch', label: 'UML',        icon: sysArchIcon },
];

const FOLDER_CATEGORIES = [
  { id: 'coding', label: 'Coding Projects',       icon: codingIcon, dataKey: 'Coding Projects'         },
  { id: 'illust', label: 'Illustrations',          icon: illustIcon, dataKey: 'Illustrations'           },
  { id: 'sysdoc', label: 'System Documentations', icon: sysDocIcon, dataKey: 'System Documentation'    },
  { id: 'mm',     label: 'Multimedia',             icon: mmIcon,     dataKey: 'Multimedia Works'         },
  { id: 'game',   label: 'GameDev Assets',         icon: gameIcon,   dataKey: 'Game Development Assets' },
];

const resolveViewer = (project) => {
  if (!project.isCustomViewer) return null;
  switch (project.customComponent) {
    case 'CPUSchedulerApp':        return <CPUSchedulerApp />;
    case 'MockReportGeneratorApp': return <MockReportGeneratorApp />;
    case 'StevenUniverseApp':      return <StevenUniverseApp />;
    case 'TkinterInventoryApp':    return <TkinterInventoryApp />;
    case 'WaveDocViewerApp':       return <WaveDocViewer />;
    case 'DfdImageViewerApp':      return <DfdViewer />;
    case 'MultimediaViewerApp':    return <MultimediaViewer project={project} />;
    case 'CardDeckViewerApp':      return <CardDeckViewer project={project} />;
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
  const [isResumeOpen, setIsResumeOpen]   = useState(false);

  const [isEmailOpen,   setIsEmailOpen]   = useState(false);
  const [emailSubject,  setEmailSubject]  = useState('');
  const [emailMessage,  setEmailMessage]  = useState('');
  const [cloudLink,     setCloudLink]     = useState('');

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

  return (
    <div className="itm-container">

      {/* ── HEADER ───────────────────────────────────────── */}
      <header className="itm-header">
        <div className="itm-name-block">
          <img src={professionalFirstName} alt="Fiona" className="itm-name-img" draggable="false" />
          <PersonaToggle currentPersona="it" togglePersona={togglePersona} isInline={true} />
          <img src={professionalLastName}  alt="Reyes" className="itm-name-img" draggable="false" />
          
        </div>

        <p className="itm-info-tagline">
          3rd year IT Student in Pamantasan ng Lungsod ng Valenzuela.
          Currently seeking a company I can render my OJT hours to.
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
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="itm-info-link-btn">
                <div className="itm-info-link-icon itm-info-link-icon--placeholder" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
              <button 
                type="button" 
                className="itm-info-link-btn" 
                onClick={() => setIsEmailOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div className="itm-info-link-icon itm-info-link-icon--placeholder" aria-hidden="true" />
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

      {/* ── MAIN ─────────────────────────────────────────── */}
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

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="itm-footer">
                <SocialBar />

      </footer>

      {/* ── OVERLAY ──────────────────────────────────────── */}
      {activeFolder && (
        <div className="itm-overlay">

          {/* STATE A: explorer — no project selected yet */}
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

          {/* STATE B: detail — full-screen, explorer hidden */}
          {activeProject && (
            <div className="itm-window itm-fullscreen-window">
              <div className="itm-window-header">
                <span className="itm-window-title">🗁 {activeProject.title}</span>
                <button type="button" className="itm-window-close-btn" onClick={handleCloseFolder}>✕</button>
              </div>

              <div className="itm-detail-body">
                {activeProject.isCustomViewer ? (
                  resolveViewer(activeProject)
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

      {/* ── RESUME OVERLAY ──────────────────────────────────────── */}
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
              {/* bare={true} strips the desktop titlebar since we built a mobile one above */}
              <ResumeViewer bare={true} /> 
            </div>

            <div className="itm-window-footer">
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

      {/* ── GMAIL OVERLAY ──────────────────────────────────────── */}
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

    </div>
  );
};

export default ITMobile;