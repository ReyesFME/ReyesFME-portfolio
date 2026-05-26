import React, { useState, useEffect } from 'react';
import '../../styles/mm-viewer.css';

export default function MultimediaViewer({ project }) {
  const [textContent, setTextContent] = useState("Loading document...");

  useEffect(() => {
    if (project && project.fileUrl) {
      setTextContent("Loading document...");
      fetch(project.fileUrl)
        .then(response => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.text();
        })
        .then(text => setTextContent(text))
        .catch(() => setTextContent("[ ERROR: Unable to load text file. Verify path. ]"));
    }
  }, [project]);

  if (!project) return null;


  return (
    <div className="mm-container">
      {/* Dynamic Header */}
      <div className="mm-header">
        <h2 className="mm-title">{project.title}</h2>
        <span className="mm-meta">Type: {project.medium || "Multimedia Asset"}</span>
      </div>

      {/* Dynamic Content Area */}
      <div className="mm-content-area">
        {project.image ? (
          <div className="mm-image-canvas">
            <img src={project.image} alt={project.title} draggable="false" />
          </div>
        ) : project.fileUrl ? (
          <div className="mm-text-reader">
            {textContent}
          </div>
        ) : (
          <div className="mm-text-reader" style={{ color: '#ff5555' }}>
            [ ERROR: No valid media source found for this file. ]
          </div>
        )}
      </div>
    </div>
  );
}