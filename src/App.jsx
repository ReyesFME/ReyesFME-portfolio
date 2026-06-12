import { useState, useEffect } from 'react';
import { useWindowSize } from './hooks/useWindowSize';
import './index.css';

import PersonaToggle  from './components/shared/PersonaToggle.jsx';
import GlitchOverlay  from './components/shared/GlitchOverlay.jsx';
import ITDesktop      from './components/desktop-render/ITDesktop.jsx';
import ArtistDesktop  from './components/desktop-render/ArtistDesktop.jsx';
import ITMobile       from './components/mobile-render/ITMobile.jsx';
import ArtistMobile   from './components/mobile-render/ArtistMobile.jsx';

function App() {
  const [activePersona, setActivePersona] = useState('it');
  const [glitchActive,  setGlitchActive]  = useState(false);
  const { isMobile } = useWindowSize();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');

    if (viewParam === 'artist' || viewParam === 'reystarrie') {
      setActivePersona('artist');
    }
  }, []);

  const triggerHorrorTransition = () => {
    if (glitchActive) return;
    setGlitchActive(true);
  };

  const handleGlitchSwap = () => {
    setActivePersona('artist');
  };

  const handleGlitchComplete = () => {
    setGlitchActive(false);

    const container = document.getElementById('desktop-root-chassis');
    if (!container) return;

    container.style.transition = 'none';
    container.style.filter     = 'brightness(0.55) contrast(1.4) saturate(0) sepia(0.85) hue-rotate(330deg)';
    container.style.opacity    = '0.75';

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

  const personaToggleNode = activePersona === 'artist' ? (
    <PersonaToggle currentPersona={activePersona} togglePersona={togglePersona} isInline={true} />
  ) : null;

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

      {isMobile ? (
        activePersona === 'it' ? (
          <ITMobile togglePersona={togglePersona} />
        ) : (
          <ArtistMobile personaToggle={personaToggleNode} />
        )
      ) : (
        activePersona === 'it' ? (
          <ITDesktop togglePersona={togglePersona} />
        ) : (
          <ArtistDesktop personaToggle={personaToggleNode} />
        )
      )}
    </div>
  );
}

export default App;