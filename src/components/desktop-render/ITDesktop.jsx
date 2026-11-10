import React, { useState, useEffect } from 'react';
import { itProjects } from '../../data/projects';
import DocxViewer from '../shared/DocxViewer.jsx';
import SocialBar from '../shared/SocialBar.jsx';
import PersonaToggle from '../shared/PersonaToggle.jsx';
import ProfessionalSidebar from '../shared/ProfessionalSidebar.jsx';
import CursorTrail from '../shared/CursorTrail.jsx';
import NavBrandToggle from '../shared/NavBrandToggle.jsx';
import '../../styles/it-desktop.css';
import '../../styles/professional-sidebar.css';

import professionalLogo from '../../assets/shared/MainLogoInverted.png';
import professionalLogoLight from '../../assets/shared/MainLogo.png';
import professionalFirstName from '../../assets/shared/fiona-tag.png';
import professionalLastName  from '../../assets/shared/Reyes-tag.png';
import reactIcon   from '../../assets/shared/react.png';
import pythonIcon  from '../../assets/shared/python.png';
import jsIcon      from '../../assets/shared/javascript.png';
import sysArchIcon from '../../assets/shared/document.png';
import codingIcon  from '../../assets/shared/laptop.png';
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
  { id: 'react',   label: 'React',      icon: reactIcon   },
  { id: 'python',  label: 'Python',     icon: pythonIcon  },
  { id: 'js',      label: 'JavaScript', icon: jsIcon      },
  { id: 'sysarch', label: 'UML',        icon: sysArchIcon },
];

const FOLDER_CATEGORIES = [
  { id: 'coding', label: 'Coding Projects',       icon: codingIcon, dataKey: 'Coding Projects'         },
  { id: 'sysdoc', label: 'System Documentations', icon: sysDocIcon, dataKey: 'System Documentation'    },
  { id: 'mm',     label: 'Multimedia',            icon: mmIcon,     dataKey: 'Multimedia Works'        },
  { id: 'game',   label: 'GameDev Assets',        icon: gameIcon,   dataKey: 'Game Development Assets' },
  // Empty for now. Any project in projects.js with category: "OJT Experience" shows up here automatically.
  { id: 'ojt',    label: 'OJT Experience',        icon: sysDocIcon, dataKey: 'OJT Experience'          },
];

// ── Professional bio (edit this text any time) ───────────────
const BIO =
  'A Bachelor of Science in Information Technology student at Pamantasan ng Lungsod ng Valenzuela who has completed her on-the-job training. ' +
  'Works across React, Python, and JavaScript, and backs her code with system documentation such as UML and data flow diagrams. ' +
  'Alongside development, she produces multimedia and game development assets, bringing a creative, critical, and detail-oriented approach to technical work.';

// ── helpers ──────────────────────────────────────────────────
const scrollToCategory = (id) => {
  const el = document.getElementById(`itd-cat-${id}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Picks the best thumbnail a project has. Returns null if it has none.
const getThumb = (p) =>
  p.previewImage ||
  p.image ||
  (p.images && p.images[0]) ||
  (p.cardData && p.cardData[0] && p.cardData[0].front) ||
  null;

const getFallbackGlyph = (p) => {
  if (p.fileUrl) return 'TXT';
  if (p.category === 'Coding Projects') return '</>';
  return 'DOC';
};

const getGhostPreviewType = (project) => {
  switch (project.customComponent) {
    case 'TkinterInventoryApp': return 'inventory';
    case 'DfdImageViewerApp': return 'dfd';
    case 'TTRPGArchiveViewer': return 'ttrpg';
    case 'WaveDocViewerApp': return 'wave';
    default: return null;
  }
};

const PreviewGhost = ({ type }) => (
  <span className={`itd-mini-fallback itd-mini-fallback--${type}`} aria-hidden="true">
    {type === 'inventory' && (
      <span className="itd-ghost-inventory">
        <span className="itd-ghost-toolbar" />
        <span className="itd-ghost-inventory-layout">
          <span className="itd-ghost-sidebar"><i /><i /><i /></span>
          <span className="itd-ghost-table">
            <i /><i /><i /><i /><i /><i />
          </span>
        </span>
      </span>
    )}
    {type === 'dfd' && (
      <span className="itd-ghost-dfd">
        <span className="itd-ghost-node itd-ghost-node--top">USER</span>
        <span className="itd-ghost-flow itd-ghost-flow--down">↓</span>
        <span className="itd-ghost-node itd-ghost-node--center">SYSTEM</span>
        <span className="itd-ghost-flow itd-ghost-flow--left">←</span>
        <span className="itd-ghost-node itd-ghost-node--left">DATA</span>
        <span className="itd-ghost-flow itd-ghost-flow--right">→</span>
        <span className="itd-ghost-node itd-ghost-node--right">REPORT</span>
      </span>
    )}
    {type === 'ttrpg' && (
      <span className="itd-ghost-book">
        <span className="itd-ghost-book-mark">✦</span>
        <span className="itd-ghost-book-title">TTRPG ARCHIVE</span>
        <span className="itd-ghost-book-rule" />
        <span className="itd-ghost-book-lines"><i /><i /><i /><i /></span>
      </span>
    )}
    {type === 'wave' && (
      <span className="itd-ghost-document">
        <span className="itd-ghost-document-title">W.A.V.E.</span>
        <span className="itd-ghost-document-subtitle">PROJECT DOCUMENTATION</span>
        <span className="itd-ghost-document-rule" />
        <span className="itd-ghost-document-lines"><i /><i /><i /><i /><i /></span>
      </span>
    )}
    <span className="itd-mini-hint">Open to preview</span>
  </span>
);

const renderViewer = (project) => {
  switch (project.customComponent) {
    case 'CPUSchedulerApp':        return <CPUSchedulerApp />;
    case 'MockReportGeneratorApp': return <MockReportGeneratorApp />;
    case 'StevenUniverseApp':      return <StevenUniverseApp />;
    case 'TkinterInventoryApp':    return <TkinterInventoryApp />;
    case 'WaveDocViewerApp':       return <WaveDocViewer />;
    case 'DfdImageViewerApp':      return <DfdViewer />;
    case 'MultimediaViewerApp':    return <MultimediaViewer project={project} />;
    case 'CardDeckViewerApp':      return <CardDeckViewer project={project} />;
    case 'CapstoneViewerApp':      return <CapstoneViewer />;
    case 'DocxViewerApp':          return <DocxViewer project={project} />;
    default:                       return <TtrpgBookReader />;
  }
};

// ── mini preview window ──────────────────────────────────────
const MiniWindow = ({ project, onOpen }) => {
  const thumb = getThumb(project);
  const ghostType = getGhostPreviewType(project);
  const tags = project.techStack && project.techStack.length
    ? project.techStack
    : (project.medium ? [project.medium] : []);

  return (
    <button type="button" className="itd-mini" onClick={() => onOpen(project)}>
      <span className="itd-mini-bar">
        <span className="itd-mini-title">{project.title}</span>
        <span className="itd-mini-ctrls" aria-hidden="true">
          <span className="itd-mini-ctrl" />
          <span className="itd-mini-ctrl" />
          <span className="itd-mini-ctrl" />
        </span>
      </span>

      <span className="itd-mini-thumb">
        {ghostType ? (
          <PreviewGhost type={ghostType} />
        ) : thumb ? (
          <img src={thumb} alt={project.title} loading="lazy" draggable="false" />
        ) : (
          <span className="itd-mini-fallback">
            <span className="itd-mini-glyph">{getFallbackGlyph(project)}</span>
            <span className="itd-mini-hint">Open to preview</span>
          </span>
        )}
      </span>

      <span className="itd-mini-info">
        {project.description ? <span className="itd-mini-desc">{project.description}</span> : null}
        {tags.length > 0 && (
          <span className="itd-mini-tags">
            {tags.slice(0, 3).map(t => <span key={t} className="itd-tech-tag">{t}</span>)}
          </span>
        )}
      </span>
    </button>
  );
};

// ── page ─────────────────────────────────────────────────────
const ITDesktop = ({ togglePersona, isLightMode, toggleLightMode }) => {
  const [activeProject, setActiveProject] = useState(null);
  const [showMoreInfo,  setShowMoreInfo]  = useState(false);

  // Deep link: ?folder=coding&file=it-1 scrolls to the category and opens the project.
  // The category is checked too, because "mm-15" exists in two categories.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const folder = FOLDER_CATEGORIES.find(f => f.id === params.get('folder'));
    if (!folder) return undefined;

    const fileParam = params.get('file');
    const project = fileParam
      ? itProjects.find(p => p.id === fileParam && p.category === folder.dataKey)
      : null;
    if (project) setActiveProject(project);

    const t = setTimeout(() => scrollToCategory(folder.id), 150);
    return () => clearTimeout(t);
  }, []);

  // Viewer open: Esc closes it, and the page behind stops scrolling.
  useEffect(() => {
    if (!activeProject) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setActiveProject(null); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeProject]);

  const closeProject = () => setActiveProject(null);

  // Prev / next within the SAME category only (no wrap-around, never jumps to another category)
  const categoryItems = activeProject
    ? itProjects.filter(p => p.category === activeProject.category)
    : [];
  const activeIndex = activeProject ? categoryItems.indexOf(activeProject) : -1;
  const prevProject = activeIndex > 0 ? categoryItems[activeIndex - 1] : null;
  const nextProject =
    activeIndex >= 0 && activeIndex < categoryItems.length - 1
      ? categoryItems[activeIndex + 1]
      : null;

  return (
    <div className={`itd-page${isLightMode ? ' it-light-mode' : ''}`}>
      <CursorTrail />
      {/* ── TOP NAVBAR ── (no backdrop-filter here: it would trap the sidebar's fixed modals) */}
      <header className="itd-nav">
        {/* Logo: click = back to top, double-click = switch light / dark (Shift + click also switches) */}
        <NavBrandToggle
          isLight={isLightMode}
          onToggleTheme={toggleLightMode}
          onHome={scrollToTop}
        >
          <img
            src={isLightMode ? professionalLogoLight : professionalLogo}
            alt=""
            className="persona-toggle-logo"
            draggable="false"
          />
        </NavBrandToggle>

        {/* Category links: text on desktop, icon only on tablet (swapped in CSS) */}
        <nav className="itd-nav-links" aria-label="Portfolio sections">
          {FOLDER_CATEGORIES.map(folder => (
            <button
              key={folder.id}
              type="button"
              className="itd-nav-link"
              onClick={() => scrollToCategory(folder.id)}
              aria-label={folder.label}
              title={folder.label}
            >
              <img src={folder.icon} alt="" className="itd-nav-link-icon" draggable="false" />
              <span className="itd-nav-link-text">{folder.label}</span>
            </button>
          ))}
        </nav>

        <ProfessionalSidebar variant="itnav" />
      </header>

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
            <PersonaToggle
              currentPersona="it"
              togglePersona={togglePersona}
              isInline={true}
              isLightMode={isLightMode}
            />
            <img src={professionalLastName}  alt="Reyes" className="itd-name-last"  draggable="false" />
          </div>

          <p className="itd-tagline">{BIO}</p>

          <button className="itd-show-more" type="button" onClick={() => setShowMoreInfo(v => !v)}>
            {showMoreInfo ? '∧ Hide Information' : 'v Show More Information'}
          </button>

          {showMoreInfo && (
            <div className="itd-more-info-panel">
              <p> Valenzuela City, Philippines</p>
              <p> Bachelor of Science in Information Technology</p>
              <p> Expected graduation: 2027</p>
              <p> On-the-job training: Completed</p>
            </div>
          )}

          <h2 className="itd-section-heading">Professional / School Works</h2>

          {/* ── CATEGORIES, STACKED VERTICALLY ── */}
          <div className="itd-works">
            {FOLDER_CATEGORIES.map(folder => {
              const items = itProjects.filter(p => p.category === folder.dataKey);
              return (
                <section key={folder.id} id={`itd-cat-${folder.id}`} className="itd-category">
                  <div className="itd-category-head">
                    <img src={folder.icon} alt="" className="itd-category-icon" draggable="false" />
                    <h3 className="itd-category-title">{folder.label}</h3>
                    <span className="itd-category-count">{items.length} item{items.length === 1 ? '' : 's'}</span>
                  </div>

                  {items.length > 0 ? (
                    <div className="itd-mini-grid">
                      {items.map((project, i) => (
                        <MiniWindow
                          key={`${folder.id}-${project.id}-${i}`}
                          project={project}
                          onOpen={setActiveProject}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="itd-empty-dir itd-category-empty">Nothing here yet. New work will be added soon.</div>
                  )}
                </section>
              );
            })}
          </div>
        </main>

        <SocialBar />
      </div>

      {/* ── FULL VIEWER ── */}
      {activeProject && (
        <div className="psb-overlay">
          <div className="psb-window itd-viewer-window">
            <div className="psb-header">
              <span className="psb-title">🗁 {activeProject.title}</span>
              <button type="button" className="psb-close-btn" onClick={closeProject}>✕</button>
            </div>

            <div className="psb-body itd-detail-body">
              {activeProject.isCustomViewer ? (
                // key forces a fresh viewer for every work, so state never carries over between projects
                <div
                  key={`${activeProject.category}-${activeProject.id}`}
                  style={{ display: 'contents' }}
                >
                  {renderViewer(activeProject)}
                </div>
              ) : (
                <React.Fragment key={`${activeProject.category}-${activeProject.id}`}>
                  <img src={activeProject.previewImage} alt={activeProject.title} className="itd-detail-preview-img" />
                  <div className="itd-detail-info">
                    <p className="itd-proj-category">{activeProject.category}</p>
                    <h2 className="itd-proj-title">{activeProject.title}</h2>
                    <p className="itd-proj-desc">{activeProject.description}</p>
                    <div className="itd-tech-stack">
                      {(activeProject.techStack || []).map(tech => (
                        <span key={tech} className="itd-tech-tag">{tech}</span>
                      ))}
                    </div>
                    <div className="itd-project-links">
                      {activeProject.demoLink && (
                        <a href={activeProject.demoLink} target="_blank" rel="noopener noreferrer" className="psb-btn psb-btn--muted">Live Demo →</a>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>

            <div className="psb-footer itd-viewer-footer">
              <div className="itd-viewer-nav" role="group" aria-label={`Browse ${activeProject.category}`}>
                <button
                  type="button"
                  className="psb-btn psb-btn--muted itd-viewer-arrow"
                  onClick={() => prevProject && setActiveProject(prevProject)}
                  disabled={!prevProject}
                  aria-label="Previous work"
                >
                  ◀
                </button>
                <span className="itd-viewer-count">
                  {activeIndex + 1} / {categoryItems.length}
                </span>
                <button
                  type="button"
                  className="psb-btn psb-btn--muted itd-viewer-arrow"
                  onClick={() => nextProject && setActiveProject(nextProject)}
                  disabled={!nextProject}
                  aria-label="Next work"
                >
                  ▶
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITDesktop;