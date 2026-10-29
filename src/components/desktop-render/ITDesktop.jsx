import React, { useState, useEffect, useRef } from 'react';
import { itProjects } from '../../data/projects';
import DocxViewer from '../shared/DocxViewer.jsx';
import SocialBar from '../shared/SocialBar.jsx';
import PersonaToggle from '../shared/PersonaToggle.jsx';
import ProfessionalSidebar from '../shared/ProfessionalSidebar.jsx';
import '../../styles/it-desktop.css';
import '../../styles/professional-sidebar.css';

import professionalFirstName from '../../assets/shared/fiona-tag.png';
import professionalLastName  from '../../assets/shared/Reyes-tag.png';
import reactIcon   from '../../assets/shared/react.png';
import pythonIcon  from '../../assets/shared/python.png';
import jsIcon      from '../../assets/shared/javascript.png';
import sysArchIcon from '../../assets/shared/document.png';
import codingIcon  from '../../assets/shared/laptop.png';
import sysDocIcon  from '../../assets/shared/document.png';
import mmIcon      from '../../assets/shared/floppy.png';
import gameIcon    from '../../assets/shared/game.png';

// --- CUSTOM INTERACTIVE VIEWERS ---
import CPUSchedulerApp        from '../shared/CPU_Scheduling/CPUScheduler.jsx';
import TtrpgBookReader        from '../TTRPG/TtrpgBookReader.jsx';
import StevenUniverseApp      from '../shared/steven_universe/SU_winforms_native_react.jsx';
import TkinterInventoryApp    from '../shared/inventory_management/TkinterInventory.jsx';
import MockReportGeneratorApp from '../shared/Mock_Data_Generator/MockDataGenerator.jsx';
import WaveDocViewer          from '../shared/WaveDocViewer.jsx';
import DfdViewer              from '../shared/DfdViewer.jsx';
import MultimediaViewer       from '../shared/MultimediaViewer.jsx';
import CardDeckViewer         from '../shared/GameDevCards/CardDeckViewer.jsx';
import CapstoneViewer         from '../shared/CapstoneViewer.jsx';

const TECH_SKILLS = [
  { id: 'react',   label: 'React',      icon: reactIcon   },
  { id: 'python',  label: 'Python',     icon: pythonIcon  },
  { id: 'js',      label: 'JavaScript', icon: jsIcon      },
  { id: 'sysarch', label: 'UML',        icon: sysArchIcon },
];

const FOLDER_CATEGORIES = [
  { id: 'coding', label: 'Coding Projects',       icon: codingIcon, dataKey: 'Coding Projects'         },
  { id: 'sysdoc', label: 'System Documentations', icon: sysDocIcon, dataKey: 'System Documentation'    },
  { id: 'mm',     label: 'Multimedia',            icon: mmIcon,     dataKey: 'Multimedia Works'        },
  { id: 'game',   label: 'GameDev Assets',        icon: gameIcon,   dataKey: 'Game Development Assets' },
  // Empty for now. Any project in projects.js with category: "OJT Experience" shows up here automatically.
  { id: 'ojt',    label: 'OJT Experience',        icon: sysDocIcon, dataKey: 'OJT Experience'          },
];

// ── Professional bio (edit this text any time) ───────────────
const BIO =
  'A Bachelor of Science in Information Technology student at Pamantasan ng Lungsod ng Valenzuela who has completed her on-the-job training. ' +
  'Works across React, Python, and JavaScript, and backs her code with system documentation such as UML and data flow diagrams. ' +
  'Alongside development, she produces multimedia and game development assets, bringing a creative, critical, and detail-oriented approach to technical work.';

// ── helpers ──────────────────────────────────────────────────
const scrollToCategory = (id) => {
  const el = document.getElementById(`itd-cat-${id}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Picks the best thumbnail a project has. Returns null if it has none.
const getThumb = (p) =>
  p.previewImage ||
  p.image ||
  (p.images && p.images[0]) ||
  (p.cardData && p.cardData[0] && p.cardData[0].front) ||
  null;

const getFallbackGlyph = (p) => {
  if (p.fileUrl) return 'TXT';
  if (p.category === 'Coding Projects') return '</>';
  return 'DOC';
};

const renderViewer = (project) => {
  switch (project.customComponent) {
    case 'CPUSchedulerApp':        return <CPUSchedulerApp />;
    case 'MockReportGeneratorApp': return <MockReportGeneratorApp />;
    case 'StevenUniverseApp':      return <StevenUniverseApp />;
    case 'TkinterInventoryApp':    return <TkinterInventoryApp />;
    case 'WaveDocViewerApp':       return <WaveDocViewer />;
    case 'DfdImageViewerApp':      return <DfdViewer />;
    case 'MultimediaViewerApp':    return <MultimediaViewer project={project} />;
    case 'CardDeckViewerApp':      return <CardDeckViewer project={project} />;
    case 'CapstoneViewerApp':      return <CapstoneViewer />;
    case 'DocxViewerApp':          return <DocxViewer project={project} />;
    default:                       return <TtrpgBookReader />;
  }
};

// ── mini preview window ──────────────────────────────────────
const MiniWindow = ({ project, onOpen }) => {
  const thumb = getThumb(project);
  const tags = project.techStack && project.techStack.length
    ? project.techStack
    : (project.medium ? [project.medium] : []);

  return (
    <button type="button" className="itd-mini" onClick={() => onOpen(project)}>
      <span className="itd-mini-bar">
        <span className="itd-mini-title">{project.title}</span>
        <span className="itd-mini-ctrls" aria-hidden="true">
          <span className="itd-mini-ctrl" />
          <span className="itd-mini-ctrl" />
          <span className="itd-mini-ctrl" />
        </span>
      </span>

      <span className="itd-mini-thumb">
        {thumb ? (
          <img src={thumb} alt={project.title} loading="lazy" draggable="false" />
        ) : (
          <span className="itd-mini-fallback">
            <span className="itd-mini-glyph">{getFallbackGlyph(project)}</span>
            <span className="itd-mini-hint">Open to preview</span>
          </span>
        )}
      </span>

      <span className="itd-mini-info">
        {project.description ? <span className="itd-mini-desc">{project.description}</span> : null}
        {tags.length > 0 && (
          <span className="itd-mini-tags">
            {tags.slice(0, 3).map(t => <span key={t} className="itd-tech-tag">{t}</span>)}
          </span>
        )}
      </span>
    </button>
  );
};

// ── comet cursor + constellation trail (desktop pointers only) ─
// ── trail settings: edit these numbers ──────────────────────
const HEAD_DELAY_MS         = 0;      // 0 = the comet sits exactly on your real cursor. Raise it (e.g. 60) for a soft lag
const STAR_SPACING          = 18;     // px the comet travels before it leaves a star. Lower = fuller trail
const STAR_MIN_INTERVAL     = 35;     // ms between stars at most
const STAR_JITTER           = 3;      // px of random scatter around the cursor path
const STARS_PER_CONSTELLATION = 12;   // the trail is built in chunks of this many stars; each chunk fades together
const CONSTELLATION_PAUSE_MS  = 250;  // pause in movement that finishes the current chunk
const HOLD_MS               = 500;    // how long a finished chunk stays fully visible before fading (shorter = shorter trail)
const FADE_OUT_MS           = 700;    // the fade-out animation
const BURST_HOLD_MS         = 1500;   // the click constellation on previews lingers a bit longer than the hover trail
const STAR_FADE_IN_MS       = 250;    // each new star eases in over this long
const TWINKLE               = 0.3;    // how deep the twinkle goes. 0 = steady, 0.5 = strong
const TWINKLE_PERIOD_MS     = 2200;   // one full twinkle cycle (slower = calmer)
const MAX_GROUPS            = 14;
const MAX_LINK_DIST         = 170;    // longer lines are skipped so fast flicks don't draw long streaks
const LINE_ALPHA            = 0.6;    // brightness of lines between neighbouring stars
const LINE2_ALPHA           = 0.15;   // extra "triangle" lines. 0 = cleaner chain, higher = fuller web
const LINE_WIDTH            = 1;      // thickness of the bright core of each line (px)
const LINE_GLOW_WIDTH       = 5;      // extra width of the soft glow around each line (px). 0 = no line glow
const LINE_GLOW_ALPHA       = 0.2;    // brightness of that glow
const STAR_ALPHA            = 1;      // brightness of the star dots
const STAR_SIZE_MIN         = 1.2;    // star radius range (px)
const STAR_SIZE_MAX         = 2.6;
const STAR_GLOW             = 9;      // soft halo around each star. 0 = no halo
const HEAD_GLOW             = 0.22;   // brightness of the soft glow around the comet head
const HEAD_CORE             = 0.6;    // brightness of the comet head's centre dot

const POPUP_SELECTOR = '.psb-overlay, .itd-drawer--open';

const rand = (min, max) => min + Math.random() * (max - min);
const ease = (t) => t * t * (3 - 2 * t);   // smooth ease in and out, t from 0 to 1

const CursorTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const fine   = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    console.info('[CursorTrail] loaded. hold(ms):', HOLD_MS, 'spacing(px):', STAR_SPACING);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const groups = [];            // each group is one constellation
    let current = null;           // the constellation the comet is drawing right now
    const mouse = { x: 0, y: 0, seen: false, inside: true };
    const head  = { x: 0, y: 0, a: 0 };
    let lastDrop = { x: 0, y: 0, t: 0 };
    let raf = 0;
    let prevNow = 0;
    let popupOpen = false;
    let calm = 1;                 // 1 = trail visible, fades to 0 while a window is open

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const newGroup = (now, closedLoop, hold) => {
      const g = { stars: [], closedAt: 0, lastAdd: now, loop: !!closedLoop, hold: hold || HOLD_MS };
      groups.push(g);
      if (groups.length > MAX_GROUPS) groups.shift();
      return g;
    };

    const addStar = (g, x, y, r, fadeIn, now) => {
      g.stars.push({ x, y, r, fadeIn, born: now, seed: Math.random() * Math.PI * 2 });
      g.lastAdd = now;
    };

    const closeGroup = (g, now) => {
      if (!g.closedAt) g.closedAt = now;
      if (current === g) current = null;
    };

    // whole-constellation brightness: full while it's being drawn and during the hold, then one smooth fade
    const groupAlpha = (g, now) => {
      if (!g.closedAt) return 1;
      const age = now - g.closedAt;
      if (age <= g.hold) return 1;
      const t = (age - g.hold) / FADE_OUT_MS;
      return t >= 1 ? 0 : 1 - ease(t);
    };

    const starIn = (st, now) => ease(Math.min(1, (now - st.born) / st.fadeIn));

    const twinkle = (st, now) =>
      1 - TWINKLE + TWINKLE * (0.5 + 0.5 * Math.sin((now / TWINKLE_PERIOD_MS) * Math.PI * 2 + st.seed));

    const drawLink = (A, B, ga, now, strength) => {
      if (!A || !B) return;
      if (Math.hypot(A.x - B.x, A.y - B.y) > MAX_LINK_DIST) return;
      const a = ga * Math.min(starIn(A, now), starIn(B, now)) * strength;
      if (a < 0.01) return;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      if (LINE_GLOW_WIDTH > 0) {            // soft wide pass first, then the bright core on top
        ctx.lineWidth = LINE_WIDTH + LINE_GLOW_WIDTH;
        ctx.strokeStyle = `rgba(255,255,255,${a * LINE_GLOW_ALPHA})`;
        ctx.stroke();
      }
      ctx.lineWidth = LINE_WIDTH;
      ctx.strokeStyle = `rgba(255,255,255,${a})`;
      ctx.stroke();
    };

    const loop = (now) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // comet head follows the real cursor (exactly, when HEAD_DELAY_MS is 0)
      const dt = prevNow ? Math.min(now - prevNow, 50) : 16;
      prevNow = now;
      popupOpen = !!document.querySelector(POPUP_SELECTOR);
      calm += ((popupOpen ? 0 : 1) - calm) * 0.2;
      if (mouse.seen) {
        const follow = HEAD_DELAY_MS > 0 ? 1 - Math.exp(-dt / HEAD_DELAY_MS) : 1;
        head.x += (mouse.x - head.x) * follow;
        head.y += (mouse.y - head.y) * follow;
      }
      const headTarget = mouse.seen && mouse.inside && !popupOpen ? 1 : 0;
      head.a += (headTarget - head.a) * 0.1;

      // leave a star each time the comet has travelled far enough
      if (
        !popupOpen &&
        head.a > 0.3 &&
        Math.hypot(head.x - lastDrop.x, head.y - lastDrop.y) > STAR_SPACING &&
        now - lastDrop.t > STAR_MIN_INTERVAL
      ) {
        if (current && current.stars.length >= STARS_PER_CONSTELLATION) {
          // start the next chunk from the same spot (an invisible copy of the last star) so the line stays continuous
          const tail = current.stars[current.stars.length - 1];
          closeGroup(current, now);
          current = newGroup(now, false);
          current.stars.push({ ...tail, dup: true });
        }
        if (!current) current = newGroup(now, false);
        addStar(
          current,
          head.x + rand(-STAR_JITTER, STAR_JITTER),
          head.y + rand(-STAR_JITTER, STAR_JITTER),
          rand(STAR_SIZE_MIN, STAR_SIZE_MAX),
          STAR_FADE_IN_MS,
          now,
        );
        lastDrop = { x: head.x, y: head.y, t: now };
      }

      if (popupOpen && current) closeGroup(current, now);

      // a pause in movement finishes the constellation being drawn
      if (current && now - current.lastAdd > CONSTELLATION_PAUSE_MS) closeGroup(current, now);

      // forget constellations that have fully faded out
      for (let i = groups.length - 1; i >= 0; i--) {
        const g = groups[i];
        if (g.closedAt && now - g.closedAt > g.hold + FADE_OUT_MS) groups.splice(i, 1);
      }

      // lines first, then stars on top
      ctx.lineCap = 'round';
      for (const g of groups) {
        const ga = groupAlpha(g, now) * calm;
        const st = g.stars;
        for (let i = 1; i < st.length; i++) {
          drawLink(st[i], st[i - 1], ga, now, LINE_ALPHA);
          if (i > 1) drawLink(st[i], st[i - 2], ga, now, LINE2_ALPHA);
        }
        if (g.loop && st.length > 2) drawLink(st[st.length - 1], st[0], ga, now, LINE_ALPHA);
      }

      // faint line from the comet head to the newest star
      if (current && current.stars.length && head.a > 0.05) {
        const last = current.stars[current.stars.length - 1];
        const a = starIn(last, now) * 0.08 * head.a;
        if (a > 0.01) {
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.lineWidth = LINE_WIDTH;
          ctx.beginPath();
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(head.x, head.y);
          ctx.stroke();
        }
      }

      // stars: bright dot with a soft halo; larger ones also get a sparkle. They twinkle, the lines stay steady.
      const bigStar = STAR_SIZE_MIN + 0.7 * (STAR_SIZE_MAX - STAR_SIZE_MIN);
      ctx.shadowColor = 'rgba(255,255,255,0.9)';
      for (const g of groups) {
        const ga = groupAlpha(g, now) * calm;
        for (const st of g.stars) {
          if (st.dup) continue;
          const a = ga * starIn(st, now) * twinkle(st, now);
          if (a < 0.01) continue;
          ctx.shadowBlur = STAR_GLOW * a;
          ctx.fillStyle = `rgba(255,255,255,${Math.min(1, a * STAR_ALPHA)})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fill();
          if (st.r > bigStar) {
            const len = st.r * 2.4;
            ctx.shadowBlur = 0;
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(st.x - len, st.y); ctx.lineTo(st.x + len, st.y);
            ctx.moveTo(st.x, st.y - len); ctx.lineTo(st.x, st.y + len);
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      // comet head: soft glow + small core
      if (head.a > 0.02) {
        const gr = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
        gr.addColorStop(0, `rgba(255,255,255,${HEAD_GLOW * head.a})`);
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${HEAD_CORE * head.a})`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      const settling =
        (mouse.seen && Math.hypot(mouse.x - head.x, mouse.y - head.y) > 0.5) ||
        Math.abs(headTarget - head.a) > 0.02 ||
        Math.abs((popupOpen ? 0 : 1) - calm) > 0.02;
      if (groups.length || settling) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0; // idle: stop drawing until the next move or click
        prevNow = 0;
        if (head.a < 0.05) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const onMove = (e) => {
      if (!mouse.seen) {
        head.x = e.clientX;
        head.y = e.clientY;
        lastDrop = { x: e.clientX, y: e.clientY, t: performance.now() };
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.seen = true;
      mouse.inside = true;
      start();
    };

    const onLeave = () => {
      mouse.inside = false;
      if (current) closeGroup(current, performance.now());
      start();
    };

    // click on a preview: a small closed constellation blooms around the click point
    const onDown = (e) => {
      setTimeout(start, 150);   // re-check shortly after any click, in case it opened a window
      const t = e.target;
      if (!(t.closest && t.closest('.itd-mini'))) return;
      const now = performance.now();
      const g = newGroup(now, true, BURST_HOLD_MS);
      const n = 6;
      const base = Math.random() * Math.PI * 2;
      for (let k = 0; k < n; k++) {
        const ang = base + (k / n) * Math.PI * 2 + rand(-0.3, 0.3);
        const d = rand(16, 42);
        addStar(
          g,
          e.clientX + Math.cos(ang) * d,
          e.clientY + Math.sin(ang) * d,
          rand(STAR_SIZE_MIN, STAR_SIZE_MAX),
          250,
          now,
        );
      }
      g.closedAt = now;
      start();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('resize', resize);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', resize);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="itd-cursor-canvas" aria-hidden="true" />;
};

// ── page ─────────────────────────────────────────────────────
const ITDesktop = ({ togglePersona }) => {
  const [activeProject, setActiveProject] = useState(null);
  const [showMoreInfo,  setShowMoreInfo]  = useState(false);

  // Deep link: ?folder=coding&file=it-1 scrolls to the category and opens the project.
  // The category is checked too, because "mm-15" exists in two categories.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const folder = FOLDER_CATEGORIES.find(f => f.id === params.get('folder'));
    if (!folder) return undefined;

    const fileParam = params.get('file');
    const project = fileParam
      ? itProjects.find(p => p.id === fileParam && p.category === folder.dataKey)
      : null;
    if (project) setActiveProject(project);

    const t = setTimeout(() => scrollToCategory(folder.id), 150);
    return () => clearTimeout(t);
  }, []);

  // Viewer open: Esc closes it, and the page behind stops scrolling.
  useEffect(() => {
    if (!activeProject) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setActiveProject(null); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeProject]);

  const closeProject = () => setActiveProject(null);

  // Prev / next within the SAME category only (no wrap-around, never jumps to another category)
  const categoryItems = activeProject
    ? itProjects.filter(p => p.category === activeProject.category)
    : [];
  const activeIndex = activeProject ? categoryItems.indexOf(activeProject) : -1;
  const prevProject = activeIndex > 0 ? categoryItems[activeIndex - 1] : null;
  const nextProject =
    activeIndex >= 0 && activeIndex < categoryItems.length - 1
      ? categoryItems[activeIndex + 1]
      : null;

  return (
    <div className="itd-page">
      <CursorTrail />
      {/* ── TOP NAVBAR ── (no backdrop-filter here: it would trap the sidebar's fixed modals) */}
      <header className="itd-nav">
        {/* Brand: full name on desktop, "FR" on tablet (swapped in CSS) */}
        <button
          type="button"
          className="itd-nav-brand"
          onClick={scrollToTop}
          aria-label="Fiona Reyes, back to top"
          title="Fiona Reyes"
        >
          <span className="itd-nav-brand-full">Fiona Reyes</span>
          <span className="itd-nav-brand-short" aria-hidden="true">FR</span>
        </button>

        {/* Category links: text on desktop, icon only on tablet (swapped in CSS) */}
        <nav className="itd-nav-links" aria-label="Portfolio sections">
          {FOLDER_CATEGORIES.map(folder => (
            <button
              key={folder.id}
              type="button"
              className="itd-nav-link"
              onClick={() => scrollToCategory(folder.id)}
              aria-label={folder.label}
              title={folder.label}
            >
              <img src={folder.icon} alt="" className="itd-nav-link-icon" draggable="false" />
              <span className="itd-nav-link-text">{folder.label}</span>
            </button>
          ))}
        </nav>

        <ProfessionalSidebar variant="itnav" />
      </header>

      <div className="itd-container">
        <aside className="itd-left-column">
          <div className="itd-skills-box-container">
            <div className="itd-skills-grid-wrapper">
              {TECH_SKILLS.map(skill => (
                <div key={skill.id} className="itd-skill-icon">
                  <div className="itd-skill-circle">
                    <img src={skill.icon} alt={skill.label} className="itd-skill-img" />
                  </div>
                  <span className="itd-skill-label">{skill.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="itd-main">
          <div className="itd-name-block">
            <img src={professionalFirstName} alt="Fiona" className="itd-name-first" draggable="false" />
            <PersonaToggle currentPersona="it" togglePersona={togglePersona} isInline={true} />
            <img src={professionalLastName}  alt="Reyes" className="itd-name-last"  draggable="false" />
          </div>

          <p className="itd-tagline">{BIO}</p>

          <button className="itd-show-more" type="button" onClick={() => setShowMoreInfo(v => !v)}>
            {showMoreInfo ? '∧ Hide Information' : 'v Show More Information'}
          </button>

          {showMoreInfo && (
            <div className="itd-more-info-panel">
              <p> Valenzuela City, Philippines</p>
              <p> Bachelor of Science in Information Technology</p>
              <p> Expected graduation: 2027</p>
              <p> On-the-job training: Completed</p>
            </div>
          )}

          <h2 className="itd-section-heading">Professional / School Works</h2>

          {/* ── CATEGORIES, STACKED VERTICALLY ── */}
          <div className="itd-works">
            {FOLDER_CATEGORIES.map(folder => {
              const items = itProjects.filter(p => p.category === folder.dataKey);
              return (
                <section key={folder.id} id={`itd-cat-${folder.id}`} className="itd-category">
                  <div className="itd-category-head">
                    <img src={folder.icon} alt="" className="itd-category-icon" draggable="false" />
                    <h3 className="itd-category-title">{folder.label}</h3>
                    <span className="itd-category-count">{items.length} item{items.length === 1 ? '' : 's'}</span>
                  </div>

                  {items.length > 0 ? (
                    <div className="itd-mini-grid">
                      {items.map((project, i) => (
                        <MiniWindow
                          key={`${folder.id}-${project.id}-${i}`}
                          project={project}
                          onOpen={setActiveProject}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="itd-empty-dir itd-category-empty">Nothing here yet. New work will be added soon.</div>
                  )}
                </section>
              );
            })}
          </div>
        </main>

        <div className="itd-bottom-bar">
          <SocialBar />
        </div>
      </div>

      {/* ── FULL VIEWER ── */}
      {activeProject && (
        <div className="psb-overlay">
          <div className="psb-window itd-viewer-window">
            <div className="psb-header">
              <span className="psb-title">🗁 {activeProject.title}</span>
              <button type="button" className="psb-close-btn" onClick={closeProject}>✕</button>
            </div>

            <div className="psb-body itd-detail-body">
              {activeProject.isCustomViewer ? (
                // key forces a fresh viewer for every work, so state never carries over between projects
                <div
                  key={`${activeProject.category}-${activeProject.id}`}
                  style={{ display: 'contents' }}
                >
                  {renderViewer(activeProject)}
                </div>
              ) : (
                <React.Fragment key={`${activeProject.category}-${activeProject.id}`}>
                  <img src={activeProject.previewImage} alt={activeProject.title} className="itd-detail-preview-img" />
                  <div className="itd-detail-info">
                    <p className="itd-proj-category">{activeProject.category}</p>
                    <h2 className="itd-proj-title">{activeProject.title}</h2>
                    <p className="itd-proj-desc">{activeProject.description}</p>
                    <div className="itd-tech-stack">
                      {(activeProject.techStack || []).map(tech => (
                        <span key={tech} className="itd-tech-tag">{tech}</span>
                      ))}
                    </div>
                    <div className="itd-project-links">
                      {activeProject.demoLink && (
                        <a href={activeProject.demoLink} target="_blank" rel="noopener noreferrer" className="psb-btn psb-btn--muted">Live Demo →</a>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>

            <div className="psb-footer itd-viewer-footer">
              <div className="itd-viewer-nav" role="group" aria-label={`Browse ${activeProject.category}`}>
                <button
                  type="button"
                  className="psb-btn psb-btn--muted itd-viewer-arrow"
                  onClick={() => prevProject && setActiveProject(prevProject)}
                  disabled={!prevProject}
                  aria-label="Previous work"
                >
                  ◀
                </button>
                <span className="itd-viewer-count">
                  {activeIndex + 1} / {categoryItems.length}
                </span>
                <button
                  type="button"
                  className="psb-btn psb-btn--muted itd-viewer-arrow"
                  onClick={() => nextProject && setActiveProject(nextProject)}
                  disabled={!nextProject}
                  aria-label="Next work"
                >
                  ▶
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITDesktop;