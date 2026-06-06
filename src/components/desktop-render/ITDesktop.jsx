import React, { useState } from 'react';
import { itProjects } from '../../data/projects';
import SocialBar from '../shared/SocialBar.jsx';
import PersonaToggle from '../shared/PersonaToggle.jsx';
import ProfessionalSidebar from '../shared/ProfessionalSidebar.jsx';
import '../../styles/it-desktop.css';
import '../../styles/professional-sidebar.css';

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
import CapstoneViewer         from '../shared/CapstoneViewer.jsx';





const TECH_SKILLS = [
  { id: 'react',   label: 'React',               icon: reactIcon   },
  { id: 'python',  label: 'Python',              icon: pythonIcon  },
  { id: 'js',      label: 'JavaScript',          icon: jsIcon      },
  { id: 'sysarch', label: 'UML',                 icon: sysArchIcon },
];

const FOLDER_CATEGORIES = [
  { id: 'coding', label: 'Coding Projects',       icon: codingIcon, dataKey: 'Coding Projects'       },
  { id: 'sysdoc', label: 'System Documentations', icon: sysDocIcon, dataKey: 'System Documentation' },
  { id: 'mm',     label: 'Multimedia',            icon: mmIcon,     dataKey: 'Multimedia Works'       },
  { id: 'game',   label: 'GameDev Assets',        icon: gameIcon, dataKey: 'Game Development Assets'    },
];

const ITDesktop = ({ togglePersona }) => {
  const [activeFolder,  setActiveFolder]  = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [showMoreInfo,  setShowMoreInfo]  = useState(false);
  const [activeView, setActiveView] = useState('menu');

  const filteredProjects = activeFolder
    ? itProjects.filter(p => p.category === activeFolder.dataKey)
    : [];

  const handleCloseFolder = () => {
    setActiveFolder(null);
    setActiveProject(null);
  };

  const handleCloseProject = () => {
    setActiveProject(null);
  };

  return (
    <div className="itd-container">
      <aside className="itd-left-column">
        <div className="itd-skills-box-container">
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

      <main className="itd-main">
        <div className="itd-name-block">
          <img src={professionalFirstName} alt="Fiona" className="itd-name-first" draggable="false" />
          <PersonaToggle currentPersona="it" togglePersona={togglePersona} isInline={true} />
          <img src={professionalLastName}  alt="Reyes" className="itd-name-last"  draggable="false" />
        </div>

        <p className="itd-tagline">
          Creative, Critical, and Detail-Oriented  with technological education 
          and capabilities to yield meaningful results in a variety of media and discipline.
          3rd year IT Student in Pamantasan ng Lungsod ng Valenzuela.
          Currently seeking a company I can render my OJT hours to.
        </p>

        <button className="itd-show-more" type="button" onClick={() => setShowMoreInfo(v => !v)}>
          {showMoreInfo ? '∧ Hide Information' : 'v Show More Information'}
        </button>

        {showMoreInfo && (
          <div className="itd-more-info-panel">
            <p> Valenzuela City, Philippines</p>
            <p> Bachelor of Science in Information Technology</p>
            <p> Expected graduation: 2027</p>
          </div>
        )}

        <h2 className="itd-section-heading">Professional / School Works</h2>

        <div className="itd-folders-grid">
          <div className="itd-folders-row">
            {FOLDER_CATEGORIES.slice(0, 3).map(folder => (
              <button key={folder.id} className="itd-folder-btn" type="button"
                onClick={() => { setActiveFolder(folder); setActiveProject(null); }}>
                <div className="itd-folder-icon-wrap">
                  <img src={folder.icon} alt={folder.label} className="itd-folder-img" />
                </div>
                <span className="itd-folder-label">{folder.label}</span>
              </button>
            ))}
          </div>
          <div className="itd-folders-row itd-folders-row--offset">
            {FOLDER_CATEGORIES.slice(3).map(folder => (
              <button key={folder.id} className="itd-folder-btn" type="button"
                onClick={() => { setActiveFolder(folder); setActiveProject(null); }}>
                <div className="itd-folder-icon-wrap">
                  <img src={folder.icon} alt={folder.label} className="itd-folder-img" />
                </div>
                <span className="itd-folder-label">{folder.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <ProfessionalSidebar variant="it" />

      <div className="itd-bottom-bar">
        <SocialBar />
      </div>

      {activeFolder && (
        <div className="psb-overlay">
          <div className={`itd-split-panel${activeProject ? " itd-split-panel--detail-open" : ""}`}>
            <div className="psb-window itd-split-explorer">
              <div className="psb-header">
                <span className="psb-title">🗁 file_explorer.exe — C:\Projects\{activeFolder.label}</span>
                <button type="button" className="psb-close-btn" onClick={handleCloseFolder}>✕</button>
              </div>

              <div className="psb-body itd-explorer-body">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <button
                      key={project.id}
                      className={`itd-explorer-file${activeProject?.id === project.id ? ' itd-explorer-file--active' : ''}`}
                      type="button"
                      onClick={() => setActiveProject(project)}
                    >
                      <div className="itd-file-icon">🗎</div>
                      <span className="itd-file-name">{project.title}</span>
                    </button>
                  ))
                ) : (
                  <div className="itd-empty-dir">[ SYSTEM ALERT: Directory is currently unpopulated ]</div>
                )}
              </div>

              <div className="psb-footer">
                <span className="psb-file-count">{filteredProjects.length} object(s) detected.</span>
                <button type="button" className="psb-btn psb-btn--muted" onClick={handleCloseFolder}>Close Directory</button>
              </div>
            </div>

            <div className={`itd-split-detail${activeProject ? ' itd-split-detail--open' : ''}`}>
              <div className="psb-window" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {activeProject ? (
                  <>
                    <div className="psb-header">
                      <span className="psb-title">🗁 {activeProject.title}</span>
                      <button type="button" className="psb-close-btn" onClick={handleCloseProject}>✕</button>
                    </div>

                    <div className="psb-body itd-detail-body">
                      {activeProject.isCustomViewer ? (
                        activeProject.customComponent === "CPUSchedulerApp" ? <CPUSchedulerApp /> :
                        activeProject.customComponent === "MockReportGeneratorApp" ? <MockReportGeneratorApp /> :
                        activeProject.customComponent === "StevenUniverseApp" ? <StevenUniverseApp /> :
                        activeProject.customComponent === "TkinterInventoryApp" ? <TkinterInventoryApp /> :
                        activeProject.customComponent === "WaveDocViewerApp" ? <WaveDocViewer /> :
                        activeProject.customComponent === "DfdImageViewerApp" ? <DfdViewer />:
                        activeProject.customComponent === "MultimediaViewerApp" ? <MultimediaViewer project={activeProject} /> :
                        activeProject.customComponent === "CardDeckViewerApp" ? <CardDeckViewer project={activeProject} /> :
                        activeProject.customComponent === "CapstoneViewerApp" ? <CapstoneViewer /> :
                        <TtrpgBookReader />
                      ) : (
                        <>
                          <img src={activeProject.previewImage} alt={activeProject.title} className="itd-detail-preview-img" />
                          <div className="itd-detail-info">
                            <p className="itd-proj-category">{activeProject.category}</p>
                            <h2 className="itd-proj-title">{activeProject.title}</h2>
                            <p className="itd-proj-desc">{activeProject.description}</p>
                            <div className="itd-tech-stack">
                              {activeProject.techStack.map(tech => (
                                <span key={tech} className="itd-tech-tag">{tech}</span>
                              ))}
                            </div>
                            <div className="itd-project-links">
                              {activeProject.demoLink && (
                                <a href={activeProject.demoLink} target="_blank" rel="noopener noreferrer" className="psb-btn psb-btn--muted">Live Demo →</a>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="psb-footer">
                      <button type="button" className="psb-btn psb-btn--muted" onClick={handleCloseProject}>Close Preview</button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITDesktop;