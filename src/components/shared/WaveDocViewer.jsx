import React, { useState, useRef, useEffect } from 'react';
import { waveDocuments, gddPages, pipelinePages } from '../../data/waveDocPages';
import '../../styles/wave-doc-viewer.css';

// ─── Keyword sets ─────────────────────────────────────────────────────────────
const WAVE_KW  = ['w.a.v.e.','wave','david gretenburgoh','alfonse muir','frishco',
                  'blessing','sailfish','turtle','jellyfish','swordfish','octopus',
                  'net','skimmer','collection','thriving','recovery','gear',
                  'pelagic','marine','ocean','clean','coral'];
const DRAIN_KW = ['d.r.a.i.n.','drain','vår montrose','pollution','hazard',
                  'toxic','sludge','oil','metal','plastic','trash','debris',
                  'harpoon','ghost nets','boss','damage','corrupt','waste',
                  'industrial','illegal','dump'];

function highlightKeywords(text) {
  if (typeof text !== 'string') return text;
  const all = [...new Set([...WAVE_KW, ...DRAIN_KW])];
  const escaped = all.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const lower = part.toLowerCase();
    if (DRAIN_KW.some(k => lower === k)) return <span key={i} className="wdv-kw-drain">{part}</span>;
    if (WAVE_KW.some(k => lower === k))  return <span key={i} className="wdv-kw-wave">{part}</span>;
    return part;
  });
}

// ─── Table ────────────────────────────────────────────────────────────────────
function DocTable({ lines }) {
  const rows = lines
    .filter(l => !/^\|[-|:\s]+\|$/.test(l.trim()))
    .map(l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()));
  if (!rows.length) return null;
  const [header, ...body] = rows;
  return (
    <div className="wdv-table-wrap">
      <table className="wdv-table">
        <thead>
          <tr>{header.map((cell, ci) => <th key={ci} className="wdv-th">{highlightKeywords(cell)}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'wdv-tr-even' : 'wdv-tr-odd'}>
              {row.map((cell, ci) => <td key={ci} className="wdv-td" title={cell}>{highlightKeywords(cell)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Content parser ───────────────────────────────────────────────────────────
function parseContent(raw) {
  const lines = raw.split('\n');
  const nodes = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Section header [...]
    if (/^\[.+\]$/.test(trimmed)) {
      const label = trimmed.slice(1, -1);
      nodes.push(
        <div key={key++} className="wdv-section-header">
          <span className="wdv-bracket">[</span>
          <span className="wdv-section-label">{label}</span>
          <span className="wdv-bracket">]</span>
        </div>
      );
      i++; continue;
    }

    // Table
    if (trimmed.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(<DocTable key={key++} lines={tableLines} />);
      continue;
    }

    // Bullet (-, •, –)
    if (/^[-–•]\s/.test(trimmed)) {
      const text = trimmed.replace(/^[-–•]\s/, '');
      const isIndented = /^\s{2,}/.test(line);
      nodes.push(
        <div key={key++} className={`wdv-bullet ${isIndented ? 'wdv-bullet--sub' : ''}`}>
          <span className="wdv-bullet-marker">▸</span>
          <span>{highlightKeywords(text)}</span>
        </div>
      );
      i++; continue;
    }

    // Lettered sub-item  (a., b., etc.)
    if (/^[a-zA-Z]\.\s/.test(trimmed)) {
      nodes.push(
        <div key={key++} className="wdv-bullet wdv-bullet--alpha">
          <span className="wdv-bullet-alpha">{trimmed.match(/^([a-zA-Z])\./)?.[1]}.</span>
          <span>{highlightKeywords(trimmed.replace(/^[a-zA-Z]\.\s/, ''))}</span>
        </div>
      );
      i++; continue;
    }

    // Empty line
    if (trimmed === '') {
      nodes.push(<div key={key++} className="wdv-spacer" />);
      i++; continue;
    }

    // Default line
    nodes.push(
      <div key={key++} className="wdv-line">{highlightKeywords(line)}</div>
    );
    i++;
  }
  return nodes;
}

// ─── Single document reader ───────────────────────────────────────────────────
function DocReader({ pages, docId, onBack }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [inputVal, setInputVal]   = useState('1');
  const contentRef = useRef(null);
  const total = pages.length;
  const page  = pages[pageIndex];

  useEffect(() => {
    setInputVal(String(pageIndex + 1));
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [pageIndex]);

  function goTo(idx) {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setPageIndex(clamped);
  }

  function handleExecute() {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n)) goTo(n - 1);
  }

  return (
    <div className="wdv-root">
      {/* Header */}
      <div className="wdv-header">
        <button className="wdv-back-btn" type="button" onClick={onBack}>← BACK</button>
        <span className="wdv-header-doc">{docId.toUpperCase()}</span>
        <span className="wdv-header-title">{page.title.toUpperCase()}</span>
        <span className="wdv-header-section wdv-section-pill">{page.section}</span>
        <span className="wdv-header-page">{pageIndex + 1} / {total}</span>
      </div>

      {/* Content — 70% */}
      <div className="wdv-content" ref={contentRef}>
        <div className="wdv-content-inner">
          {parseContent(page.content)}
        </div>
      </div>

      {/* Metadata strip — 30% */}
      <div className="wdv-meta-strip">
        <div className="wdv-meta-left">
          <span className="wdv-meta-label">SECTION</span>
          <span className="wdv-meta-value">{page.section}</span>
        </div>
        <div className="wdv-meta-left">
          <span className="wdv-meta-label">PAGE</span>
          <span className="wdv-meta-value">{pageIndex + 1} of {total}</span>
        </div>
        <div className="wdv-meta-left">
          <span className="wdv-meta-label">DOCUMENT</span>
          <span className="wdv-meta-value">{docId === 'gdd' ? 'Game Design Document' : 'Asset Pipeline'}</span>
        </div>
      </div>

      {/* Footer nav */}
      <div className="wdv-footer">
        <div className="wdv-footer-left">
          <span className="wdv-prompt">&gt;_</span>
          <input
            className="wdv-page-input"
            type="number"
            min={1}
            max={total}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleExecute()}
          />
          <button className="wdv-exec-btn" type="button" onClick={handleExecute}>JUMP</button>
        </div>
        <div className="wdv-footer-right">
          <button className="wdv-nav-btn" type="button"
            onClick={() => goTo(pageIndex - 1)} disabled={pageIndex === 0}>◄ PREV</button>
          <span className="wdv-page-counter">{pageIndex + 1} / {total}</span>
          <button className="wdv-nav-btn" type="button"
            onClick={() => goTo(pageIndex + 1)} disabled={pageIndex === total - 1}>NEXT ►</button>
        </div>
      </div>
    </div>
  );
}

// ─── Document selection screen ────────────────────────────────────────────────
function DocSelectScreen({ onSelect }) {
  return (
    <div className="wdv-root wdv-select-root">
      <div className="wdv-select-header">
        <span className="wdv-select-tag">[PROJECT WAVE]</span>
        <p className="wdv-select-sub">SELECT DOCUMENT TO VIEW</p>
      </div>
      <div className="wdv-select-grid">
        {waveDocuments.map(doc => (
          <button
            key={doc.id}
            type="button"
            className="wdv-doc-card"
            onClick={() => onSelect(doc.id)}
          >
            <span className="wdv-doc-tag">{doc.tag}</span>
            <span className="wdv-doc-title">{doc.label}</span>
            <span className="wdv-doc-desc">{doc.description}</span>
            <span className="wdv-doc-status wdv-doc-status--active">● AVAILABLE</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function WaveDocViewer() {
  const [activeDoc, setActiveDoc] = useState(null);

  if (activeDoc === 'gdd') {
    return <DocReader pages={gddPages} docId="gdd" onBack={() => setActiveDoc(null)} />;
  }
  if (activeDoc === 'pipeline') {
    return <DocReader pages={pipelinePages} docId="pipeline" onBack={() => setActiveDoc(null)} />;
  }
  return <DocSelectScreen onSelect={setActiveDoc} />;
}