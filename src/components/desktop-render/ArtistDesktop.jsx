import React, { useState } from 'react';
import { artProjects } from '../../data/projects';
import FilmStrip from '../../components/FilmStrip.jsx';
import SocialBar from '../shared/SocialBar.jsx';
import ProfessionalSidebar from '../shared/ProfessionalSidebar.jsx';
import MultimediaViewer from '../shared/MultimediaViewer.jsx';
import '../../styles/artist-desktop.css';
import '../../styles/professional-sidebar.css';

import artistname      from '../../assets/shared/Reystarrie.png';
import digitalIcon     from '../../assets/shared/laptop.png';
import traditionalIcon from '../../assets/shared/draw.png';
import writtenIcon     from '../../assets/shared/notepad.png';
import artistCharacter from '../../assets/shared/ArtistModel.png';

const ArtistDesktop = ({ personaToggle }) => {
  const [activeFolder, setActiveFolder]   = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  const filteredProjects = artProjects.filter(p => p.category === activeFolder);

  const handleCloseFolder = () => {
    setActiveFolder(null);
    setActiveProject(null);
  };

  const handleCloseProject = () => {
    setActiveProject(null);
  };

  return (
    <div className="artist-desktop-container">
      <div className="artist-intro-block">
        <div className="artist-name">
          {personaToggle}
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
          {[
            { key: 'digital',     icon: digitalIcon,     label: 'Digital'     },
            { key: 'traditional', icon: traditionalIcon, label: 'Traditional' },
            { key: 'written',     icon: writtenIcon,     label: 'Written'     },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              className="desktop-icon-btn"
              type="button"
              onClick={() => { setActiveFolder(key); setActiveProject(null); }}
            >
              <div className="icon-frame">
                <img src={icon} alt={label} className="icon-graphic" />
              </div>
              <span className="icon-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="artist-gallery">
        {artProjects.map(art => (
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

      <ProfessionalSidebar variant="artist" />

      {/* ── File Explorer Modal — XP chrome ── */}
      {activeFolder && (
        <div className="psb-overlay">
          <div className={`itd-split-panel${activeProject ? ' itd-split-panel--detail-open' : ''}`}>

            {/* ── Left pane: file list ── */}
            <div className="psb-window itd-split-explorer">
              <div className="psb-header">
                <span className="psb-title">🗁 file_explorer.exe — C:\Projects\{activeFolder}</span>
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
                <span className="psb-file-count">{filteredProjects.length} object(s) detected in matrix cluster.</span>
                <button type="button" className="psb-btn psb-btn--muted" onClick={handleCloseFolder}>Close Directory</button>
              </div>
            </div>

            {/* ── Right pane: project detail / viewer ── */}
            <div className={`itd-split-detail${activeProject ? ' itd-split-detail--open' : ''}`}>
              <div className="psb-window" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {activeProject && (
                  <>
                    <div className="psb-header">
                      <span className="psb-title">🗁 {activeProject.title}</span>
                      <button type="button" className="psb-close-btn" onClick={handleCloseProject}>✕</button>
                    </div>

                    <div className="psb-body itd-detail-body">
                      <MultimediaViewer project={activeProject} />
                    </div>

                    <div className="psb-footer">
                      <button type="button" className="psb-btn psb-btn--muted" onClick={handleCloseProject}>Close Preview</button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      <SocialBar />
    </div>
  );
};

export default ArtistDesktop;