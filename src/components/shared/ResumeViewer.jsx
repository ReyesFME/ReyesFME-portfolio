import React from 'react';
import '../../styles/resume-viewer.css';

const CONTACT = [
  { icon: '>>', label: '#430 Dela Cruz St., Arkong Bato, Valenzuela City' },
  { icon: '>>', label: '09551087286' },
  { icon: '>>', label: 'technofiona607@gmail.com' },
];

const EXPERIENCE = [
  {
    role: 'Lead Designer, UI/UX & System Designer — Capstone Project',
    date: 'JAN 2026 – PRESENT',
    desc: "Orchestrated the system's overall aesthetic — moodboard, Figma mockups, and custom assets — followed by frontend coding with full desktop-to-mobile responsiveness. Major contributor to system architecture: DFDs, Functional and Non-Functional Requirements, and consulted on additional diagrams.",
  },
  {
    role: 'Project Manager, Game Designer & Developer — Project 4b',
    date: 'JAN 2026 – MAY 2026',
    desc: 'Initiated cohesive Game Design Document (GDD), managed the full project pipeline, and guided the team through collaboration. Contributed major assets: narrative scripts, custom-edited SFX, backgrounds, and miscellaneous assets.',
  },
  {
    role: 'Script Writer, Multimedia — Film Fest',
    date: 'APRIL 2025',
    desc: 'Spearheaded final plot selection and wrote the majority of the final script — modified and approved by associate writers.',
  },
];

const TECHNICAL_SKILLS = [
  'UI/UX Design',
  'System Architecture',
  'Project Management',
  'Technical Requirement Writing',
  'Multimedia',
  'Digital & Traditional Illustration',
  'Narrative / Script Writing',
];

const SOFT_SKILLS = [
  'Teamwork & Collaboration',
  'Adaptability',
  'Time Management',
  'Workplace Ethics & Empathy',
  'Critical & Creative Thinking',
  'High-Pressure Environments',
];

const LANGUAGES = ['Python', 'React', 'JavaScript', 'UML'];

/*
  bare={true}  → renders only the scrollable content body, no window chrome.
                 Use this when embedding inside ProfessionalSidebar's modal
                 (which already has its own header/footer).

  bare={false} → default, renders the full standalone terminal window
                 (titlebar + body + footer + scanlines).
*/
const ResumeViewer = ({ bare = false }) => {

  const content = (
    <div className="rv-body">

      <p className="rv-prompt">
        C:\USERS\FIONA&gt; load_resume --full <span className="rv-cursor" />
      </p>

      {/* Header */}
      <div className="rv-header">
        <h1 className="rv-name">REYES, FIONA MAE E.</h1>
        <p className="rv-tagline">
          Creative, Critical, and Detail-Oriented &mdash; technological education &amp; capabilities
          to yield meaningful results across media and discipline. 3rd year IT Student in
          Pamantasan ng Lungsod ng Valenzuela. Currently seeking a company to render OJT hours.
        </p>
        <div className="rv-contact-row">
          {CONTACT.map((item, i) => (
            <div key={i} className="rv-contact-item">
              <span className="rv-contact-icon">{item.icon}</span>
              <span className="rv-contact-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="rv-section">
        <div className="rv-section-title">EXPERIENCE</div>
        {EXPERIENCE.map((entry, i) => (
          <div key={i} className="rv-entry">
            <div className="rv-entry-header">
              <span className="rv-entry-role">{entry.role}</span>
              <span className="rv-entry-date">{entry.date}</span>
            </div>
            <p className="rv-entry-desc">{entry.desc}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="rv-section">
        <div className="rv-section-title">EDUCATION</div>
        <div className="rv-entry">
          <p className="rv-edu-line">
            Pamantasan ng Lungsod ng Valenzuela &mdash; B.S. Information Technology
          </p>
          <p className="rv-edu-sub">
            Maysan, Valenzuela City &nbsp;|&nbsp; Started AUG 2023 &nbsp;|&nbsp; Expected Graduation: JUNE / JULY 2027
          </p>
        </div>
      </div>

      {/* Projects */}
      <div className="rv-section">
        <div className="rv-section-title">PROJECTS</div>
        <div className="rv-entry">
          <div className="rv-entry-header">
            <span className="rv-entry-role">Lead Artist, Game Designer, Project Manager &mdash; TTRPG Special Project</span>
          </div>
          <p className="rv-entry-desc">
            Tabletop Role Playing Game &mdash; custom world-building, asset creation, and project
            management for a collaborative special project.
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="rv-section">
        <div className="rv-skills-grid">
          <div className="rv-skill-col">
            <p className="rv-skill-col-title">// TECHNICAL_SKILLS</p>
            <div className="rv-skill-tags">
              {TECHNICAL_SKILLS.map((s, i) => (
                <span key={i} className="rv-skill-tag">{s}</span>
              ))}
            </div>
          </div>
          <div className="rv-skill-col">
            <p className="rv-skill-col-title">// SOFT_SKILLS</p>
            <div className="rv-skill-tags">
              {SOFT_SKILLS.map((s, i) => (
                <span key={i} className="rv-skill-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="rv-section rv-section--last">
        <div className="rv-section-title">LANGUAGES</div>
        <div className="rv-lang-row">
          {LANGUAGES.map((lang, i) => (
            <span key={i} className="rv-lang-tag">{lang}</span>
          ))}
        </div>
      </div>

    </div>
  );

  /* ── Bare mode: content only, no window chrome ── */
  if (bare) {
    return <div className="rv-bare">{content}</div>;
  }

  /* ── Full standalone window ── */
  return (
    <div className="rv-outer">
      <div className="rv-root">

        <div className="rv-titlebar">
          <div className="rv-titlebar-left">
            <span className="rv-title-icon" />
            <span className="rv-title-text">resume_viewer.exe &mdash; Reyes, Fiona Mae E.</span>
          </div>
          <div className="rv-winbtns">
            <div className="rv-winbtn">_</div>
            <div className="rv-winbtn">&#9633;</div>
            <div className="rv-winbtn">&#10005;</div>
          </div>
        </div>

        {content}

        <div className="rv-footer">
          <span className="rv-footer-left">resume_v2025.txt &nbsp;|&nbsp; READ-ONLY</span>
          <span className="rv-footer-right">1 file loaded &nbsp;|&nbsp; &#10003; OK</span>
        </div>

      </div>
      <div className="rv-scanlines" aria-hidden="true" />
    </div>
  );
};

export default ResumeViewer;