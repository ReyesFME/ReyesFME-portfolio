import React from 'react';
import { artProjects } from '../../data/projects';

const ArtistDesktop = () => {
  return (
    <div style={{ 
      padding: '80px 40px', 
      width: '100%', 
      height: '100vh', 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end' // Aligns text to the right side like your mockup
    }}>
      
      {/* Introduction Text */}
      <div style={{ textAlign: 'right', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '4rem', margin: '0', fontFamily: 'serif', letterSpacing: '-2px' }}>
          Reystarrie
        </h1>
        <p>A self-taught artist always up to something.</p>
      </div>

      {/* Gallery Layout */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {artProjects.map((art) => (
          <div key={art.id} style={{ 
            width: '200px', 
            height: '200px', 
            backgroundColor: '#ccc', 
            border: '4px solid #fff',
            boxShadow: '5px 5px 0px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             {/* Placeholder for your art image */}
             <span>{art.title}</span>
          </div>
        ))}
      </div>

      {/* Film Strip Placeholder */}
      <div style={{
        marginTop: 'auto', width: '100vw', height: '150px', backgroundColor: '#222',
        position: 'absolute', bottom: '0', left: '0', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#fff', fontSize: '1.2rem', letterSpacing: '5px'
      }}>
         [ FILM STRIP ANIMATION GOES HERE ]
      </div>

    </div>
  );
};

export default ArtistDesktop;