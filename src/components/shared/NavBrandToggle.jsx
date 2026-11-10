import React, { useEffect, useRef } from 'react';

const DOUBLE_CLICK_MS = 260;   // how long to wait for a second click before treating it as "home"

const NavBrandToggle = ({ isLight, onToggleTheme, onHome, children }) => {
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = (e) => {
    // Shift + click (or Shift + Enter) switches the theme immediately
    if (e.shiftKey) {
      clearTimeout(timer.current);
      timer.current = null;
      onToggleTheme();
      return;
    }
    // second click inside the window = double click = switch theme
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      onToggleTheme();
      return;
    }
    // first click: wait briefly in case a second one follows, otherwise go home
    timer.current = setTimeout(() => {
      timer.current = null;
      onHome();
    }, DOUBLE_CLICK_MS);
  };

  const next = isLight ? 'dark' : 'light';
  const hint = `Click once: back to top. Double-click: switch to ${next} mode`;

  return (
    <div className="itd-nav-brand-group">
      <button
        type="button"
        className="itd-nav-brand"
        onClick={handleClick}
        title={hint}
        aria-label={`${hint}. Shift + Enter also switches to ${next} mode.`}
      >
        {children}
        <span className="itd-nav-brand-pip" aria-hidden="true" />
      </button>
    </div>
  );
};

export default NavBrandToggle;