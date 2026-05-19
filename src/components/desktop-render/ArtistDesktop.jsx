import React from 'react';
import { artProjects } from '../../data/projects';
import FilmStrip from '../../components/FilmStrip.jsx';
import SocialBar from '../shared/SocialBar.jsx';
import '../../styles/artist-desktop.css';

// Asset Imports
import artistname from '../../assets/shared/Reystarrie.png';
import digitalIcon from '../../assets/shared/laptop.png';
import traditionalIcon from '../../assets/shared/draw.png';
import writtenIcon from '../../assets/shared/notepad.png';
import artistCharacter from '../../assets/shared/ArtistModel.png'; 

const ArtistDesktop = () => {

  const handleFolderClick = (category) => {
    console.log(`Open folder or filter by: ${category}`);
  };

  return (
    <div className="artist-desktop-container">

      <div className="artist-intro-block">
        <div className="artist-name">
          <img src={artistname} alt="Reystarrie" />
        </div>
        <p className="artist-tagline">
          A self-taught artist that's always up to something,<br />
          always have ideas to creatively manifest the vision.
        </p>
      </div>

      <div className="desktop-icon-workspace">
        <h2 className="workspace-heading">Personal Projects</h2>
        
        <div className="desktop-icons-row">
          {/* Digital Folder */}
          <button className="desktop-icon-btn" onClick={() => handleFolderClick('digital')} type="button">
            <div className="icon-frame">
              <img src={digitalIcon} alt="Digital works" className="icon-graphic" />
            </div>
            <span className="icon-label">Digital</span>
          </button>

          {/* Traditional Folder */}
          <button className="desktop-icon-btn" onClick={() => handleFolderClick('traditional')} type="button">
            <div className="icon-frame">
              <img src={traditionalIcon} alt="Traditional works" className="icon-graphic" />
            </div>
            <span className="icon-label">Traditional</span>
          </button>

          {/* Written Folder */}
          <button className="desktop-icon-btn" onClick={() => handleFolderClick('written')} type="button">
            <div className="icon-frame">
              <img src={writtenIcon} alt="Written works" className="icon-graphic" />
            </div>
            <span className="icon-label">Written</span>
          </button>
        </div>
      </div>

      <div className="artist-gallery">
        {artProjects.map((art) => (
          <div key={art.id} className="artist-gallery-card">
            <span className="artist-card-title">{art.title}</span>
          </div>
        ))}
      </div>

      <div className="artist-filmstrip-tilt">
        <div className="artist-footer-bar">
          <FilmStrip />
        </div>
      </div>

      <div className="artist-character-overlay">
        <img 
          src={artistCharacter} 
          alt="Character Illustration" 
          className="character-img"
          draggable="false"
        />
      </div>

      <SocialBar />

    </div>
  );
};

export default ArtistDesktop;