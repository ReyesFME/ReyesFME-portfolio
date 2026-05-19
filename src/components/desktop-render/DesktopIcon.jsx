import React from 'react';

const DesktopIcon = ({ label, iconSrc, onClick, className = '' }) => {
  return (
    <button 
      className={`desktop-icon-btn ${className}`} 
      onClick={onClick}
      type="button"
    >
      <div className="icon-wrapper">
        {iconSrc ? (
          <img src={iconSrc} alt={`${label} folder`} className="icon-graphic" />
        ) : (
          /* Fallback temporary style if an image asset is missing */
          <div className="icon-fallback" />
        )}
      </div>
      <span className="icon-label">{label}</span>
    </button>
  );
};

export default DesktopIcon;