import { useState } from "react";
import "../../../styles/SU-winforms.css"; 
import { IMGS } from "./SU_images.js";

import calcuicon from "./gem_icons/sapphire.png";
import tempticon from "./gem_icons/ruby.png";
import regisform from "./gem_icons/amethyst.png";
import homegem   from "./gem_icons/bismuth.png";
import folder    from "./gem_icons/folder.png";



/* ══════════════════════════════════════════════════════
   CALCULATOR  (originally Form 6)
══════════════════════════════════════════════════════ */
function Calculator() {
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState(null);
  const [selOp,   setSelOp]   = useState(false);
  const [err,     setErr]     = useState("");

  const pushDigit = (d) => {
    setErr("");
    if (display === "0" || selOp) { setDisplay(String(d)); setSelOp(false); }
    else setDisplay(display + d);
  };
  const pushDot = () => {
    setErr("");
    if (selOp) { setDisplay("0."); setSelOp(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };
  const pushOp = (op) => { setErr(""); setPending({ value: parseFloat(display), op }); setSelOp(true); };
  const compute = () => {
    if (!pending) return;
    const b = parseFloat(display), a = pending.value;
    let res;
    switch (pending.op) {
      case "+": res = a + b; break;
      case "-": res = a - b; break;
      case "×": res = a * b; break;
      case "÷":
        if (b === 0) { setErr("Cannot divide by zero!"); setDisplay("0"); setPending(null); setSelOp(false); return; }
        res = a / b; break;
      default: return;
    }
    setDisplay(String(parseFloat(res.toFixed(10)))); setPending(null); setSelOp(false);
  };
  const clear = () => { setDisplay("0"); setPending(null); setSelOp(false); setErr(""); };

  const BTNS = [
    {l:"CE",fn:clear,cls:"clear"},{l:"C",fn:clear,cls:"clear"},
    {l:"÷",fn:()=>pushOp("÷"),cls:"op"},{l:"×",fn:()=>pushOp("×"),cls:"op"},
    {l:"7",fn:()=>pushDigit("7")},{l:"8",fn:()=>pushDigit("8")},
    {l:"9",fn:()=>pushDigit("9")},{l:"-",fn:()=>pushOp("-"),cls:"op"},
    {l:"4",fn:()=>pushDigit("4")},{l:"5",fn:()=>pushDigit("5")},
    {l:"6",fn:()=>pushDigit("6")},{l:"+",fn:()=>pushOp("+"),cls:"op"},
    {l:"1",fn:()=>pushDigit("1")},{l:"2",fn:()=>pushDigit("2")},
    {l:"3",fn:()=>pushDigit("3")},{l:"=",fn:compute,cls:"eq",rows:2},
    {l:"0",fn:()=>pushDigit("0"),cls:"wide"},{l:".",fn:pushDot},
  ];

  return (
    <div className="su-screen su-calcu" style={{ backgroundImage: `url(${IMGS.bg_form6})` }}>
      <div className="calcu-shell">
        <div className="calcu-title">My Simple Calculator</div>
        <div className="calcu-display">{display}</div>
        {err && <div className="calcu-err">{err}</div>}
        <div className="calcu-grid">
          {BTNS.map((b, i) => (
            <button
              key={i}
              className={`calcu-btn ${b.cls || ""}`}
              style={b.rows ? { gridRow: `span ${b.rows}` } : {}}
              onClick={b.fn}
            >{b.l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEMPERATURE  (originally Forms 8-11)
══════════════════════════════════════════════════════ */
function Temperature() {
  const [input,  setInput]  = useState("");
  const [result, setResult] = useState(null);

  const LABELS = {
    cold: "Cold (0°C – 10°C)",
    warm: "Warm (11°C – 30°C)",
    hot:  "Hot (31°C+)",
  };

  const confirm = () => {
    const c = parseFloat(input);
    if (isNaN(c)) { alert("Please enter a valid number."); return; }
    if (c >= 0  && c <= 10) setResult("cold");
    else if (c >= 11 && c <= 30) setResult("warm");
    else if (c >= 31) setResult("hot");
    else setResult(null);
  };

  if (result) {
    const bgMap = { cold: IMGS.bg_form9, warm: IMGS.bg_form10, hot: IMGS.bg_form11 };
    return (
      <div className="su-screen su-temp-result" style={{ backgroundImage: `url(${bgMap[result]})` }}>
        <div className="temp-result-label">{LABELS[result]}</div>
        <button className="btn-close-result" onClick={() => { setResult(null); setInput(""); }}>✕</button>
      </div>
    );
  }

  return (
    <div className="su-screen su-temp-input" style={{ backgroundImage: `url(${IMGS.bg_form8})` }}>
      <div className="temp-box">
        <div className="temp-heading">Enter a Temperature</div>
        <div className="temp-sub">Temperature in Celsius</div>
        <div className="temp-row">
          <input
            className="temp-num-input"
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && confirm()}
            placeholder="0"
          />
          <span className="temp-unit">°C</span>
        </div>
        <button className="btn-confirm" onClick={confirm}>Confirm</button>
      </div>
    </div>
  );
}

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

function DobSelect({ startYear = 2010, years = 20 }) {
  return (
    <div className="reg-field">
      <span className="reg-label">Date of Birth</span>
      <div style={{ display:"flex", gap:3 }}>
        <select className="reg-select">
          <option>Month</option>
          {MONTHS.map(m => <option key={m}>{m}</option>)}
        </select>
        <select className="reg-select" style={{ width:52 }}>
          <option>DD</option>
          {Array.from({length:31}, (_,i) => <option key={i}>{String(i+1).padStart(2,"0")}</option>)}
        </select>
        <select className="reg-select" style={{ width:68 }}>
          <option>YYYY</option>
          {Array.from({length:years}, (_,i) => <option key={i}>{startYear - i}</option>)}
        </select>
      </div>
    </div>
  );
}

function RField({ label, w = 140 }) {
  return (
    <div className="reg-field" style={{ flex:`0 0 ${w}px`, maxWidth:"100%" }}>
      <span className="reg-label">{label}</span>
      <input className="reg-input" style={{ width:"100%" }} />
    </div>
  );
}

function Registration() {
  const [submitted, setSubmitted] = useState(false);
  const AY = ["2024-2025","2023-2024","2022-2023","2021-2022"];

  return (
    <div className="su-screen su-reg" style={{ backgroundImage: `url(${IMGS.bg_form13})` }}>
      <div className="reg-frame">

        <div className="reg-panel2" style={{ backgroundImage: `url(${IMGS.panel2_bg})` }}>
          <div>
            <div className="reg-title-big">Student Application Form</div>
            <div className="reg-school">Little Homeworld, Home School</div>
            <div className="reg-school-sub">Steven Universe · Pink Diamond, Crystal Gem</div>
          </div>
          <img className="reg-avatar" src={IMGS.picturebox1} alt="avatar" />
        </div>

        <div className="reg-section">
          <div className="reg-section-hdr" style={{ backgroundImage: `url(${IMGS.panel6_bg})` }}>Student Information</div>
          <div className="reg-body">
            <div className="reg-row">
              <RField label="Surname" w={105}/><RField label="Ext." w={55}/>
              <RField label="First Name" w={110}/><RField label="Middle Name" w={110}/>
              <DobSelect startYear={2010} years={20}/><RField label="Age" w={46}/>
            </div>
            <div className="reg-row">
              <RField label="No/Block" w={60}/><RField label="Street" w={100}/>
              <RField label="Barangay" w={100}/><RField label="Municipality" w={110}/>
              <RField label="Country" w={90}/><RField label="Postal" w={72}/>
            </div>
            <div className="reg-row">
              <RField label="Course" w={195}/>
              <div className="reg-field">
                <span className="reg-label">AY Enrolled</span>
                <select className="reg-select">{AY.map(y => <option key={y}>{y}</option>)}</select>
              </div>
              <div className="reg-field">
                <span className="reg-label">AY End</span>
                <select className="reg-select">{AY.map(y => <option key={y}>{y}</option>)}</select>
              </div>
              <div className="reg-field">
                <span className="reg-label">Section</span>
                <select className="reg-select" style={{ width:60 }}>
                  {Array.from({length:15}, (_,i) => <option key={i}>{i+1}</option>)}
                </select>
              </div>
            </div>
            <div className="reg-row">
              <RField label="Nationality" w={140}/><RField label="Religion" w={140}/>
              <div className="reg-field">
                <span className="reg-label">Gender</span>
                <div style={{ display:"flex", gap:12, marginTop:5 }}>
                  <label className="reg-checkbox"><input type="checkbox"/>Male</label>
                  <label className="reg-checkbox"><input type="checkbox"/>Female</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reg-section">
          <div className="reg-section-hdr" style={{ backgroundImage: `url(${IMGS.panel6_bg})` }}>Guardian&apos;s Information</div>
          <div className="reg-body">
            {["Father's","Mother's"].map(g => (
              <div key={g} style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"Share Tech Mono,monospace", fontSize:9, color:"#5a5040", letterSpacing:".1em", textTransform:"uppercase", marginBottom:7 }}>{g} Name</div>
                <div className="reg-row">
                  <RField label="Surname" w={105}/><RField label="Ext." w={55}/>
                  <RField label="First Name" w={110}/><RField label="Middle Name" w={110}/>
                  <DobSelect startYear={1985} years={16}/><RField label="Age" w={46}/>
                </div>
                <div className="reg-row">
                  <RField label="Occupation" w={195}/><RField label="Contact No." w={195}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reg-section">
          <div className="reg-section-hdr" style={{ backgroundImage: `url(${IMGS.panel6_bg})` }}>Educational Attainment</div>
          <div className="reg-body">
            {[
              {l:"Elementary School"},
              {l:"High School"},
              {l:"Senior High School", strand:true},
              {l:"College", campus:true},
            ].map(({l,strand,campus}) => (
              <div key={l} className="reg-row" style={{ alignItems:"flex-end" }}>
                <RField label={l} w={195}/>
                <div className="reg-field">
                  <span className="reg-label">Date Graduated</span>
                  <input className="reg-input" placeholder="MM/DD/YYYY" style={{ width:120 }}/>
                </div>
                {!campus && <RField label="Adviser" w={120}/>}
                {strand && (
                  <div className="reg-field">
                    <span className="reg-label">Track/Strand</span>
                    <select className="reg-select">
                      {["STEM","ABM","GAS","HUMSS","ICT"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                {campus && <RField label="Campus" w={120}/>}
              </div>
            ))}
          </div>
        </div>

        <div className="reg-section">
          <div className="reg-section-hdr" style={{ backgroundImage: `url(${IMGS.panel6_bg})` }}>Work Experience (if any)</div>
          <div className="reg-body">
            <textarea className="reg-textarea" rows={4} placeholder="Describe any relevant work experience…"/>
          </div>
        </div>

        <div className="reg-submit-row">
          <button
            className="btn-submit"
            style={{ backgroundImage: `url(${IMGS.panel1_bg})` }}
            onClick={() => setSubmitted(true)}
          >Submit</button>
        </div>
      </div>

      {submitted && (
        <div className="su-toast-overlay" onClick={() => setSubmitted(false)}>
          <div className="su-toast-box" onClick={e => e.stopPropagation()}>
            <div className="su-toast-icon">✓</div>
            <div className="su-toast-title">Submission Success!</div>
            <div className="su-toast-msg">Your response has been recorded.</div>
            <button className="btn-ok" onClick={() => setSubmitted(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

const APP_META = {
  calcu: { icon: calcuicon, title: "Form 6 — My Simple Calculator",      component: Calculator  },
  temp:  { icon: tempticon, title: "Forms 8-11 — Enter a Temperature",   component: Temperature },
  reg:   { icon: regisform, title: "Form 13 — Student Application Form", component: Registration },
};

function AppWindow({ appKey, onClose }) {
  const meta = APP_META[appKey];
  if (!meta) return null;
  const Content = meta.component;

  return (
    <div className="su-app-overlay" onClick={onClose}>
      <div className="su-app-window" onClick={e => e.stopPropagation()}>
        <div className="su-window-titlebar">
          <span className="su-window-title">
            <img src={meta.icon} className="su-gem-icon title-icon" alt="" />
            {meta.title}
          </span>
          {/* Replaced the 3 dots with the single 'X' button */}
          <div className="su-window-controls">
            <button className="btn-close-app" onClick={onClose}>✕</button>
          </div>
        </div>
        {/* Render the selected Application */}
        <Content />
      </div>
    </div>
  );
}

const DESKTOP_ICONS = [
  { key: "calcu", icon: calcuicon, label: "My Simple\nCalculator" },
  { key: "temp",  icon: tempticon, label: "Enter a\nTemperature" },
  { key: "reg",   icon: regisform, label: "Student\nApplication" },
];


export default function StevenUniverseWinforms() {
  const [openApp, setOpenApp] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false); 

  const handleDesktopClick = () => {
    if (startMenuOpen) setStartMenuOpen(false);
  };

  return (
    <div className="su-wf-root">
      {/* ── Desktop ── */}
      <div
        className="su-desktop"
        style={{ backgroundImage: `url(${IMGS.bg_form15})` }}
        onClick={handleDesktopClick}
      >
        {/* Right-column gem icons */}
        <div className="su-desktop-icons">
          {DESKTOP_ICONS.map(ic => (
            <div
              key={ic.key}
              className="su-desktop-icon"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the desktop click from firing
                setOpenApp(ic.key);
                setStartMenuOpen(false); // Close start menu when opening an app
              }}
            >
              <span className="su-desktop-icon-emoji">
                <img src={ic.icon} className="su-gem-icon desktop-icon" alt={ic.label} />
              </span>
              <span className="su-desktop-icon-label">
                {ic.label.split("\n").map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br/>}</span>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* Taskbar */}
        <div className="su-taskbar" onClick={(e) => e.stopPropagation()}>
          
          {/* Start Menu Button */}
          <span 
            className="su-taskbar-start" 
            title="Start" 
            onClick={() => setStartMenuOpen(!startMenuOpen)}
          >
            <img src={homegem} className="su-gem-icon taskbar-icon" alt="start menu" />
          </span>

          {/* START MENU DRAWER */}
          {startMenuOpen && (
            <div className="su-start-menu">
              <div className="su-start-header">
                Bismuth's File Viewer
              </div>
              <div className="su-start-body">
                <a 
                  href="https://github.com/ReyesFME/StevenUniverseWinforms" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="su-start-link"
                >
                  <img src={folder} className="foldericon"/>
                  Original C# WinForms Repository
                </a>
                <a 
                  href="https://res.cloudinary.com/dwqatvm5x/video/upload/q_auto/f_auto/v1780765010/Winforms_Video_Demo-silent.mp4" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="su-start-link"
                >
                  <img src={folder} className="foldericon"/>
                  Video Demo
                </a>
              </div>
            </div>
          )}

          {DESKTOP_ICONS.filter(ic => openApp === ic.key).map(ic => (
            <span
              key={ic.key}
              className="su-taskbar-gem open"
              title={APP_META[ic.key].title}
            >
              <img src={ic.icon} className="su-gem-icon taskbar-icon" alt={ic.key} />
            </span>
          ))}
          <span className="su-taskbar-label">SU Inspired WinForms, built in React for interactivity</span>
        </div>
      </div>

      {/* ── App window overlay ── */}
      {openApp && (
        <AppWindow appKey={openApp} onClose={() => setOpenApp(null)} />
      )}
    </div>
  );
}