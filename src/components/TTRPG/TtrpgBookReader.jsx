import React, { useState } from 'react';
import SystemLogViewer from './SystemLogViewer.jsx';
import ImmersiveTtrpgReader from './ImmersiveTTRPGViewer.jsx'; // Import the flipbook here!
import '../../styles/ttrpg-styles.css';

const TtrpgBookReader = () => {
  const [viewMode, setViewMode] = useState(null);

  if (viewMode === 'draft') {
    return (
      <div className="ttrpg-reader-root" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <button
          type="button"
          className="ttrpg-back-btn"
          onClick={() => setViewMode(null)}
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 100 }}
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
        {/* We pass a function to 'onClose' so the flipbook knows how to return to the selection terminal */}
        <ImmersiveTtrpgReader onClose={() => setViewMode(null)} />
      </div>
    );
  }

  // Default — choice screen
  return (
    <div className="ttrpg-choice-root">
      <div className="ttrpg-choice-header">
        <span className="ttrpg-choice-label">SELECT_DOCUMENT_VERSION</span>
        <p className="ttrpg-choice-sub">Choose which version of the TTRPG document to load.</p>
      </div>

      <div className="ttrpg-choice-grid">
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
  );
};

export default TtrpgBookReader;