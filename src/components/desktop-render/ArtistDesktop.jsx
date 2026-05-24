import React, { useState } from 'react';
import { artProjects } from '../../data/projects';
import FilmStrip from '../../components/FilmStrip.jsx';
import SocialBar from '../shared/SocialBar.jsx';
import ProfessionalSidebar from '../shared/ProfessionalSidebar.jsx';
import '../../styles/artist-desktop.css';
import '../../styles/professional-sidebar.css';

import artistname      from '../../assets/shared/Reystarrie.png';
import digitalIcon     from '../../assets/shared/laptop.png';
import traditionalIcon from '../../assets/shared/draw.png';
import writtenIcon     from '../../assets/shared/notepad.png';
import artistCharacter from '../../assets/shared/ArtistModel.png';

const ArtistDesktop = () => {
  const [activeFolder, setActiveFolder] = useState(null);

  const filteredProjects = artProjects.filter(p => p.category === activeFolder);

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
          {[
            { key: 'digital',     icon: digitalIcon,     label: 'Digital'      },
            { key: 'traditional', icon: traditionalIcon, label: 'Traditional'  },
            { key: 'written',     icon: writtenIcon,     label: 'Written'      },
          ].map(({ key, icon, label }) => (
            <button key={key} className="desktop-icon-btn" type="button" onClick={() => setActiveFolder(key)}>
              <div className="icon-frame"><img src={icon} alt={label} className="icon-graphic" /></div>
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
        <div className="psb-overlay" onClick={() => setActiveFolder(null)}>
          <div
            className="psb-window"
            onClick={e => e.stopPropagation()}
            style={{ width: 'clamp(300px, 58vw, 680px)', maxWidth: '92vw' }}
          >
            <div className="psb-header">
              <span className="psb-title">🗁 file_explorer.exe — C:\Projects\{activeFolder}</span>
              <button type="button" className="psb-close-btn" onClick={() => setActiveFolder(null)}>✕</button>
            </div>

            <div className="psb-body explorer-body-grid">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
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

            <div className="psb-footer">
              <span className="psb-file-count">{filteredProjects.length} object(s) detected in matrix cluster.</span>
              <button type="button" className="psb-btn psb-btn--muted" onClick={() => setActiveFolder(null)}>Close Directory</button>
            </div>
          </div>
        </div>
      )}

      <SocialBar />
    </div>
  );
};

export default ArtistDesktop;