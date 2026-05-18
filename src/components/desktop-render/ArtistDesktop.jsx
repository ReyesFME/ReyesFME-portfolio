import React from 'react';
import { artProjects } from '../../data/projects';
import FilmStrip from '../../components/FilmStrip.jsx';
import '../../styles/artist-desktop.css';
import artistname from '../../assets/shared/Reystarrie.png';
import SocialBar from '../shared/SocialBar.jsx';

const ArtistDesktop = () => {
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

      <SocialBar />

    </div>
  );
};

export default ArtistDesktop;