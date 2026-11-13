import React, { useMemo, useState, useCallback } from 'react';
import '../../styles/ojt-experience.css';
import ojtMd from '../../data/Summarized_report_of_OJT_EXP.md?raw';
import { ojtGazette as cfg } from '../../data/ojtGazette.js';

/* ---------- tiny markdown parser (only what this file uses) ---------- */
function parseMd(src) {
  const out = { title: '', sections: [] };
  let sec = null;
  let item = null;

  for (const raw of src.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) continue;

    if (line.startsWith('# ')) { out.title = line.slice(2).trim(); continue; }
    if (line.startsWith('## ')) {
      sec = { title: line.slice(3).trim(), paras: [], items: [] };
      out.sections.push(sec);
      item = null;
      continue;
    }
    if (!sec) continue;

    const bullet = line.match(/^(\s*)[*-]\s+(.*)$/);
    if (bullet) {
      const nested = bullet[1].length >= 2 && item;
      const text = bullet[2];
      const lab = text.match(/^\*\*(.+?):\*\*\s*(.*)$/);
      const node = lab
        ? { label: lab[1], text: lab[2], children: [] }
        : { label: '', text, children: [] };
      if (nested) item.children.push(node);
      else { sec.items.push(node); item = node; }
    } else {
      sec.paras.push(line.trim());
    }
  }
  return out;
}
function Inline({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

const splitList = (text) =>
  text
    .replace(/^\*[^*]+:\*\s*/, '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

function flattenTools(section) {
  if (!section) return [];
  const names = [];
  section.items.forEach((it) => {
    if (it.text) names.push(...splitList(it.text));
    it.children.forEach((c) => names.push(...splitList(c.text)));
  });
  return names;
}

function Label({ children }) {
  return (
    <h3 className="ojt-label">
      <i className="ojt-label__icon" aria-hidden="true" />
      {children}
    </h3>
  );
}

/* ---------- journal collage column (thin-line drawings, all inline) ---------- */
const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

const Spark = ({ className }) => (
  <svg className={className} {...line} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2c.7 6.2 3.8 9.3 10 10-6.2.7-9.3 3.8-10 10-.7-6.2-3.8-9.3-10-10 6.2-.7 9.3-3.8 10-10z" />
  </svg>
);

const Paperclip = () => (
  <svg className="jr-clip" {...line} viewBox="0 0 20 36" aria-hidden="true">
    <path d="M16 12V27A6 6 0 0 1 4 27V9A4 4 0 0 1 12 9V25A2 2 0 0 1 8 25V12" />
  </svg>
);

// Line-art workstation: monitor, keyboard, tower, cable
const WorkstationArt = () => (
  <svg className="jr-art" {...line} viewBox="0 0 170 104" aria-hidden="true">
    <rect x="14" y="12" width="84" height="56" rx="4" />
    <rect x="20" y="18" width="72" height="44" rx="2" strokeOpacity=".4" />
    <path d="M28 30h26M28 38h40M28 46h18" strokeOpacity=".7" />
    <circle className="jr-accent" cx="80" cy="52" r="3" />
    <path d="M56 68v10M42 80h28" />
    <rect x="22" y="88" width="68" height="9" rx="2" />
    <path d="M30 92.5h52" strokeDasharray="2 3" strokeOpacity=".6" />
    <rect x="116" y="16" width="40" height="80" rx="4" />
    <path d="M124 28h24M124 35h24" />
    <path d="M124 52h14M124 58h14M124 64h14" strokeOpacity=".5" />
    <path d="M124 84h12" />
    <circle className="jr-accent" cx="146" cy="84" r="3" />
    <path d="M98 50c8 0 8 34 18 34" strokeDasharray="3 3" strokeOpacity=".7" />
  </svg>
);

const DiskIcon = () => (
  <svg {...line} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17.5" cy="15.5" r=".7" fill="currentColor" />
  </svg>
);

const ChipIcon = () => (
  <svg {...line} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="1.5" />
    <rect x="9.5" y="9.5" width="5" height="5" />
    <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
  </svg>
);

const WifiIcon = () => (
  <svg {...line} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9.5a13 13 0 0 1 18 0M6 13a8.5 8.5 0 0 1 12 0M9 16.5a4 4 0 0 1 6 0" />
    <circle cx="12" cy="19.5" r=".9" fill="currentColor" />
  </svg>
);

// Rubber-stamp style sign-off: rings + text on a circle + centre label
const Stamp = ({ top, bottom, status, hours }) => {
  const txt = { fill: 'currentColor', stroke: 'none' };
  const star = 'M0 -3.6C.3 -1 1 -.3 3.6 0C1 .3 .3 1 0 3.6C-.3 1 -1 .3 -3.6 0C-1 -.3 -.3 -1 0 -3.6z';
  return (
    <svg className="jr-stamp" {...line} viewBox="0 0 120 120" role="img" aria-label={`${status}, ${hours}`}>
      <defs>
        <path id="jr-stamp-top" d="M21 60A39 39 0 0 1 99 60" />
        <path id="jr-stamp-bot" d="M14 60A46 46 0 0 0 106 60" />
      </defs>
      <circle cx="60" cy="60" r="56" strokeWidth="1.9" />
      <circle cx="60" cy="60" r="51" strokeWidth=".9" strokeDasharray="1 2.4" />
      <circle cx="60" cy="60" r="35" strokeWidth="1.2" />
      {top && (
        <text {...txt} fontSize="8" fontWeight="700" letterSpacing="1.6" textAnchor="middle">
          <textPath href="#jr-stamp-top" startOffset="50%">{top}</textPath>
        </text>
      )}
      {bottom && (
        <text {...txt} fontSize="8" fontWeight="700" letterSpacing="1.6" textAnchor="middle">
          <textPath href="#jr-stamp-bot" startOffset="50%">{bottom}</textPath>
        </text>
      )}
      <path d="M29 48.5h62M29 63.5h62" strokeWidth="1.2" />
      <text {...txt} x="60" y="59.5" fontSize="10" fontWeight="700" letterSpacing=".3" textAnchor="middle">{status}</text>
      <text {...txt} x="60" y="80" fontSize="13" fontWeight="700" letterSpacing=".4" textAnchor="middle">{hours}</text>
      <path {...txt} d={star} transform="translate(17 60)" />
      <path {...txt} d={star} transform="translate(103 60)" />
    </svg>
  );
};

const CampusIcon = () => (
  <svg {...line} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 20h18" />
    <rect x="4" y="9" width="7" height="11" />
    <rect x="13" y="5" width="7" height="15" />
    <path d="M6.5 12.5h2M6.5 16h2M15.5 9h2M15.5 12.5h2M15.5 16h2" />
  </svg>
);

const MonitorIcon = () => (
  <svg {...line} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
    <path d="M9 20h6M12 16.5V20" />
  </svg>
);

const UserIcon = () => (
  <svg {...line} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
  </svg>
);

const ICONS = {
  disk: DiskIcon, chip: ChipIcon, wifi: WifiIcon,
  campus: CampusIcon, monitor: MonitorIcon, user: UserIcon,
};

function JournalAside({ aside }) {
  if (!aside) return null;

  const {
    snapshot = {},
    highlightsTitle = 'Highlights',
    highlights = [],
    trackerTitle = 'Month log',
    trackerMonths = [],
    stamp,
    quote,
    quoteTag = 'in short',
  } = aside;

  return (
    <aside className="jr-aside" aria-label="Journal highlights">
      <Spark className="jr-spark jr-spark--a" />
      <Spark className="jr-spark jr-spark--b" />

      {/* "photo": line drawing */}
      <figure className="jr-card jr-snap">
        <span className="jr-tape jr-tape--stripe" aria-hidden="true" />
        <div className="jr-snap__frame">
          {snapshot.src ? <img src={snapshot.src} alt={snapshot.alt || ''} /> : <WorkstationArt />}
        </div>
        {snapshot.caption && <figcaption className="jr-snap__cap">{snapshot.caption}</figcaption>}
      </figure>

      {/* dashed index card */}
      {highlights.length > 0 && (
        <section className="jr-card jr-list">
          <span className="jr-tape jr-tape--check" aria-hidden="true" />
          <Paperclip />
          <h4 className="jr-list__title">
            <span>{highlightsTitle}</span>
          </h4>
          <ul className="jr-list__items">
            {highlights.map((h) => {
              const Icon = ICONS[h.icon];
              return (
                <li className="jr-item" key={h.title}>
                  <span className="jr-bullet" aria-hidden="true" />
                  <span>
                    <span className="jr-item__title">{h.title}</span>
                    {h.note && <span className="jr-item__note">{h.note}</span>}
                  </span>
                  {Icon && <Icon />}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {trackerMonths.length > 0 && (
        <section className="jr-card jr-track">
          <span className="jr-tape jr-tape--stripe jr-tape--right" aria-hidden="true" />
          <h4 className="jr-list__title">
            <span>{trackerTitle}</span>
          </h4>
          <ol className="jr-track__months">
            {trackerMonths.map((m) => (
              <li className="jr-month" key={m}>
                <svg className="jr-box" {...line} viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path className="jr-accent" d="M7.5 12.5l3 3 6-7" />
                </svg>
                <span className="jr-month__label">{m}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {quote && (
        <div className="jr-quote">
          <div className="jr-quote__body">
            <span className="jr-quote__tag">// {quoteTag}</span>
            <span className="jr-quote__text">{quote}</span>
            <Spark className="jr-spark jr-spark--c" />
          </div>
        </div>
      )}
      {/* logbook sign-off stamp (hidden if `stamp` is missing) */}
      {stamp && <Stamp {...stamp} />}
    </aside>
  );
}

export default function OjtExperience() {
  const doc = useMemo(() => parseMd(ojtMd), []);
  const find = (name) => doc.sections.find((s) => s.title.toLowerCase().includes(name));

  const overview = find('overview');
  const skills = find('skills');
  const impact = find('impact');
  const tools = find('tools');

  const skillItems = skills ? skills.items : [];
  const photos = cfg.photos || [];
  const logos = cfg.toolLogos || [];
  const stickers = cfg.stickers || [];

  const [slide, setSlide] = useState(0);
  const [openSkill, setOpenSkill] = useState(0);

  const go = useCallback(
    (dir) => {
      if (!photos.length) return;
      setSlide((i) => (i + dir + photos.length) % photos.length);
    },
    [photos.length]
  );

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };

  const photo = photos[slide];

  /* journal: custom entries, or the .md text as a fallback */
  const entries = useMemo(() => {
    if (cfg.journal && cfg.journal.length) return cfg.journal;
    const list = [];
    if (overview && overview.paras.length) {
      list.push({ date: cfg.journalDate, title: '', text: overview.paras.join(' ') });
    }
    if (impact) {
      impact.items.forEach((it) => list.push({ date: '', title: it.label, text: it.text }));
    }
    return list;
  }, [overview, impact]);

  const allTools = flattenTools(tools);
  const toolTiles = logos.length
    ? logos
    : allTools.slice(0, 6).map((name) => ({ name, src: '' }));
  const toolsNote = cfg.toolsNote || allTools.join(', ');

  return (
    <article className="ojt">
      {/* ───────── header: title left, hours right ───────── */}
      <header className="ojt-head">
        <div>
          <h2 className="ojt-title">{cfg.title}</h2>
          <p className="ojt-sub">{doc.title}</p>
        </div>
        <div className="ojt-hours">
          <span className="ojt-hours__num">{cfg.hours}</span>
          <span className="ojt-hours__label">{cfg.hoursLabel}</span>
        </div>
      </header>

      {/* ───────── journal entries (summary) ───────── */}
      <section className="ojt-journal">
        <div className="ojt-row">
          <Label>{cfg.journalTitle}</Label>
          {entries[0] && entries[0].date ? <span className="ojt-date">{entries[0].date}</span> : null}
        </div>

        {/* collage column. Must sit right after the header row, before the entries,
            so the text wraps around it. Renders nothing if journalAside is missing. */}
        <JournalAside aside={cfg.journalAside} />

        {entries.map((e, i) => (
          <div key={i} className="ojt-entry">
            {(e.title || (i > 0 && e.date)) && (
              <div className="ojt-entry__head">
                <strong>{e.title}</strong>
                {i > 0 && e.date ? <span className="ojt-date">{e.date}</span> : null}
              </div>
            )}
            <p><Inline text={e.text} /></p>
          </div>
        ))}
      </section>

      {/* ───────── skills (left) + big image (right) ───────── */}
      <div className="ojt-top">
        <div className="ojt-skills">
          <Label>{cfg.skillsTitle}</Label>
          <ul className="ojt-skill-list">
            {skillItems.map((s, i) => {
              const open = i === openSkill;
              const sticker = stickers[i];
              return (
                <li key={s.label} className={`ojt-skill${open ? ' is-open' : ''}${sticker ? ' has-sticker' : ''}`}>
                  {sticker && <img className="ojt-sticker" src={sticker} alt="" draggable="false" />}
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenSkill(open ? -1 : i)}
                  >
                    <span className="ojt-skill__name">{s.label}</span>
                    <span className="ojt-skill__chev" aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  {open && (
                    <p className="ojt-skill__text"><Inline text={s.text} /></p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <figure
          className="ojt-photo"
          aria-roledescription="carousel"
          aria-label="OJT photos"
          tabIndex={0}
          onKeyDown={onKey}
        >
          <div className="ojt-stage">
            {photo ? (
              <img key={photo.src} src={photo.src} alt={photo.caption || ''} draggable="false" />
            ) : (
              <div className="ojt-stage__empty">
                <p>Add docu <code>photos</code> here</p>
              </div>
            )}

            {photos.length > 1 && (
              <>
                <button type="button" className="ojt-arrow ojt-arrow--prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
                <button type="button" className="ojt-arrow ojt-arrow--next" onClick={() => go(1)} aria-label="Next photo">›</button>
              </>
            )}
          </div>

          {photo && (
            <figcaption className="ojt-hang">
              <span className="ojt-hang__hole" aria-hidden="true" />
              <span className="ojt-hang__count">{slide + 1} / {photos.length}</span>
              <span className="ojt-hang__text">{photo.caption}</span>
            </figcaption>
          )}
        </figure>
      </div>

      {/* ───────── tools used ───────── */}
      <section className="ojt-tools">
        <Label>{cfg.toolsTitle}</Label>
        <ul className="ojt-tiles">
          {toolTiles.map((t) => (
            <li key={t.name} className="ojt-tool" title={t.name}>
              <span className={`ojt-tile${t.src ? ' ojt-tile--logo' : ''}`}>
                {t.src ? <img src={t.src} alt="" draggable="false" /> : <span>{t.name}</span>}
              </span>
              {t.src && <span className="ojt-tool__name">{t.name}</span>}
            </li>
          ))}
        </ul>
        <p className="ojt-toolsnote">{toolsNote}</p>
      </section>
    </article>
  );
}