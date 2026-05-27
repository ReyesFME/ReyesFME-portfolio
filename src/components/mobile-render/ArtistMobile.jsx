import React, { useState } from 'react';
import { artProjects } from '../../data/projects';
import FilmStrip from '../../components/FilmStrip.jsx';
import SocialBar from '../shared/SocialBar.jsx';
import MultimediaViewer from '../shared/MultimediaViewer.jsx';
import '../../styles/artist-mobile.css';

import artistName      from '../../assets/shared/Reystarrie.png';
import digitalIcon     from '../../assets/shared/laptop.png';
import traditionalIcon from '../../assets/shared/draw.png';
import writtenIcon     from '../../assets/shared/notepad.png';
import artistCharacter from '../../assets/shared/ArtistModel.png';

const ART_FOLDER_CATEGORIES = [
  { id: 'digital',     label: 'Digital',     icon: digitalIcon,     dataKey: 'digital'     },
  { id: 'traditional', label: 'Traditional', icon: traditionalIcon, dataKey: 'traditional' },
  { id: 'written',     label: 'Written',     icon: writtenIcon,     dataKey: 'written'     },
];

const ArtistMobile = ({ personaToggle }) => {
  const [showMoreInfo,  setShowMoreInfo]  = useState(false);
  const [activeFolder,  setActiveFolder]  = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  const filteredProjects = activeFolder
    ? artProjects.filter(p => p.category === activeFolder.dataKey)
    : [];

  const handleCloseFolder    = () => { setActiveFolder(null); setActiveProject(null); };
  const handleBackToExplorer = () => { setActiveProject(null); };

  return (
    <div className="am-container">

      {/* ── HEADER ────────────────────────────────────────────── */}
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
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="am-info-link-btn">
                <div className="am-info-link-icon" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
              <a href="mailto:fiona@email.com" className="am-info-link-btn">
                <div className="am-info-link-icon" aria-hidden="true" />
                <span>Gmail</span>
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="am-info-link-btn">
                <div className="am-info-link-icon am-info-link-icon--qr" aria-hidden="true" />
                <span>Resume</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN — folders only ───────────────────────────────── */}
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

      {/* ── FOOTER ────────────────────────────────────────────── */}
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

      {/* ── OVERLAY ───────────────────────────────────────────── */}
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
                <MultimediaViewer project={activeProject} />
              </div>
              <div className="am-window-footer">
                <button type="button" className="am-btn am-btn--muted" onClick={handleBackToExplorer}>← Back to files</button>
                <button type="button" className="am-btn am-btn--muted" onClick={handleCloseFolder}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistMobile;