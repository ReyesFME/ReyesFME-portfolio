import React, { useState, useEffect, useRef } from 'react';
import { ttrpgPages } from '../../data/ttrpgDevDraft';
import '../../styles/ttrpg-styles.css';

/* ─── Faction detection ──────────────────────────────────────────────────── */
const BATHALA_PAGES = [4,5,6,7,8,9,10];
const BATHRAWARKA_PAGES = [2,11,17,18];

const BATHALA_KEYWORDS = [
  'bathala','gahumagias','animatos','katalonan','basbas','kalag',
  'hikmarúm','hanunoo','dalaketnon','abiyan','paratabog','parayen',
  'paratambal','daylight','dawnspring','daybreak','celestial',
  'white magic','healing magic','divinatory','sanctif','divine',
  'forgotten gods','anito','diwata','pintados','bathala',
];
const BATHRAWARKA_KEYWORDS = [
  'bathrawarka','corruption','dark sect','dark sects','necromancy',
  'kulam','barang','rift','void','corrupted','corruption channel',
  'shadows of bathrawarka','black magic','forbidden','night surge',
  'ritual miscast','cosmic anomaly',
];

function detectFaction(page) {
  if (BATHALA_PAGES.includes(page.id)) return 'celestial';
  if (BATHRAWARKA_PAGES.includes(page.id)) return 'void';
  if (page.faction === 'BATHALA') return 'celestial';
  if (page.faction === 'BATHRAWARKA') return 'void';

  const lower = (page.title + ' ' + page.content).toLowerCase();
  const voidScore  = BATHRAWARKA_KEYWORDS.filter(k => lower.includes(k)).length;
  const sunScore   = BATHALA_KEYWORDS.filter(k => lower.includes(k)).length;

  if (voidScore > sunScore && voidScore >= 2) return 'void';
  if (sunScore  > voidScore && sunScore  >= 2) return 'celestial';
  return 'neutral';
}

/* ─── Skill-entry detection ──────────────────────────────────────────────── */
function isSkillBlock(lines, startIdx) {
  for (let i = startIdx + 1; i < Math.min(startIdx + 5, lines.length); i++) {
    if (/^Core Stat:/i.test(lines[i].trim())) return true;
  }
  return false;
}

/* ─── Keyword highlighter ────────────────────────────────────────────────── */
function highlightKeywords(text, faction) {
  if (typeof text !== 'string') return text;
  const allKeywords = [...new Set([...BATHALA_KEYWORDS, ...BATHRAWARKA_KEYWORDS])];
  const escaped = allKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);
  return parts.map((part, idx) => {
    const lower = part.toLowerCase();
    if (BATHRAWARKA_KEYWORDS.some(k => lower === k)) return <span key={idx} className="slv-kw-void">{part}</span>;
    if (BATHALA_KEYWORDS.some(k => lower === k))     return <span key={idx} className="slv-kw-celestial">{part}</span>;
    return part;
  });
}

/* ─── Table component ────────────────────────────────────────────────────── */
function TerminalTable({ lines, faction }) {
  const rows = lines
    .filter(l => !/^\|[-|:\s]+\|$/.test(l.trim()))
    .map(l =>
      l.trim().replace(/^\|/, '').replace(/\|$/, '')
        .split('|').map(c => c.trim())
    );
  if (rows.length === 0) return null;
  const [header, ...body] = rows;
  return (
    <div className="slv-table-wrapper">
      <table className="slv-table">
        <thead>
          <tr>{header.map((cell, ci) => <th key={ci} className="slv-th">{highlightKeywords(cell, faction)}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'slv-tr-even' : 'slv-tr-odd'}>
              {row.map((cell, ci) => <td key={ci} className="slv-td">{highlightKeywords(cell, faction)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Skill block ────────────────────────────────────────────────────────── */
function SkillBlock({ lines, faction }) {
  const [titleLine, ...rest] = lines;
  const skillName = titleLine.replace(/^\d+\.\s/, '').trim();
  const fields = {};
  rest.forEach(line => {
    const m = line.match(/^(Core Stat|Usage\/Roll|Effect\/Bonus|Drawback\/Risk):\s*(.+)/);
    if (m) fields[m[1]] = m[2];
  });
  const labels = ['Core Stat','Usage/Roll','Effect/Bonus','Drawback/Risk'];
  const hasFields = Object.keys(fields).length > 0;
  return (
    <div className="slv-skill-block">
      <div className="slv-skill-name">
        <span className="slv-skill-num">◆</span>
        {highlightKeywords(skillName, faction)}
      </div>
      {hasFields ? (
        <div className="slv-skill-fields">
          {labels.map(label => fields[label] ? (
            <div key={label} className="slv-skill-row">
              <span className="slv-skill-label">{label}:</span>
              <span className="slv-skill-value">{highlightKeywords(fields[label], faction)}</span>
            </div>
          ) : null)}
        </div>
      ) : (
        rest.map((line, i) => (
          <div key={i} className="slv-line slv-indent">{highlightKeywords(line, faction)}</div>
        ))
      )}
    </div>
  );
}

/* ─── Character stat card ────────────────────────────────────────────────── */
function StatCard({ label, value, faction }) {
  return (
    <div className="slv-stat-card">
      <div className="slv-stat-label">{label}</div>
      <div className="slv-stat-value">{highlightKeywords(value, faction)}</div>
    </div>
  );
}

/* ─── Premade character card ─────────────────────────────────────────────── */
function CharacterTable({ lines, faction }) {
  const rows = lines
    .filter(l => !/^\|[-|:\s]+\|$/.test(l.trim()))
    .map(l =>
      l.trim().replace(/^\|/, '').replace(/\|$/, '')
        .split('|').map(c => c.trim())
    );
  if (rows.length === 0) return null;
  const [, ...body] = rows;
  return (
    <div className="slv-char-grid">
      {body.map((row, ri) => (
        <div key={ri} className="slv-char-card">
          <div className="slv-char-class">{row[0]}</div>
          <div className="slv-char-row"><span className="slv-char-field">Weapon</span><span>{row[1]}</span></div>
          <div className="slv-char-row"><span className="slv-char-field">Slots</span><span>{row[2]}</span></div>
          <div className="slv-char-row"><span className="slv-char-field">Starter</span><span>{highlightKeywords(row[3], faction)}</span></div>
          <div className="slv-char-row"><span className="slv-char-field">Buff</span><span className="slv-char-buff">{row[4]}</span></div>
        </div>
      ))}
    </div>
  );
}

/* ─── Numbered step block ────────────────────────────────────────────────── */
function NumberedStepList({ items, faction }) {
  return (
    <div className="slv-step-list">
      {items.map((item, idx) => (
        <div key={idx} className="slv-step-item">
          <div className="slv-step-header">
            <span className="slv-step-num">{String(idx + 1).padStart(2,'0')}</span>
            <span className="slv-step-title">{highlightKeywords(item.title, faction)}</span>
          </div>
          {item.subs.length > 0 && (
            <div className="slv-step-subs">
              {item.subs.map((sub, si) => (
                <div key={si} className="slv-step-sub">
                  <span className="slv-step-sub-marker">—</span>
                  <span>{highlightKeywords(sub, faction)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Stat formula display ───────────────────────────────────────────────── */
function StatFormulaGrid({ lines, faction }) {
  const rows = lines
    .filter(l => !/^\|[-|:\s]+\|$/.test(l.trim()))
    .map(l =>
      l.trim().replace(/^\|/, '').replace(/\|$/, '')
        .split('|').map(c => c.trim())
    )
    .filter(r => r.length >= 2 && r[0] !== 'Stat');
  return (
    <div className="slv-formula-grid">
      {rows.map((row, i) => (
        <div key={i} className="slv-formula-row">
          <span className="slv-formula-stat">{row[0]}</span>
          <span className="slv-formula-eq">=</span>
          <span className="slv-formula-val">{row[1]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Content parser ─────────────────────────────────────────────────────── */
function parseContent(raw, faction, pageId) {
  const lines = raw.split('\n');
  const nodes = [];
  let i = 0;
  let key = 0;

  const isPremadeChars = pageId === 27;
  const isStatFormulas = pageId === 15;

  function collectStepItems(startIdx) {
    const items = [];
    let j = startIdx;
    while (j < lines.length) {
      const line = lines[j];
      const stepMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (!stepMatch) break;
      const title = stepMatch[2].trim();
      j++;
      const subs = [];
      while (j < lines.length) {
        const sub = lines[j].trim();
        if (sub === '') { j++; break; }
        if (/^\d+\.\s/.test(sub)) break;
        if (/^\[/.test(sub)) break;
        if (sub.startsWith('|')) break;
        if (/^[-–]\s/.test(sub) || /^\s+[-–]\s/.test(lines[j])) {
          subs.push(sub.replace(/^[-–]\s/, '').trim());
          j++;
        } else {
          j++;
        }
      }
      items.push({ title, subs });
    }
    return { items, endIdx: j };
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^\[.+\]$/.test(trimmed)) {
      const label = trimmed.slice(1, -1);
      nodes.push(
        <div key={key++} className="slv-section-header">
          <span className="slv-section-bracket">[</span>
          <span className="slv-section-label">{label}</span>
          <span className="slv-section-bracket">]</span>
        </div>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      if (isPremadeChars && tableLines.length > 1) {
        nodes.push(<CharacterTable key={key++} lines={tableLines} faction={faction} />);
      } else if (isStatFormulas && tableLines[0]?.includes('Formula')) {
        nodes.push(<StatFormulaGrid key={key++} lines={tableLines} faction={faction} />);
      } else {
        nodes.push(<TerminalTable key={key++} lines={tableLines} faction={faction} />);
      }
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      if (isSkillBlock(lines, i)) {
        const skillLines = [line];
        i++;
        while (
          i < lines.length &&
          lines[i].trim() !== '' &&
          !/^\[.+\]$/.test(lines[i].trim()) &&
          !/^\d+\.\s/.test(lines[i].trim()) &&
          !lines[i].trim().startsWith('|')
        ) {
          skillLines.push(lines[i]);
          i++;
        }
        nodes.push(<SkillBlock key={key++} lines={skillLines} faction={faction} />);
      } else {
        const { items, endIdx } = collectStepItems(i);
        if (items.length > 0) {
          nodes.push(<NumberedStepList key={key++} items={items} faction={faction} />);
          i = endIdx;
        } else {
          nodes.push(<div key={key++} className="slv-line">{highlightKeywords(line, faction)}</div>);
          i++;
        }
      }
      continue;
    }

    if (/^[-–•]\s/.test(trimmed) || /^\s{2,}[-–]\s/.test(line)) {
      const text = trimmed.replace(/^[-–•]\s/, '');
      const isIndented = /^\s{3,}/.test(line);
      nodes.push(
        <div key={key++} className={`slv-bullet ${isIndented ? 'slv-bullet--indented' : ''}`}>
          <span className="slv-bullet-marker">▸</span>
          <span>{highlightKeywords(text, faction)}</span>
        </div>
      );
      i++;
      continue;
    }

    if (/^[a-z]\.\s/.test(trimmed) || /^\s+[ivx]+\.\s/.test(line)) {
      nodes.push(
        <div key={key++} className="slv-bullet slv-bullet--alpha">
          <span className="slv-bullet-marker-alpha">{trimmed.match(/^([a-z])\./)?.[1] ?? '·'}</span>
          <span>{highlightKeywords(trimmed.replace(/^[a-z]\.\s/, ''), faction)}</span>
        </div>
      );
      i++;
      continue;
    }

    if (trimmed === '') {
      nodes.push(<div key={key++} className="slv-spacer" />);
      i++;
      continue;
    }

    nodes.push(
      <div key={key++} className="slv-line">{highlightKeywords(line, faction)}</div>
    );
    i++;
  }

  return nodes;
}

/* ─── Boot sequence config ───────────────────────────────────────────────── */
const BOOT_LINES = [
  { text: 'INITIALIZING ARCHIVE SYSTEM...',         charDelay: 22,  pauseAfter: 80   },
  { text: 'RETRIEVING ARCHIVED PAGES...',           charDelay: 22,  pauseAfter: 80   },
  { text: 'UNCURSING THE MACHINE...PLEASE WAIT...', charDelay: 28,  pauseAfter: 500  },
  { text: '.....', charDelay: 140, pauseAfter: 160, spooky: true },
  { text: '.....', charDelay: 140, pauseAfter: 160, spooky: true },
  { text: '.....', charDelay: 140, pauseAfter: 160, spooky: true },
  { text: '.....', charDelay: 140, pauseAfter: 160, spooky: true },
  { text: '.....', charDelay: 140, pauseAfter: 500, spooky: true },
  { text: 'MACHINE 90% SAFE FOR TRANSMISSION.',     charDelay: 24,  pauseAfter: 160  },
];

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/* ─── Typewriter boot component ──────────────────────────────────────────── */
function BootScreen({ total, onDone }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [spookyLevel, setSpookyLevel]   = useState(0); // 0–5
  const spookyCount = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function runSequence() {
      for (let li = 0; li < BOOT_LINES.length; li++) {
        if (cancelled) return;
        const { text, charDelay, pauseAfter, spooky } = BOOT_LINES[li];

        // Append empty slot for this line
        setVisibleLines(prev => [...prev, { text: '', done: false, spooky: !!spooky }]);

        // Type character by character
        for (let ci = 1; ci <= text.length; ci++) {
          if (cancelled) return;
          await delay(charDelay);
          setVisibleLines(prev => {
            const next = [...prev];
            next[li] = { ...next[li], text: text.slice(0, ci) };
            return next;
          });
        }

        // Mark done (drops inline cursor from this line)
        setVisibleLines(prev => {
          const next = [...prev];
          next[li] = { ...next[li], done: true };
          return next;
        });

        // Ratchet shadow level on spooky lines
        if (spooky) {
          spookyCount.current = Math.min(spookyCount.current + 1, 5);
          setSpookyLevel(spookyCount.current);
        }

        await delay(pauseAfter);
      }

      // Final blinking prompt line
      if (!cancelled) {
        setVisibleLines(prev => [
          ...prev,
          { text: `LOADING DOCUMENTS [${total}]`, done: false, spooky: false, blink: true },
        ]);
        await delay(900);
        if (!cancelled) onDone();
      }
    }

    runSequence();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={`slv-root slv-theme-neutral slv-boot-spooky-${spookyLevel}`}>
      <div className="slv-boot">
        {visibleLines.map((line, idx) => (
          <div
            key={idx}
            className={[
              'slv-boot-line',
              'slv-boot-line--visible',
              line.spooky ? 'slv-boot-line--spooky' : '',
              line.blink  ? 'slv-boot-blink' : '',
            ].filter(Boolean).join(' ')}
          >
            {line.text}
            {!line.done && !line.blink && <span className="slv-boot-cursor" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main viewer ────────────────────────────────────────────────────────── */
export default function SystemLogViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal]         = useState('1');
  const [booting, setBooting]           = useState(true);
  const [glitch, setGlitch]             = useState(false);
  const contentRef = useRef(null);

  const total   = ttrpgPages.length;
  const page    = ttrpgPages[currentIndex];
  const faction = detectFaction(page);

  useEffect(() => {
    setInputVal(String(currentIndex + 1));
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentIndex]);

  /* Bathrawarka glitch every 30s */
  useEffect(() => {
    if (faction !== 'void') return;
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 400);
    }, 30000);
    return () => clearInterval(interval);
  }, [faction]);

  function goTo(idx) {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setCurrentIndex(clamped);
  }

  function handleExecute() {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n)) goTo(n - 1);
  }

  const themeClass =
    faction === 'celestial' ? 'slv-theme-celestial' :
    faction === 'void'      ? 'slv-theme-void' :
                              'slv-theme-neutral';

  if (booting) {
    return <BootScreen total={total} onDone={() => setBooting(false)} />;
  }

  return (
    <div className={`slv-root ${themeClass} ${glitch ? 'slv-glitch' : ''}`}>
      <div className="slv-header">
        <div className="slv-header-pre-text">
          <span className="slv-header-prefix">ARCHIVE</span>
          <span className="slv-header-page">PAGE {currentIndex + 1}/{total}</span>
        </div>
        <div className="slv-header-title-container">
          <span className="slv-header-title">{page.title.toUpperCase()}</span>
        </div>
      </div>



      {faction !== 'neutral' && (
        <div className={`slv-faction-badge slv-faction-${faction}`}>
          {faction === 'celestial' ? '☀ BATHALA DOMAIN DETECTED' : '* BATHRAWARKA DOMAIN DETECTED'}
        </div>
      )}

      <div className="slv-content" ref={contentRef}>
        <div className="slv-content-inner">
          {parseContent(page.content, faction, page.id)}
        </div>
      </div>

      <div className="slv-footer">
        <div className="slv-footer-left">
          <span className="slv-prompt">&gt;_</span>
          <input
            className="slv-page-input"
            type="number"
            min={1}
            max={total}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleExecute()}
          />
          <button className="slv-execute-btn" onClick={handleExecute}>EXECUTE</button>
        </div>
        <div className="slv-footer-right">
          <button className="slv-nav-btn" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}>◄ PREV</button>
          <span className="slv-page-counter">{currentIndex + 1} / {total}</span>
          <button className="slv-nav-btn" onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === total - 1}>NEXT ►</button>
        </div>
      </div>
    </div>
  );
}