import { useState } from 'react';
import { useWindowSize } from './hooks/useWindowSize';
import './index.css';

// Import our new components
import PersonaToggle from './components/shared/PersonaToggle.jsx';
import ITDesktop from './components/desktop-render/ITDesktop.jsx';
import ArtistDesktop from './components/desktop-render/ArtistDesktop.jsx';

function App() {
  const [activePersona, setActivePersona] = useState('it');
  const { isMobile } = useWindowSize();

  const togglePersona = () => {
    setActivePersona(activePersona === 'it' ? 'artist' : 'it');
  };

  return (
    <div className={activePersona === 'artist' ? 'theme-artist app-wrapper' : 'app-wrapper'}>
      
      {/* The button is ALWAYS on screen */}
      <PersonaToggle currentPersona={activePersona} togglePersona={togglePersona} />

      {/* The Routing Logic */}
      {isMobile ? (
         // If they are on a phone, show a simple placeholder for now
         <div style={{ marginTop: '100px', textAlign: 'center' }}>
            <h1>Mobile View coming soon!</h1>
            <p>Please view on a desktop monitor for the full experience.</p>
         </div>
      ) : (
         // If they are on Desktop, check which persona is active
         activePersona === 'it' ? <ITDesktop /> : <ArtistDesktop />
      )}

    </div>
  );
}

export default App;