import React from 'react';
import '../../styles/resume-viewer.css';

const CONTACT = [
  { icon: '>>', label: '#430 Dela Cruz St., Arkong Bato, Valenzuela City' },
  { icon: '>>', label: '09551087286' },
  { icon: '>>', label: 'technofiona607@gmail.com' },
  { icon: '>>', label: 'websitelink-pagnaka-up-na.site' },
];

const EXPERIENCE = [
  {
    role: 'Lead Designer, UI/UX and System Designer — Capstone Project',
    date: 'JANUARY 2026 - PRESENT',
    desc: "Orchestrated the system's overall aesthetic, providing moodboard, Figma mockups and custom assets—followed by subsequent coding of the frontend using React and JS, ensuring responsiveness from desktop to mobile. Major contributor of system architecture namely: DFDs, Functional and Non-Functional Requirements, and consulted with other needed diagrams.",
  },
  {
    role: 'Project Manager, Game Designer, Artist — Project W.A.V.E.',
    date: 'JANUARY 2026 - MAY 2026',
    desc: "Initiated the group to form a cohesive Game Design Document (GDD), created and managed the 5-month project pipeline. Guided a cross-functional 6-man team, pioneering collaboration and communication while also contributing major assets such as narrative scripts, custom-edited sound effects, backgrounds and miscellaneous assets.",
  },
  {
    role: 'Project Manager, Game Designer, Artist — Tabletop Role Playing Game (TTRPG): Approaching Dusk',
    date: 'SEPTEMBER 2025 - DECEMBER 2025',
    desc: "Procured the main game storyline, mechanics, aesthetics, and assets: concept art and character designs for the Filipino-themed TTRPG project.",
  },
  {
    role: 'Script Writer, Multimedia — IT Film Fest',
    date: 'APRIL 2025',
    desc: "Authored the primary script and pitched the selected narrative plot for a multimedia film festival entry. Collaborated closely with associate writers to refine, modify, and finalize the script for production.",
  },
];

const TECHNICAL_SKILLS = [
  'UI/UX Design',
  'System Architecture',
  'Project Management',
  'Requirement Writing',
  'Creative Writing',
  'Multimedia',
];

const PROFESSIONAL_SKILLS = [
  'Teamwork and Collaboration',
  'Adaptability',
  'Time Management',
  'Workplace Ethics and Empathy',
  'Thrives in fast-paced, high-pressure environment',
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
          Seeking an OJT opportunity to leverage strong project management communication, and UI/UX design skills in a fast-paced environment. Creative and detail-oriented 3rd-year IT student bridging the gap between technical system design and multimedia art. Experienced in managing project pipelines, from initial data flow diagrams and concept art to final asset creation.
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
            Pamantasan ng Lungsod ng Valenzuela &mdash; Bachelor of Science in Information Technology
          </p>
          <p className="rv-edu-sub">
            AUGUST 2023 - Expected JULY 2027
          </p>
          <p className="rv-edu-sub" style={{ marginTop: '4px' }}>
            2024-PRESENT: Member of Students Helping in Imminent Events and Life-threatening Disasters (S.H.I.E.L.D.)
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
            <p className="rv-skill-col-title">// PROFESSIONAL_SKILLS</p>
            <div className="rv-skill-tags">
              {PROFESSIONAL_SKILLS.map((s, i) => (
                <span key={i} className="rv-skill-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="rv-section">
        <div className="rv-section-title">LANGUAGES</div>
        <div className="rv-lang-row">
          {LANGUAGES.map((lang, i) => (
            <span key={i} className="rv-lang-tag">{lang}</span>
          ))}
        </div>
      </div>

      {/* References */}
      <div className="rv-section rv-section--last">
        <div className="rv-section-title">REFERENCES</div>
        <div className="rv-entry">
          <p className="rv-edu-line">Kenmar C. Bernardino, MSIT</p>
          <p className="rv-edu-sub">Department Chairperson, PLV-IT Department</p>
          <p className="rv-edu-sub">ceit.bernardino@gmail.com</p>
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