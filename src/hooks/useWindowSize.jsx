import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  // Set up the state to hold the exact dimensions of the booleans
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false, 
    isShortScreen: false, 
  });

  useEffect(() => {
    //The function that calculates the size every time the screen shifts
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        
        // Width breakpoint: True if the screen is narrower than 768px (standard mobile)
        isMobile: window.innerWidth < 768,
        
        // Height breakpoint: True if the screen is shorter than 600px
        isShortScreen: window.innerHeight < 600, 
      });
    }

    // Attach the listener to the browser window
    window.addEventListener("resize", handleResize);
    
    // Run immediately on the first load
    handleResize(); 

    // Clean up the listener when navigating away (prevents memory leaks!)
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 6. Return the data so any component can use it
  return windowSize;
};