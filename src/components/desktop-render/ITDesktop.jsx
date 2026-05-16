import React, { useState } from 'react';
import { itProjects } from '../../data/projects';

const ITDesktop = () => {
  // State to track if a folder is clicked/open
  const [activeWindow, setActiveWindow] = useState(null);

  return (
    <div style={{ padding: '80px 40px', width: '100%', height: '100vh', boxSizing: 'border-box' }}>
      
      {/* Introduction Text */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0' }}>Fiona Reyes</h1>
        <p>3rd year IT Student | Systems Architecture & Development</p>
      </div>

      {/* Desktop Icon Grid */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {itProjects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => setActiveWindow(project)}
            style={{
              width: '120px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Placeholder for your glowing folder icon */}
            <div style={{ fontSize: '3rem' }}>📁</div> 
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>{project.title}</p>
          </div>
        ))}
      </div>

      {/* The Pop-out Window (Only shows if a folder is clicked) */}
      {activeWindow && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '60%', minHeight: '400px', backgroundColor: '#2a2a2a', 
          border: '1px solid #444', borderRadius: '8px', padding: '20px',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.5)', color: 'white'
        }}>
          <h2>{activeWindow.title}</h2>
          <p><strong>Category:</strong> {activeWindow.category}</p>
          <p>{activeWindow.description}</p>
          <p><strong>Tech Stack:</strong> {activeWindow.techStack.join(', ')}</p>
          <button onClick={() => setActiveWindow(null)} style={{ marginTop: '20px' }}>
            Close Window
          </button>
        </div>
      )}
    </div>
  );
};

export default ITDesktop;