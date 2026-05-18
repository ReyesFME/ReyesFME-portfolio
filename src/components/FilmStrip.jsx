// src/components/FilmStrip.jsx
import React from 'react';
import { artProjects } from '../data/projects.js';
import singleFrame from '../assets/shared/filmframe.png';
import '../styles/filmstrip.css';

const FilmStrip = () => {
  const loopProjects = Array(20).fill(artProjects).flat();

  return (
    <div className="filmstrip-container">
      <div className="filmstrip-track">
        {loopProjects.map((project, index) => (
          <div className="film-cell" key={`${project.id}-${index}`}>
            
            <img 
              src={project.image} 
              alt={project.title} 
              className="film-artwork" 
            />
            
            <img 
              src={singleFrame} 
              alt="" 
              className="single-frame-overlay" 
              draggable="false"
            />
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilmStrip;