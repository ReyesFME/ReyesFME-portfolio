import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const folderParam = params.get('folder');

    if (folderParam === 'written' || folderParam === 'digital' || folderParam === 'traditional') {
      setActiveFolder(folderParam);
    }
  }, []);

  const filteredProjects = artProjects.filter(p => p.category === activeFolder);
  const getProjectThumbnail = project =>
    project.previewImage || project.image || project.images?.[0] || null;
  const activeProjectIndex = activeProject
    ? filteredProjects.findIndex(project => project.id === activeProject.id)
    : -1;
  const previousProject = activeProjectIndex > 0
    ? filteredProjects[activeProjectIndex - 1]
    : null;
  const nextProject = activeProjectIndex >= 0 && activeProjectIndex < filteredProjects.length - 1
    ? filteredProjects[activeProjectIndex + 1]
    : null;

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

      {activeFolder && (
        <div className="psb-overlay">
          <div className={`artist-project-panel${activeProject ? ' artist-project-panel--detail-open' : ''}`}>

            <div className="psb-window artist-project-explorer">
              <div className="psb-header">
                <span className="psb-title">🗁 file_explorer.exe — C:\Projects\{activeFolder}</span>
                <button type="button" className="psb-close-btn" onClick={handleCloseFolder}>✕</button>
              </div>

              <div className="psb-body artist-explorer-body">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <button
                      key={project.id}
                      className={`artist-explorer-file${activeProject?.id === project.id ? ' artist-explorer-file--active' : ''}`}
                      type="button"
                      onClick={() => setActiveProject(project)}
                    >
                      <div className="artist-project-thumbnail">
                        {getProjectThumbnail(project) ? (
                          <img
                            src={getProjectThumbnail(project)}
                            alt=""
                            loading="lazy"
                            draggable="false"
                          />
                        ) : (
                          <span>{project.fileUrl ? 'TXT' : 'ART'}</span>
                        )}
                      </div>
                      <div className="artist-project-card-info">
                        <span className="artist-file-name">{project.title}</span>
                        {project.medium && <span className="artist-project-medium">{project.medium}</span>}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="artist-empty-dir">[ SYSTEM ALERT: Directory is currently unpopulated ]</div>
                )}
              </div>

              <div className="psb-footer">
                <span className="psb-file-count">{filteredProjects.length} object(s) detected in matrix cluster.</span>
                <button type="button" className="psb-btn psb-btn--muted" onClick={handleCloseFolder}>Close Directory</button>
              </div>
            </div>

            <div className={`artist-project-detail${activeProject ? ' artist-project-detail--open' : ''}`}>
              <div className="psb-window" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {activeProject && (
                  <>
                    <div className="psb-header">
                      <span className="psb-title">🗁 {activeProject.title}</span>
                      <button type="button" className="psb-close-btn" onClick={handleCloseProject}>✕</button>
                    </div>

                    <div className="psb-body artist-detail-body">
                      <MultimediaViewer project={activeProject} />
                    </div>

                    <div className="psb-footer artist-preview-footer">
                      <div className="artist-preview-nav" role="group" aria-label="Browse artist works">
                        <button
                          type="button"
                          className="psb-btn psb-btn--muted artist-preview-arrow"
                          onClick={() => previousProject && setActiveProject(previousProject)}
                          disabled={!previousProject}
                          aria-label="Previous work"
                        >
                          ◀
                        </button>
                        <span className="artist-preview-count">
                          {activeProjectIndex + 1} / {filteredProjects.length}
                        </span>
                        <button
                          type="button"
                          className="psb-btn psb-btn--muted artist-preview-arrow"
                          onClick={() => nextProject && setActiveProject(nextProject)}
                          disabled={!nextProject}
                          aria-label="Next work"
                        >
                          ▶
                        </button>
                      </div>
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