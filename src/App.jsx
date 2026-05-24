import { useState } from 'react';
import { useWindowSize } from './hooks/useWindowSize';
import './index.css';

import PersonaToggle from './components/shared/PersonaToggle.jsx';
import GlitchOverlay from './components/shared/GlitchOverlay.jsx';
import ITDesktop from './components/desktop-render/ITDesktop.jsx';
import ArtistDesktop from './components/desktop-render/ArtistDesktop.jsx';

function App() {
  const [activePersona, setActivePersona] = useState('it');
  const [glitchActive,  setGlitchActive]  = useState(false);
  const { isMobile } = useWindowSize();

  const triggerHorrorTransition = () => {
    if (glitchActive) return;
    setGlitchActive(true);
  };

  // Called by GlitchOverlay at 420ms — swap persona mid-glitch
  const handleGlitchSwap = () => {
    setActivePersona('artist');
  };

  // Called by GlitchOverlay at 1000ms — canvas is done, bleed sepia onto page
  const handleGlitchComplete = () => {
    setGlitchActive(false);

    const container = document.getElementById('desktop-root-chassis');
    if (!container) return;

    // Start: deep sepia-red burn, dark, desaturated — matches the canvas exit tone
    container.style.transition = 'none';
    container.style.filter     = 'brightness(0.55) contrast(1.4) saturate(0) sepia(0.85) hue-rotate(330deg)';
    container.style.opacity    = '0.75';

    // Let the browser paint that frame, then begin the slow fade to normal
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.style.transition = 'filter 1.8s ease-out, opacity 1.4s ease-out';
        container.style.filter     = 'brightness(1) contrast(1) saturate(1) sepia(0) hue-rotate(0deg)';
        container.style.opacity    = '1';

        setTimeout(() => {
          container.style.transition = '';
          container.style.filter     = '';
          container.style.opacity    = '';
        }, 1900);
      });
    });
  };

  const togglePersona = () => {
    if (activePersona === 'it') {
      triggerHorrorTransition();
    } else {
      setActivePersona('it');
    }
  };

  return (
    <div
      id="desktop-root-chassis"
      className={
        activePersona === 'artist'
          ? 'theme-artist app-wrapper artist-desktop-container'
          : 'app-wrapper it-desktop-container'
      }
    >
      <GlitchOverlay
        active={glitchActive}
        onDone={handleGlitchSwap}
        onComplete={handleGlitchComplete}
      />

      {/* FLOATING CORNER TOGGLE: 
        Only rendered on the artist side. On the IT side, the toggle component 
        is rendered inline inside ITDesktop between your name text blocks.
      */}
      {activePersona === 'artist' && (
        <PersonaToggle currentPersona={activePersona} togglePersona={togglePersona} />
      )}

      {isMobile ? (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <h1>Mobile View coming soon!</h1>
          <p>Please view on a desktop monitor for the full experience.</p>
        </div>
      ) : (
        activePersona === 'it' ? (
          <ITDesktop togglePersona={togglePersona} />
        ) : (
          <ArtistDesktop />
        )
      )}
    </div>
  );
}

export default App;