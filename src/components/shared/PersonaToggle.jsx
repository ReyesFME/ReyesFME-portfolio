import React, { useState, useEffect, useRef } from 'react';
import mainLogoBlack from '../../assets/shared/MainLogo.png';
import mainLogoWhiteInverted from '../../assets/shared/MainLogoInverted.png';
import '../../styles/persona-toggle.css';

const PersonaToggle = ({ currentPersona, togglePersona, isInline = false }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSkullGlitching, setIsSkullGlitching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const idleTimerRef    = useRef(null);
  const glitchOutRef    = useRef(null);

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
      setIsTransitioning(true);
      togglePersona();
      setTimeout(() => setIsTransitioning(false), 950);

    } else {
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
      className={`persona-toggle-anchor ${isInline ? 'persona-toggle-inline' : ''} ${isTransitioning ? 'execution-frame-active' : ''}`}
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