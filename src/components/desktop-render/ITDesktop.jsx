import React, { useState } from 'react';
import { itProjects } from '../../data/projects';
import SocialBar from '../shared/SocialBar.jsx';
import PersonaToggle from '../shared/PersonaToggle.jsx';
import '../../styles/it-desktop.css';
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
import psIcon      from '../../assets/shared/PS.png';
import clientIcon  from '../../assets/shared/design.png';

import linkedinIcon from '../../assets/shared/linkedin-icon.png';
import igIcon       from '../../assets/shared/ig icon.png';
import gmailIcon    from '../../assets/shared/gmail-icon.png';

const TECH_SKILLS = [
  { id: 'react',   label: 'React',                 icon: reactIcon   },
  { id: 'python',  label: 'Python',                icon: pythonIcon  },
  { id: 'js',      label: 'JavaScript',            icon: jsIcon      },
  { id: 'sysarch', label: 'System Architecture',   icon: sysArchIcon },
];

const FOLDER_CATEGORIES = [
  { id: 'coding', label: 'Coding Projects',       icon: codingIcon, dataKey: 'Coding Projects'      },
  { id: 'illust', label: 'Illustrations',         icon: illustIcon, dataKey: 'Illustrations'         },
  { id: 'sysdoc', label: 'System Documentations', icon: sysDocIcon, dataKey: 'System Documentation' },
  { id: 'ps',     label: 'Photoshop Works',       icon: psIcon,     dataKey: 'Photoshop Works'       },
  { id: 'client', label: 'Client-based Works',    icon: clientIcon, dataKey: 'Client-based Works'    },
];

const ITDesktop = ({ togglePersona }) => {
  emailjs.init('i3eNdHriCFdmyPQbS');

  const [activeFolder,  setActiveFolder]  = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isResumeOpen,  setIsResumeOpen]  = useState(false);
  const [isEmailOpen,   setIsEmailOpen]   = useState(false);
  const [showMoreInfo,  setShowMoreInfo]  = useState(false);

  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [cloudLink,    setCloudLink]    = useState('');

  const filteredProjects = activeFolder
    ? itProjects.filter(p => p.category === activeFolder.dataKey)
    : [];

  const handleSendEmail = (e) => {
    e.preventDefault();
    const templateParams = {
      subject:   emailSubject,
      message:   emailMessage,
      cloudLink: cloudLink || 'None provided',
    };
    emailjs.send('service_ayl3utp', 'template_lm65jib', templateParams, 'i3eNdHriCFdmyPQbS')
      .then(() => {
        alert('✉ SYSTEM: Transmission successfully routed.');
        setEmailSubject(''); setEmailMessage(''); setCloudLink('');
        setIsEmailOpen(false);
      })
      .catch(() => alert('ERROR: Terminal link delivery failed.'));
  };

  return (
    <div className="itd-container">

      {/* LEFT SIDEBAR COLUMN*/}
      <aside className="itd-left-column">

        <div className="itd-skills-box-container">
          {/*<h3 className="itd-skills-container-title">Technical Skills</h3>*/}
          
          <div className="itd-skills-grid-wrapper">
            {TECH_SKILLS.map(skill => (
              <div key={skill.id} className="itd-skill-icon">
                <div className="itd-skill-circle">
                  <img src={skill.icon} alt={skill.label} className="itd-skill-img" />
                </div>
                <span className="itd-skill-label">{skill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN CENTER AREA
      ══════════════════════════════════════════ */}
      <main className="itd-main">

        {/* ── Name Branding Block: [fiona] [PersonaToggle Element] [Reyes] ── */}
        <div className="itd-name-block">
          <img src={professionalFirstName} alt="Fiona" className="itd-name-first" draggable="false" />
          <PersonaToggle currentPersona="it" togglePersona={togglePersona} isInline={true} />
          <img src={professionalLastName}  alt="Reyes" className="itd-name-last"  draggable="false" />
        </div>

        {/* ── Tagline ── */}
        <p className="itd-tagline">
          3rd year IT Student in Pamantasan ng Lungsod ng Valenzuela.<br />
          Currently seeking a company I can render my OJT hours to.
        </p>

        {/* ── Show more info toggle ── */}
        <button
          className="itd-show-more"
          type="button"
          onClick={() => setShowMoreInfo(v => !v)}
        >
          {showMoreInfo ? '∧ Hide Information' : 'v Show More Information'}
        </button>

        {/* ── Expandable more info panel ── */}
        {showMoreInfo && (
          <div className="itd-more-info-panel">
            <p>📍 Valenzuela City, Philippines</p>
            <p>🎓 Bachelor of Science in Information Technology</p>
            <p>📅 Expected graduation: 2026</p>
          </div>
        )}

        {/* ── Section heading ── */}
        <h2 className="itd-section-heading">Professional / School Works</h2>

        {/* ── 5 Folder Icons — 2-row layout ── */}
        <div className="itd-folders-grid">
          <div className="itd-folders-row">
            {FOLDER_CATEGORIES.slice(0, 3).map(folder => (
              <button
                key={folder.id}
                className="itd-folder-btn"
                type="button"
                onClick={() => setActiveFolder(folder)}
              >
                <div className="itd-folder-icon-wrap">
                  <img src={folder.icon} alt={folder.label} className="itd-folder-img" />
                </div>
                <span className="itd-folder-label">{folder.label}</span>
              </button>
            ))}
          </div>
          <div className="itd-folders-row itd-folders-row--offset">
            {FOLDER_CATEGORIES.slice(3).map(folder => (
              <button
                key={folder.id}
                className="itd-folder-btn"
                type="button"
                onClick={() => setActiveFolder(folder)}
              >
                <div className="itd-folder-icon-wrap">
                  <img src={folder.icon} alt={folder.label} className="itd-folder-img" />
                </div>
                <span className="itd-folder-label">{folder.label}</span>
              </button>
            ))}
          </div>
        </div>

      </main>

      {/* ══════════════════════════════════════════
          RIGHT COLUMN — Social / Live Site / Resume
      ══════════════════════════════════════════ */}
      <aside className="itd-right-column">
        
        <a href="https://www.linkedin.com/in/ReyesFME7/" target="_blank" rel="noopener noreferrer" className="itd-right-icon-btn">
          <div className="itd-right-icon-frame">
            <img src={linkedinIcon} alt="LinkedIn" className="itd-right-icon-img" />
          </div>
          <span className="itd-right-label-pill">LinkedIn</span>
        </a>

        <button className="itd-right-icon-btn" type="button" onClick={() => setIsEmailOpen(true)}>
          <div className="itd-right-icon-frame">
            <img src={gmailIcon} alt="Gmail" className="itd-right-icon-img" />
          </div>
          <span className="itd-right-label-pill">Gmail</span>
        </button>

        <button className="itd-right-icon-btn itd-resume-frame" type="button" onClick={() => setIsResumeOpen(true)}>
          <div className="itd-right-icon-frame qr-frame">
            <div className="itd-qr-placeholder" />
          </div>
          <span className="itd-right-label-pill">Resume</span>
        </button>

      </aside>

      <div className="itd-bottom-bar">
        <SocialBar />
      </div>

      {activeFolder && (
        <div className="itd-modal-overlay" onClick={() => setActiveFolder(null)}>
          <div className="itd-retro-window itd-explorer-window" onClick={e => e.stopPropagation()}>
            <div className="itd-window-header">
              <span className="itd-window-title">🗁 file_explorer.exe — C:\Projects\{activeFolder.label}</span>
              <button type="button" className="itd-window-close" onClick={() => setActiveFolder(null)}>×</button>
            </div>
            <div className="itd-window-body itd-explorer-body">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <button key={project.id} className="itd-explorer-file" type="button"
                    onClick={() => { setActiveFolder(null); setActiveProject(project); }}>
                    <div className="itd-file-icon">🗎</div>
                    <span className="itd-file-name">{project.title}</span>
                  </button>
                ))
              ) : (
                <div className="itd-empty-dir">
                  [ SYSTEM ALERT: Directory is currently unpopulated ]
                </div>
              )}
            </div>
            <div className="itd-window-footer">
              <span className="itd-file-count">{filteredProjects.length} object(s) detected.</span>
              <button type="button" className="itd-btn itd-btn--secondary" onClick={() => setActiveFolder(null)}>Close Directory</button>
            </div>
          </div>
        </div>
      )}

      {activeProject && (
        <div className="itd-modal-overlay" onClick={() => setActiveProject(null)}>
          <div className="itd-retro-window itd-project-window" onClick={e => e.stopPropagation()}>
            <div className="itd-window-header">
              <span className="itd-window-title">📄 {activeProject.title}</span>
              <button type="button" className="itd-window-close" onClick={() => setActiveProject(null)}>×</button>
            </div>
            <div className="itd-window-body itd-project-body">
              <div className="itd-project-preview">
                <img src={activeProject.previewImage} alt={activeProject.title} className="itd-preview-img" />
              </div>
              <div className="itd-project-info">
                <p className="itd-proj-category">{activeProject.category}</p>
                <h2 className="itd-proj-title">{activeProject.title}</h2>
                <p className="itd-proj-desc">{activeProject.description}</p>
                <div className="itd-tech-stack">
                  {activeProject.techStack.map(tech => (
                    <span key={tech} className="itd-tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="itd-project-links">
                  {activeProject.githubLink && (
                    <a href={activeProject.githubLink} target="_blank" rel="noopener noreferrer" className="itd-btn itd-btn--primary">GitHub →</a>
                  )}
                  {activeProject.demoLink && (
                    <a href={activeProject.demoLink} target="_blank" rel="noopener noreferrer" className="itd-btn itd-btn--secondary">Live Demo →</a>
                  )}
                </div>
              </div>
            </div>
            <div className="itd-window-footer">
              <button type="button" className="itd-btn itd-btn--secondary" onClick={() => setActiveProject(null)}>Close Window</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ITDesktop;