import React, { useState, useRef, useEffect } from 'react';
import '../../styles/capstone-viewer.css';

// ─────────────────────────────────────────────
//  ANIMATED STATIC CANVAS
// ─────────────────────────────────────────────

function StaticCanvas({ className }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || 80;
      canvas.height = canvas.offsetHeight || 60;
    };
    resize();
    draw();

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────

const FUNCTIONAL_SCOPE = {
  admin: {
    label: 'System Administrator',
    preview: [
      'System Administrator can log in and log out.',
      'System Administrator can access account settings to change account information.',
      'System Administrator can keep track of the clinic\'s demographics (non-medical staffs, medical staffs, patients).',
      'System Administrator can monitor attendance statistics through the attendance overview and filter the data by month and/or year.',
      'System Administrator can access the quick actions: Slot Reservation, Appointments, and Messages for immediate action.',
    ],
    full: [
      'System Administrator can log in and log out.',
      'System Administrator can access account settings to change account information.',
      'System Administrator can keep track of the clinic\'s demographics (non-medical staffs, medical staffs, patients).',
      'System Administrator can monitor the attendance statistics through the attendance overview and filter the data by month and/or year.',
      'System Administrator can access the quick actions: Slot Reservation, Appointments, and Messages for immediate action.',
      'System Administrator can review incoming slot reservation and take action whether to accept or reject it.',
      'System Administrator can create, update, retrieve, delete therapist accounts, patient records.',
      'System Administrator can manage schedules of both staff and patients upon confirmation of slot reservation and successful submission of forms and other related documents.',
      'System Administrator can export data of patients, therapists and admin staff.',
      'System Administrator can import data of patients, therapists and admin staff.',
      'System Administrator can answer chatbot escalation queries from patients.',
      'System Administrator can access notification inbox.',
      'System Administrator can view all notifications.',
      'System Administrator can assign an awaiting patient\'s first appointment.',
      'System Administrator can keep track of the week\'s scheduled appointments.',
      'System Administrator can review cancellation requests from both patient and therapist\'s side and take action whether to accept or reject it.',
      'System Administrator can oversee the organization\'s organizational chart.',
      'System Administrator can manage the CDSS panel.',
      'System Administrator can insert and train ML modules for CDSS.',
      'System Administrator can view suggestions coming from CDSS.',
      'System Administrator can get sample templates of data sets and search patient data in CDSS.',
    ],
  },
  therapist: {
    label: 'Medical Professionals (Therapists)',
    preview: [
      'Therapists can log in and log out of their accounts.',
      'Therapists can use Forgot Password.',
      'Therapists can access account settings to change account information.',
      'Therapists can manage their schedules, accept or decline a slot based on their availability and preference.',
      'Therapists can keep track of their active attendance on their dedicated custom calendar.',
    ],
    full: [
      'Therapists can log in and log out of their accounts.',
      'Therapists can use Forgot Password.',
      'Therapists can access account settings to change account information.',
      'Therapists can manage their schedules, accept or decline a slot based on their availability and preference.',
      'Therapists can keep track of their active attendance on their dedicated custom calendar.',
      'Therapists can utilize the search bar to look for specific appointment details.',
      'Therapists can keep track of their patients\' appointment status through the overview chart.',
      'Therapists can create reports upon every after appointment and update those reports before publication.',
      'Therapists can publish their report to the system to which the admin can review it further before approving its publication to the patient-side dashboard.',
      'Therapists can establish their own todo list. Setting their own task, deadline, and pace.',
      'Therapists can directly message patients regarding concerns and progress.',
      'Therapists can view messages from patients.',
      'Therapists can request an appointment schedule cancellation given that they provide an acceptable reason.',
      'Therapists are able to create their own task list (and set their own deadline) in their dashboard.',
      'Therapists can edit or delete the task after the initial publication.',
      'Therapists can notify the patient.',
      'Therapists can view their notification through their personal inbox.',
      'Therapists can leave a \'read\' remark to a notification.',
      'Therapists can access the accomplished or read notification in the archive tab of the inbox.',
      'Therapists can create a task assignment path to encourage continuous learning at home.',
      'Therapists can attach supplementary learning materials (docs, pdf, instructional videos with a max of 50MB) in the task node.',
      'Therapists can add as many activity nodes as needed.',
      'Therapists can keep track of the parent\'s assignment progress.',
      'Therapists can keep track of the patient record status: on-going, finished, pending.',
      'Therapists can use the CDSS quick guide that utilizes mock data to familiarize themselves with the CDSS\'s functionalities before actually using it on real data.',
      'Therapists can use the CDSS for progress, report, and milestone planning.',
      'Therapists can edit and review data filled by CDSS.',
      'Therapists can utilize auto suggest function in CDSS.',
      'Therapists can add, edit, delete patient records.',
      'Therapists can review their already published session report through the patient records.',
      'Therapists can keep track of the edit history made throughout the patient records for transparency.',
    ],
  },
  patient: {
    label: 'Patients / Parents',
    preview: [
      'Parents can sign up to create their personal accounts.',
      'Parents can submit their child\'s medical information upon slot reservation.',
      'Parents can create separate profiles for their children.',
      'Parents can log in and log out.',
      'Parents can click forgot password.',
    ],
    full: [
      'Parents can sign up to create their personal accounts.',
      'Parents can submit their child\'s medical information upon slot reservation.',
      'Parents can create separate profiles for their children.',
      'Parents can log in and log out.',
      'Parents can click forgot password.',
      'Parents can access account settings to change account information.',
      'Parents can view the homepage of the system.',
      'Parents can see details of available services.',
      'Parents can view and manage their respective dashboard.',
      'Parents can view their appointments.',
      'Parents can request for reschedule of appointment.',
      'Parents can view their child\'s session report.',
      'Parents can submit proof for children\'s individual assignments.',
      'Parents can export session reports.',
      'Parents can show and download generated QR code per appointment.',
      'Parents can manage schedule.',
      'Parents can cancel appointments.',
      'Parents can view the Contact Page of the Hakbang Organization.',
      'Parents can talk to chatbot.',
      'Parents can escalate concerns to an admin personnel via chatbot escalation feature.',
      'Parents can receive a notice if their admission is accepted, rejected or cancelled.',
      'Parents can receive a notice if their appointment is accepted, rejected or cancelled.',
      'Parents can message therapists.',
      'Parents can view messages from therapists.',
      'Parents can view notification inbox.',
      'Parents can enable gatekeeper to lock sensitive sections.',
    ],
  },
};

const TEST_CASES = [
  {
    id: 'TC_THER_Dashboard-Schedules_Reject_Appointment_101',
    title: 'Reject Appointment',
    role: 'Therapist',
    objective: 'Therapists should be able to manage their schedules — accept or reject requests based on their availability.',
    steps: 'Therapist can see the complete details of the appointment and could then reject it.',
    precondition: 'The system displays the proposed appointment in the inbox feature containing the full details of the appointment.',
    expected: 'Upon rejecting, the proposal appointment should be marked as \'rejected\' in the therapist inbox.',
  },
  {
    id: 'TC_THER_Appointment-Calendar_102',
    title: 'Appointment Calendar Sync',
    role: 'Therapist',
    objective: 'Therapists\' schedule should reflect directly and accurately on the calendar.',
    steps: 'Accepted scheduled appointment dates should reflect on the calendar.',
    precondition: 'The system should display all the therapists\' schedules.',
    expected: 'If the service contains 10 appointments in total, there should be 10 marked dates for that service across the calendar.',
  },
  {
    id: 'TC_THER_Create_Medical_Report_120',
    title: 'Create Medical Report',
    role: 'Therapist',
    objective: 'Create a medical report after a successful appointment.',
    steps: 'Therapists should be able to write a new medical report after an appointment. Therapists can write findings and additional notes.',
    precondition: 'A completed appointment session exists in the system.',
    expected: 'Report draft is saved and associated with the correct appointment and patient record.',
  },
  {
    id: 'TC_THER_Publish_Medical_Report_121',
    title: 'Publish Medical Report',
    role: 'Therapist',
    objective: 'Officially publish a medical report.',
    steps: 'Therapists should be able to publish their report after thorough editing and assessment.',
    precondition: 'Completed medical report exists in draft state.',
    expected: 'Once the therapist deems it ready to publish, the report should be sent to both admin and parent.',
  },
];

const SCREENSHOT_CATEGORIES = [
  {
    id: 'landing',
    label: 'Landing Page',
    desktop: [
      { id: 'land-d-1', alt: 'Landing page hero section', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758492/noacclanding.png' },
      { id: 'land-d-2', alt: 'Landing page core values', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757463/corevalues2.png' },
      { id: 'land-d-3', alt: 'Landing page services and booking', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758514/capservices.png' },
    ],
    mobile: [
      { id: 'land-m-1', alt: 'Landing page mobile hero', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757467/landing.png' },
      { id: 'land-m-2', alt: 'Landing page mobile about', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757465/aboutus1.png' },
      { id: 'land-m-3', alt: 'Landing page mobile about', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757465/aboutus2.png' },
      { id: 'land-m-4', alt: 'Landing page mobile core values', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757467/corevalues.png' },
    ],
  },
  {
    id: 'no-account',
    label: 'No Account Access',
    desktop: [
      { id: 'na-d-1', alt: 'Contact page and opening hours', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758855/contactusdesk.png' },
      { id: 'na-d-2', alt: 'Login page', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758505/caplogin.png' },
      { id: 'na-d-3', alt: 'Signup page', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757503/signup.png' },
    ],
    mobile: [
      { id: 'na-m-1', alt: 'Login page mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757468/login.png' },
      { id: 'na-m-2', alt: 'Signup page mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758739/signupmob.png' },
      { id: 'na-m-3', alt: 'Contact page mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757466/contactus.png' },
      { id: 'na-m-4', alt: 'Contact page mobile google maps API', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757467/contctus2.png' },
    ],
  },
  {
    id: 'chatbot',
    label: 'Chatbot',
    desktop: [
      { id: 'cb-d-1', alt: 'InforMe chatbot widget', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759004/chatbotnoaccdesk.png' },
    ],
    mobile: [
      { id: 'cb-m-1', alt: 'Chatbot mobile view', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757462/chatbot.png' },
    ],
  },
  {
    id: 'patient',
    label: 'Patient Dashboard',
    desktop: [
      { id: 'pt-d-1', alt: 'Patient dashboard overview', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757504/dashboard.png' },
      { id: 'pt-d-2', alt: 'Patient appointments view', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757504/appointments.png' },
      { id: 'pt-d-3', alt: 'Patient medical report view', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757505/medicalreport.png' },
    ],
    mobile: [
      { id: 'pt-m-1', alt: 'Patient dashboard mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759112/patientdashboardmob.png' },
      { id: 'pt-m-2', alt: 'Patient appointments mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757505/appointment.png' },
      { id: 'pt-m-3', alt: 'Patient session report mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759114/patientsessionreportsmob.png' },
    ],
  },
  {
    id: 'therapist',
    label: 'Therapist Dashboard',
    desktop: [
      { id: 'th-d-1', alt: 'Therapist dashboard overview', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758380/therdashboard.png' },
      { id: 'th-d-2', alt: 'Patient records view', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758389/therpatientrecords.png' },
      { id: 'th-d-3', alt: 'Individual patient record detail', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758389/therreports.png' },
      { id: 'th-d-4', alt: 'Patient session reports list', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758390/thersessionreport.png' },
    ],
    mobile: [
      { id: 'th-m-1', alt: 'Therapist dashboard mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758361/therdashbaord.png' },
      { id: 'th-m-2', alt: 'Therapist dashboard mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758360/mytask.png' },
      { id: 'th-m-3', alt: 'Therapist medical report mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758387/thersessionreportmob.png' },
      { id: 'th-m-4', alt: 'Therapist patient session report publish', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780758388/therreportmob.png' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin Dashboard',
    desktop: [
      { id: 'ad-d-1', alt: 'Admin dashboard overview', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759320/admindashboarddesk.png' },
      { id: 'ad-d-2', alt: 'Admin appointments and intake forms', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759317/adminappointmentsdesk.png' },
      { id: 'ad-d-3', alt: 'Admin patient records database', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757461/patientrecords.png' },
      { id: 'ad-d-4', alt: 'Admin staff organizational chart', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780757462/stafrecords.png' },
    ],
    mobile: [
      { id: 'ad-m-1', alt: 'Admin dashboard mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759519/admindashboardmob.png' },
      { id: 'ad-m-2', alt: 'Admin appointments mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759517/adminpatient.png' },
      { id: 'ad-m-3', alt: 'Admin patient records mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759521/adminpatientrecordmob.png' },
      { id: 'ad-m-4', alt: 'Admin org chart mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759524/adminstaffrecmob.png' },
      { id: 'ad-m-5', alt: 'Admin messages and support tickets mobile', url: 'https://res.cloudinary.com/dwqatvm5x/image/upload/q_auto/f_auto/v1780759526/chatbotticket.png' },
    ],
  },
];

// ─────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────

function ScopeBlock({ roleKey }) {
  const [expanded, setExpanded] = useState(false);
  const data = FUNCTIONAL_SCOPE[roleKey];
  const items = expanded ? data.full : data.preview;

  return (
    <div className="cv-scope-block">
      <div className="cv-scope-label">&gt; {data.label.toUpperCase()}</div>
      <ol className="cv-scope-list">
        {items.map((item, i) => (
          <li key={i} className="cv-scope-item">
            <span className="cv-scope-index">{String(i + 1).padStart(2, '0')}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
      <button
        className="cv-toggle-btn"
        type="button"
        onClick={() => setExpanded(v => !v)}
      >
        {expanded
          ? '[ - COLLAPSE FULL LIST ]'
          : `[ + SHOW ALL ${data.full.length} FUNCTIONS ]`}
      </button>
    </div>
  );
}

function TestCaseCarousel() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector('.cv-tc-card');
    const cardWidth = card ? card.offsetWidth + 16 : 320;
    scrollRef.current.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  return (
    <div className="cv-tc-wrapper">
      <button className="cv-tc-arrow cv-tc-arrow--left" type="button" onClick={() => scroll(-1)}>&#8249;</button>
      <div className="cv-tc-track" ref={scrollRef}>
        {TEST_CASES.map((tc) => (
          <div className="cv-tc-card" key={tc.id}>
            <div className="cv-tc-card-header">
              <span className="cv-tc-role">[{tc.role}]</span>
              <span className="cv-tc-id">{tc.id}</span>
            </div>
            <div className="cv-tc-card-title">{tc.title}</div>
            <div className="cv-tc-field">
              <span className="cv-tc-field-label">OBJECTIVE</span>
              <p>{tc.objective}</p>
            </div>
            <div className="cv-tc-field">
              <span className="cv-tc-field-label">TEST STEPS</span>
              <p>{tc.steps}</p>
            </div>
            <div className="cv-tc-field">
              <span className="cv-tc-field-label">PRECONDITION</span>
              <p>{tc.precondition}</p>
            </div>
            <div className="cv-tc-field cv-tc-field--expected">
              <span className="cv-tc-field-label">EXPECTED RESULT</span>
              <p>{tc.expected}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="cv-tc-arrow cv-tc-arrow--right" type="button" onClick={() => scroll(1)}>&#8250;</button>
    </div>
  );
}

function ScreenshotSection() {
  const [activeView, setActiveView] = useState('desktop');
  const [openCategory, setOpenCategory] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const toggleCategory = (id) => {
    setOpenCategory(prev => prev === id ? null : id);
  };

  return (
    <div className="cv-ss-section">
      <div className="cv-ss-view-toggle">
        <button
          type="button"
          className={`cv-ss-toggle-btn${activeView === 'desktop' ? ' cv-ss-toggle-btn--active' : ''}`}
          onClick={() => setActiveView('desktop')}
        >
          [DESKTOP]
        </button>
        <span className="cv-ss-toggle-sep">/</span>
        <button
          type="button"
          className={`cv-ss-toggle-btn${activeView === 'mobile' ? ' cv-ss-toggle-btn--active' : ''}`}
          onClick={() => setActiveView('mobile')}
        >
          [MOBILE]
        </button>
      </div>

      <div className="cv-ss-categories">
        {SCREENSHOT_CATEGORIES.map(cat => {
          const images = cat[activeView] || [];
          const isOpen = openCategory === cat.id;
          return (
            <div key={cat.id} className="cv-ss-cat">
              <button
                type="button"
                className="cv-ss-cat-header"
                onClick={() => toggleCategory(cat.id)}
              >
                <span className="cv-ss-cat-arrow">{isOpen ? '▼' : '▶'}</span>
                <span className="cv-ss-cat-label">{cat.label.toUpperCase()}</span>
                <span className="cv-ss-cat-count">({images.length} screenshot{images.length !== 1 ? 's' : ''})</span>
              </button>
              {isOpen && (
                <div className="cv-ss-grid">
                  {images.map(img => (
                    <button
                      type="button"
                      key={img.id}
                      className="cv-ss-thumb-btn"
                      onClick={() => setLightbox(img)}
                    >
                      <div className="cv-ss-thumb">
                        {img.url.startsWith('CLOUDINARY') ? (
                          <div className="cv-ss-placeholder">
                            <span className="cv-ss-placeholder-icon">&#9635;</span>
                            <span className="cv-ss-placeholder-text">{img.alt}</span>
                            <span className="cv-ss-placeholder-url">{img.url}</span>
                          </div>
                        ) : (
                          <>
                            <img src={img.url} alt={img.alt} className="cv-ss-img" />
                            <StaticCanvas className="cv-ss-thumb-static" />
                            <div className="cv-ss-thumb-scanline" />
                            <div className="cv-ss-thumb-vignette" />
                          </>
                        )}
                      </div>
                      <span className="cv-ss-thumb-caption">{img.alt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {lightbox && (
        <div className="cv-lightbox" onClick={() => setLightbox(null)}>
          <div className="cv-lightbox-inner" onClick={e => e.stopPropagation()}>
            <div className='tv-box-header'>
                <p className="cv-lightbox-caption">{lightbox.alt}</p>
                <button type="button" className="cv-lightbox-close" onClick={() => setLightbox(null)}>&#10005; CLOSE</button>
            </div>
            
            <div className="cv-lightbox-tv">
              <div className="cv-lightbox-screen">
                {lightbox.url.startsWith('CLOUDINARY') ? (
                  <div className="cv-lightbox-placeholder">
                    <span>{lightbox.alt}</span>
                    <span className="cv-ss-placeholder-url">{lightbox.url}</span>
                  </div>
                ) : (
                  <img src={lightbox.url} alt={lightbox.alt} className="cv-lightbox-img" />
                )}
                <div className="cv-lightbox-scanlines" />
                <div className="cv-lightbox-vignette" />
                <div className="cv-lightbox-rgb" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────

const SECTIONS = ['overview', 'scope', 'qa', 'ui'];
const SECTION_LABELS = {
  overview: 'Overview',
  scope: 'Scope',
  qa: 'QA',
  ui: 'UI Screenshots',
};

const CapstoneViewer = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="cv-root">
      <div className="cv-scanline" aria-hidden="true" />

      <header className="cv-header">
        <div className="cv-header-tag">SYS-DOC // CAPSTONE</div>
        <h1 className="cv-header-title">
          MyHakbang
          <span className="cv-header-subtitle">
            &nbsp;— AI-Assisted Mobile-Compliant Web-Based Appointment &amp; Records Management System
          </span>
        </h1>
        <div className="cv-header-client">CLIENT: Hakbang Center for Child Development</div>
      </header>

      <nav className="cv-nav">
        {SECTIONS.map(sec => (
          <button
            key={sec}
            type="button"
            className={`cv-nav-btn${activeSection === sec ? ' cv-nav-btn--active' : ''}`}
            onClick={() => setActiveSection(sec)}
          >
            {activeSection === sec ? '' : ''}{SECTION_LABELS[sec]}
          </button>
        ))}
      </nav>

      <main className="cv-main">

        {/* ── SECTION 1: OVERVIEW ── */}
        {activeSection === 'overview' && (
          <section className="cv-section">
            <div className="cv-section-heading">
              <span className="cv-section-num">01</span>
              <span className="cv-section-title">PROJECT OVERVIEW</span>
            </div>

            <div className="cv-overview-grid">
              <div className="cv-overview-block">
                <div className="cv-block-label">// TEAM CONTEXT &amp; ROLES</div>
                <div className="cv-overview-roles">
                  <div className="cv-role-row">
                    <span className="cv-role-tag">PROJECT MANAGER</span>
                  </div>
                  <div className="cv-role-row">
                    <span className="cv-role-tag">DOCUMENTATION &amp; COMMUNICATIONS LEAD</span>
                  </div>
                  <div className="cv-role-row">
                    <span className="cv-role-tag">DEVELOPMENT LEAD</span>
                  </div>
                </div>
                <div className="cv-block-label cv-mt">// MY CORE CONTRIBUTIONS</div>
                <ul className="cv-contrib-list">
                  <li>UI/UX Design</li>
                  <li>Co-developed System Documentation (DFDs)</li>
                  <li>Collaborative Test Case Design</li>
                </ul>
              </div>

              <div className="cv-overview-block">
                <div className="cv-block-label">// CLIENT CONTEXT</div>
                <p className="cv-body-text">
                  The Hakbang Center for Child Development currently lacks a centralized file management system,
                  resulting in patient records and administrative files being dispersed across multiple platforms
                  such as different applications and communication tools. This setup limits the clinic's ability
                  to efficiently track patient attendance, therapy progress, and historical records.
                </p>
              </div>

              <div className="cv-overview-block cv-overview-block--full">
                <div className="cv-block-label">// THE OBJECTIVE</div>
                <p className="cv-body-text">
                  To design and develop an AI-Assisted Mobile-Compliant Web-Based Appointment and Records
                  Management System for Hakbang Center for Child Development that centralizes appointment
                  scheduling, patient records management, and administrative operations into a digital platform.
                  The system provides an accessible web-based and mobile-compliant solution that allows patients
                  to book appointments online. By integrating artificial intelligence for decision-support of
                  therapists and chatbot-assisted inquiries, the system enhances operational efficiency, reduces
                  no-shows, and improves communication between clinic staff and parents that supports tracking
                  of patient progress.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 2: SCOPE ── */}
        {activeSection === 'scope' && (
          <section className="cv-section">
            <div className="cv-section-heading">
              <span className="cv-section-num">02</span>
              <span className="cv-section-title">FUNCTIONAL SCOPE &amp; ROLE-BASED ACCESS</span>
            </div>
            <p className="cv-body-text cv-scope-intro">
              Collaborating closely with our Project Manager and Documentation Lead, I helped map user
              requirements and designed interfaces tailored to three distinct user journeys:
            </p>
            <ScopeBlock roleKey="admin" />
            <ScopeBlock roleKey="therapist" />
            <ScopeBlock roleKey="patient" />
          </section>
        )}

        {/* ── SECTION 3: QA ── */}
        {activeSection === 'qa' && (
          <section className="cv-section">
            <div className="cv-section-heading">
              <span className="cv-section-num">03</span>
              <span className="cv-section-title">QA &amp; SYSTEM VALIDATION</span>
            </div>
            <p className="cv-body-text">
              To ensure the system met all functional requirements before deployment, I partnered with our
              Project Manager and Documentation Lead to engineer the testing parameters and co-drafted the
              comprehensive test cases. This involved defining the expected outcomes for role-based logins,
              data access restrictions, and appointment booking flows, which were then utilized by our
              Documentation Lead for final system validation.
            </p>
            <div className="cv-tc-label">// TEST CASES — SCROLL TO BROWSE</div>
            <TestCaseCarousel />
          </section>
        )}

        {/* ── SECTION 4: UI ── */}
        {activeSection === 'ui' && (
          <section className="cv-section">
            <div className="cv-section-heading">
              <span className="cv-section-num">04</span>
              <span className="cv-section-title">UI/UX DESIGN LAYOUT</span>
            </div>
            <p className="cv-body-text">
              Select a category below to expand its screenshots. Toggle between Desktop and Mobile views
              using the switcher above the categories.
            </p>
            <ScreenshotSection />
          </section>
        )}

      </main>

      <footer className="cv-footer">
        <span>Disclaimer: This is only an In-Development Prototype</span>
        <span className="cv-footer-sep">|</span>
        <span>Current Status: Defended Capstone 1, pending Capstone 2</span>
      </footer>
    </div>
  );
};

export default CapstoneViewer;