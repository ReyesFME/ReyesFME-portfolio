import React from 'react';
import mainLogoBlack from '../../assets/shared/MainLogo.png';
import mainLogoWhiteInverted from '../../assets/shared/MainLogoInverted.png';

const PersonaToggle = ({ currentPersona, togglePersona }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
    onClick={togglePersona}
    >

      <img 
        src={currentPersona === 'it' ? mainLogoWhiteInverted : mainLogoBlack} 
        alt="Switch Persona Logo" 
        style={{
          height: '60px', 
          objectFit: 'contain',
          filter: currentPersona === 'it' 
            ? 'drop-shadow(0px 0px 8px rgba(209, 21, 46, 0.59))'
            : 'drop-shadow(2px 2px 4px rgba(119, 7, 7, 0.98))'             
        }}
      />
    </div>
  );
};

export default PersonaToggle;