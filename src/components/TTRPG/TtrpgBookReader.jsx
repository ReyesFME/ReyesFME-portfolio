import React, { useState } from 'react';
import SystemLogViewer from './SystemLogViewer.jsx';
import '../../styles/ttrpg-styles.css';

const TtrpgBookReader = () => {
  const [viewMode, setViewMode] = useState(null);

  if (viewMode === 'draft') {
    return (
      <div className="ttrpg-reader-root">
        <button
          type="button"
          className="ttrpg-back-btn"
          onClick={() => setViewMode(null)}
        >
          ← BACK TO SELECTION
        </button>
        <SystemLogViewer />
      </div>
    );
  }

  // published is not yet configured — keep the slot but mark it disabled
  if (viewMode === 'published') {
    return (
      <div className="ttrpg-reader-root">
        <button
          type="button"
          className="ttrpg-back-btn"
          onClick={() => setViewMode(null)}
        >
          ← BACK TO SELECTION
        </button>
        <div className="ttrpg-coming-soon">
          <span className="ttrpg-coming-soon-icon">[PUB]</span>
          <p>PUBLISHED VERSION</p>
          <p className="ttrpg-coming-soon-sub">[ ASSET PIPELINE NOT CONFIGURED ]</p>
          <p className="ttrpg-coming-soon-sub">Cloudinary integration pending.</p>
        </div>
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

        {/* Published Version — coming soon */}
        <button
          type="button"
          className="ttrpg-choice-card ttrpg-choice-card--published ttrpg-choice-card--disabled"
          onClick={() => setViewMode('published')}
        >
          <span className="ttrpg-choice-card-icon">[PUB]</span>
          <span className="ttrpg-choice-card-title">Published Version</span>
          <span className="ttrpg-choice-card-desc">
            Illustrated manuscript completed with character and background assets.
          </span>
          <span className="ttrpg-choice-card-status ttrpg-choice-card-status--pending">
            ○ PENDING CONFIGURATION
          </span>
        </button>
      </div>
    </div>
  );
};

export default TtrpgBookReader;