import React, { useState, useEffect, useRef } from 'react';
import mainLogoBlack from '../../assets/shared/MainLogo.png';
import mainLogoWhiteInverted from '../../assets/shared/MainLogoInverted.png';
import '../../styles/persona-toggle.css';

const PersonaToggle = ({ currentPersona, togglePersona }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSkullGlitching, setIsSkullGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const idleTimerRef    = useRef(null);
  const glitchOutRef    = useRef(null);

  // ── Autonomous idle glitch every 20s on IT side ───────────────────────────
  useEffect(() => {
    if (currentPersona !== 'it') {
      clearTimeout(idleTimerRef.current);
      clearTimeout(glitchOutRef.current);
      setIsSkullGlitching(false);
      return;
    }

    const schedule = () => {
      idleTimerRef.current = setTimeout(() => {
        setIsSkullGlitching(true);
        glitchOutRef.current = setTimeout(() => {
          setIsSkullGlitching(false);
          schedule();
        }, 700);
      }, 20000);
    };

    schedule();
    return () => {
      clearTimeout(idleTimerRef.current);
      clearTimeout(glitchOutRef.current);
    };
  }, [currentPersona]);

  const handleToggleClick = () => {
    if (isTransitioning) return;

    clearTimeout(idleTimerRef.current);
    clearTimeout(glitchOutRef.current);
    setIsSkullGlitching(false);

    if (currentPersona === 'it') {
      // ── IT → Artist: hand off entirely to GlitchOverlay canvas in App ──
      setIsTransitioning(true);
      togglePersona(); // App handles the canvas + persona swap
      // Re-enable clicks after the full sequence (900ms + buffer)
      setTimeout(() => setIsTransitioning(false), 950);

    } else {
      // ── Artist → IT: clean OS blackout ──
      setIsTransitioning(true);
      const container = document.getElementById('desktop-root-chassis');
      if (container) {
        container.style.transition = 'opacity 0.15s ease, filter 0.15s ease';
        container.style.opacity    = '0.1';
        container.style.filter     = 'brightness(0.3) contrast(1.2)';

        setTimeout(() => {
          togglePersona();
          setTimeout(() => {
            const fresh = document.getElementById('desktop-root-chassis');
            if (fresh) {
              fresh.style.opacity = '1';
              fresh.style.filter  = 'none';
            }
            setIsTransitioning(false);
          }, 50);
        }, 150);
      } else {
        togglePersona();
        setIsTransitioning(false);
      }
    }
  };

  const isOnItSide = currentPersona === 'it';

  return (
    <div
      className={`persona-toggle-anchor ${isTransitioning ? 'execution-frame-active' : ''}`}
      onClick={handleToggleClick}
      onMouseEnter={() => isOnItSide && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={isOnItSide ? mainLogoWhiteInverted : mainLogoBlack}
        alt="Switch Persona Logo"
        className={[
          'persona-toggle-logo',
          isOnItSide ? 'persona-it-style' : 'persona-art-style',
          isOnItSide && isSkullGlitching             ? 'skull-idle-glitch'  : '',
          isOnItSide && isHovered && !isSkullGlitching ? 'skull-hover-glitch' : '',
        ].filter(Boolean).join(' ')}
      />
    </div>
  );
};

export default PersonaToggle;