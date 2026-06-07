import React, { useState } from 'react';
import SystemLogViewer from './SystemLogViewer.jsx';
import ImmersiveTtrpgReader from './ImmersiveTTRPGViewer.jsx';
import '../../styles/ttrpg-styles.css';

const ASSETS = {
  bg:   'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780823439/ttrpg-bg.jpg',
  logo: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780823428/TTRPG-name-art.png',  
};

const TtrpgBookReader = () => {
  const [viewMode, setViewMode] = useState(null);

  if (viewMode === 'draft') {
    return (
      <div className="ttrpg-reader-root" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <button
          type="button"
          className="ttrpg-back-btn"
          onClick={() => setViewMode(null)}
          style={{ top: '10px', left: '10px', zIndex: 100 }}
        >
          ← BACK TO SELECTION
        </button>
        <SystemLogViewer />
      </div>
    );
  }

  if (viewMode === 'published') {
    return (
      <div className="ttrpg-reader-root" style={{ width: '100%', height: '100%' }}>
        <ImmersiveTtrpgReader onClose={() => setViewMode(null)} />
      </div>
    );
  }

  // ── Immersive choice screen ──────────────────────────────────────────────
  return (
    <div className="ttrpg-splash-root">

      {/* Background art */}
      <div
        className="ttrpg-splash-bg"
        style={{ backgroundImage: `url(${ASSETS.bg})` }}
      />

      {/* Dark gradient overlay so text stays readable */}
      <div className="ttrpg-splash-overlay" />

      {/* Content */}
      <div className="ttrpg-splash-content">

        {/* Logo */}
        <div className="ttrpg-splash-logo-wrap">
          <img
            src={ASSETS.logo}
            alt="Approaching Dusk"
            className="ttrpg-splash-logo"
            draggable="false"
          />
        </div>

        {/* Heading */}
        <div className="ttrpg-splash-heading">
          <span className="ttrpg-splash-label">SELECT_DOCUMENT_VERSION</span>
          <p className="ttrpg-splash-sub">Choose which version of the TTRPG document to load.</p>
        </div>

        {/* Cards */}
        <div className="ttrpg-splash-grid">

          {/* Developer's Draft */}
          <button
            type="button"
            className="ttrpg-choice-card ttrpg-choice-card--draft"
            onClick={() => setViewMode('draft')}
          >
            <span className="ttrpg-choice-card-icon">[DEV]</span>
            <span className="ttrpg-choice-card-title">Developer's Draft</span>
            <span className="ttrpg-choice-card-desc">
              Raw document focusing on tabletop rules and game mechanics.
            </span>
            <span className="ttrpg-choice-card-status ttrpg-choice-card-status--active">
              ● AVAILABLE
            </span>
          </button>

          {/* Published Version */}
          <button
            type="button"
            className="ttrpg-choice-card ttrpg-choice-card--published"
            onClick={() => setViewMode('published')}
          >
            <span className="ttrpg-choice-card-icon">[PUB]</span>
            <span className="ttrpg-choice-card-title">Published Version</span>
            <span className="ttrpg-choice-card-desc">
              Illustrated manuscript completed with character and background assets.
            </span>
            <span className="ttrpg-choice-card-status ttrpg-choice-card-status--active">
              ● AVAILABLE
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default TtrpgBookReader;