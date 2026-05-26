import React, { useState, useEffect } from 'react';
import '../../../styles/card-viewer.css';

export default function CardDeckViewer({ project }) {
  const [cards, setCards] = useState([]);
  const [isSpread, setIsSpread] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Initialize cards
  useEffect(() => {
    if (project && project.cardData && project.cardBacks) {
      const initialCards = project.cardData.map((data, index) => {
        const correctBackImage = project.cardBacks[data.type] || project.cardBacks[Object.keys(project.cardBacks)[0]];

        return {
          id: `card-${index}`,
          front: data.front,
          back: correctBackImage, 
          rot: (Math.random() * 10) - 5,
          isFlipped: false
        };
      });
      setCards(initialCards);
    }
  }, [project]);

  // Flip a specific card
  const handleCardClick = (clickedId) => {
    setCards(prevCards => prevCards.map(card => 
      card.id === clickedId ? { ...card, isFlipped: !card.isFlipped } : card
    ));
  };

  // --- Cycle Cards Logic ---
  const handleNextCard = () => {
    setCards(prev => {
      if (prev.length <= 1) return prev;
      const newCards = [...prev];
      const topCard = newCards.pop(); 
      newCards.unshift({ ...topCard, isFlipped: false }); // Flips face-down when moved to bottom
      return newCards;
    });
  };

  const handlePrevCard = () => {
    setCards(prev => {
      if (prev.length <= 1) return prev;
      const newCards = [...prev];
      const bottomCard = newCards.shift(); 
      newCards.push({ ...bottomCard, isFlipped: false }); // Flips face-down when moved to top
      return newCards;
    });
  };

  // --- Shuffle Algorithm ---
  const shuffleDeck = () => {
    if (isSpread) setIsSpread(false);
    
    // Immediately force all cards face-down before the animation starts
    setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })));
    
    setIsShuffling(true);

    // Perform the actual array shuffle and rotation while they are moving
    setTimeout(() => {
      setCards(prevCards => {
        const newDeck = [...prevCards];
        for (let i = newDeck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck.map(card => ({
          ...card,
          rot: (Math.random() * 10) - 5
        }));
      });
      setIsShuffling(false);
    }, 400); 
  };

  if (!project || !project.cardData) {
    return <div style={{ color: 'red', padding: '20px' }}>[ ERROR: No cardData found in project ]</div>;
  }

  return (
    <div className="card-viewer-container">
      {/* Controls */}
      <div className="card-controls">
        <button className="card-btn" onClick={shuffleDeck} disabled={isShuffling}>
          SHUFFLE DECK
        </button>
        <button className="card-btn" onClick={() => setIsSpread(!isSpread)}>
          {isSpread ? "STACK CARDS" : "SPREAD CARDS"}
        </button>
      </div>

      {/* Play Area */}
      <div className={`card-play-area ${isSpread ? 'card-spread' : 'card-stack'} ${isShuffling ? 'is-shuffling' : ''}`}>
        
        {/* Previous Button (Left) */}
        {!isSpread && (
          <button className="deck-arrow deck-arrow-left" onClick={handlePrevCard} title="Previous Card">
            &#10094;
          </button>
        )}

        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className={`playing-card ${card.isFlipped ? 'is-flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
            style={{ 
              zIndex: index,
              transform: isSpread ? 'none' : `rotate(${card.rot}deg)`,
              '--rand-x': (Math.random() * 100) - 50,
              '--rand-y': (Math.random() * 100) - 50,
              '--rand-rot': (Math.random() * 20) - 10,
            }}
          >
            <div className="card-inner">
              <div className="card-front">
                <img src={card.front} alt="Card Front" />
              </div>
              <div className="card-back">
                <img src={card.back} alt="Card Back" />
              </div>
            </div>
          </div>
        ))}

        {/* Next Button (Right) */}
        {!isSpread && (
          <button className="deck-arrow deck-arrow-right" onClick={handleNextCard} title="Next Card">
            &#10095;
          </button>
        )}
        
      </div>
    </div>
  );
}