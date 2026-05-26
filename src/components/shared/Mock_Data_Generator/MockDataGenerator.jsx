import { useState, useEffect, useRef, useMemo } from "react";
import "../../../styles/mock-data-generator.css";

// ─────────────────────────────────────────────────────────────
// PYTHON SOURCE (raw display)
// ─────────────────────────────────────────────────────────────
const PYTHON_SOURCE = `import pandas as pd
import random
import os
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker('en_PH')

NUM_RECORDS = 50

# 1. Clinical Data Dictionaries (Mapped by Service)
CLINICAL_DATA = {
    "Occupational Therapy": {
        "diagnoses": ["Sensory Processing Disorder", "Fine Motor Delay", "Dyspraxia"],
        "traits": ["Fine Motor Grasp", "Sensory Regulation", "Hand-Eye Coordination",
                   "Activities of Daily Living (ADLs)"],
        "observations": [
            "Patient demonstrated {level} independence in fine motor tasks. Exhibited sensory seeking behaviors when presented with tactile stimuli.",
            "Struggled with bilateral coordination during play. Required {level} prompting to complete the puzzle.",
            "Showed improved focus when using a weighted lap pad. ADL task (buttoning) was completed with {level} assistance."
        ],
        "home_tasks": [
            "Practice buttoning shirts and tying shoelaces for 10 minutes daily.",
            "Use resistive therapy putty to strengthen grip while watching TV.",
            "Incorporate heavy work activities (like pushing a laundry basket) before seated tasks."
        ],
        "future_plans": [
            "Introduce scissors skills using safety scissors and thick paper.",
            "Increase sensory integration exercises focusing on vestibular input.",
            "Target independent utensil use during a simulated feeding activity."
        ]
    },
    "Speech-Language Pathology": {
        "diagnoses": ["Expressive Language Delay", "Childhood Apraxia of Speech", "Autism Spectrum Disorder (ASD)"],
        "traits": ["Expressive Language (Mands/Tacts)", "Receptive Language", "Articulation", "Oral Motor Strength"],
        "observations": [
            "Patient was able to produce bilabial sounds with {level} prompting. Receptive understanding is progressing.",
            "Used {level} verbal approximations to request desired items during play-based therapy.",
            "Oral motor tone appears low. Required {level} modeling to complete blowing/sucking exercises."
        ],
        "home_tasks": [
            "Read interactive books at home and ask simple 'Wh-' questions.",
            "Practice blowing bubbles or using a straw for thick liquids to build oral motor strength.",
            "Encourage pointing and labeling (Tacting) common household items."
        ],
        "future_plans": [
            "Target 3-word sentence formulation using visual sentence strips.",
            "Introduce trials for an Augmentative and Alternative Communication (AAC) device.",
            "Focus on articulation of fricative sounds (/f/, /s/) in isolation."
        ]
    },
    "Physical Therapy": {
        "diagnoses": ["Cerebral Palsy", "Gross Motor Delay", "Hypotonia"],
        "traits": ["Gross Motor Output", "Postural Control", "Dynamic Balance", "Gait Pattern"],
        "observations": [
            "Patient displayed {level} balance during single-leg stance. Gait pattern shows slight toe-walking.",
            "Postural control is emerging. Required {level} physical support to maintain a seated position on the therapy ball.",
            "Successfully navigated the clinic stairs with {level} assistance. Lower extremity strength is improving."
        ],
        "home_tasks": [
            "Perform a supervised obstacle course in the living room using couch cushions.",
            "Practice walking up and down stairs while holding the railing.",
            "Encourage 'tummy time' or crawling through play tunnels to build core strength."
        ],
        "future_plans": [
            "Focus on core strengthening exercises using the pediatric balance board.",
            "Progress to walking on uneven surfaces (mats, wedges).",
            "Target jumping with two feet clearing the ground."
        ]
    },
    "Special Education SPED": {
        "diagnoses": ["ADHD", "Global Developmental Delay", "Specific Learning Disability"],
        "traits": ["Joint Attention", "Task Completion", "Following Directions", "Pre-academic Skills"],
        "observations": [
            "Patient completed the matching task with {level} redirection. Attention span was approximately {minutes} minutes.",
            "Required {level} visual prompts to transition between the desk and the play area.",
            "Demonstrated emerging pre-academic skills. Identified 4 out of 5 primary colors with {level} prompting."
        ],
        "home_tasks": [
            "Implement a visual schedule for morning and bedtime routines.",
            "Practice sorting objects by color or shape for 5 minutes a day.",
            "Play 'Simon Says' to practice following multi-step auditory directions."
        ],
        "future_plans": [
            "Introduce tracing worksheets for pre-writing skills.",
            "Increase independent, seated work time to 10 consecutive minutes.",
            "Target rote counting from 1 to 20 using physical manipulatives."
        ]
    },
    "Behavioral Therapy": {
        "diagnoses": ["Autism Spectrum Disorder (ASD)", "Oppositional Defiant Disorder (ODD)", "ADHD"],
        "traits": ["Frustration Tolerance", "Emotional Regulation", "Peer Interaction", "Transitioning"],
        "observations": [
            "Patient experienced minor behavioral outbursts lasting {minutes} minutes when denied access to a preferred item. Responded to {level} de-escalation.",
            "Successfully shared a toy with a peer using {level} verbal prompting. Frustration tolerance is improving.",
            "Transitioning away from the iPad required {level} physical guidance and a visual timer."
        ],
        "home_tasks": [
            "Use a 'First/Then' board at home (e.g., First eat vegetables, Then iPad).",
            "Reinforce positive behavior immediately using a token economy or sticker chart.",
            "Practice deep breathing exercises together when the child appears visibly agitated."
        ],
        "future_plans": [
            "Role-play social scenarios focusing on losing a game gracefully.",
            "Fade continuous reinforcement to an intermittent reinforcement schedule.",
            "Introduce self-monitoring checklists for emotional states (e.g., the 'Zones of Regulation')."
        ]
    }
}

# 2. Medical History Components
BIRTH_HISTORIES = ["Full-term, uncomplicated delivery", "Premature (34 weeks), 1 week NICU stay",
                   "Cesarean section, full-term", "Premature (36 weeks), no complications"]
ALLERGIES = ["None", "Peanuts", "Dairy", "Dust and Pollen", "Amoxicillin"]
MEDICATIONS = ["None", "Methylphenidate (10mg)", "Melatonin (1mg at night)", "Risperidone (0.5mg)",
               "Multivitamins only"]
LEVELS = ["Full Physical", "Partial Physical", "Visual", "Verbal", "Independent"]

print("Generating Comprehensive Medical Records...")

data = []

for _ in range(NUM_RECORDS):
    patient_id = f"HC-{random.randint(10000, 99999)}"
    service = random.choice(list(CLINICAL_DATA.keys()))
    service_data = CLINICAL_DATA[service]

    med_history = f"Birth: {random.choice(BIRTH_HISTORIES)} | Allergies: {random.choice(ALLERGIES)} | Meds: {random.choice(MEDICATIONS)}"

    selected_traits = random.sample(service_data["traits"], 2)
    trait_string = f"1. {selected_traits[0]} ({random.choice(['Emerging', 'Delayed', 'Progressing'])}), 2. {selected_traits[1]} ({random.choice(['Emerging', 'Delayed', 'Progressing'])})"

    observation = random.choice(service_data["observations"]).format(
        level=random.choice(LEVELS).lower(),
        minutes=random.randint(2, 15)
    )

    evaluation = {
        "Record_ID": f"REC-{random.randint(1000, 9999)}",
        "Patient_ID": patient_id,
        "Patient_Name": fake.name(),
        "Date_of_Session": fake.date_between(start_date='-30d', end_date='today').strftime("%Y-%m-%d"),
        "Service_Provided": service,
        "Primary_Diagnosis": random.choice(service_data["diagnoses"]),
        "Basic_Medical_History": med_history,
        "Traits_Tracked_Today": trait_string,
        "Therapist_Observation_Notes": observation,
        "Parent_Home_Task": random.choice(service_data["home_tasks"]),
        "Future_Session_Roadmap": random.choice(service_data["future_plans"])
    }

    data.append(evaluation)

df = pd.DataFrame(data)

print("\\nExporting to separate CSV files...")

folder_name = "Medical Sample Data"
if not os.path.exists(folder_name):
    os.makedirs(folder_name)

for service in CLINICAL_DATA.keys():
    service_df = df[df['Service_Provided'] == service]
    safe_filename_format = service.replace(" ", "_").replace("-", "_").lower()
    output_filename = f"mock_medical_records_{safe_filename_format}.csv"
    full_path = os.path.join(folder_name, output_filename)
    service_df.to_csv(full_path, index=False)
    print(f" - Saved {len(service_df)} records to '{full_path}'")

print("\\nProcess complete!")`;

// ─────────────────────────────────────────────────────────────
// CLINICAL DATA
// ─────────────────────────────────────────────────────────────
const CLINICAL_DATA = {
  "Occupational Therapy": {
    diagnoses: ["Sensory Processing Disorder", "Fine Motor Delay", "Dyspraxia"],
    traits: ["Fine Motor Grasp", "Sensory Regulation", "Hand-Eye Coordination", "Activities of Daily Living (ADLs)"],
    observations: [
      "Patient demonstrated {level} independence in fine motor tasks. Exhibited sensory seeking behaviors when presented with tactile stimuli.",
      "Struggled with bilateral coordination during play. Required {level} prompting to complete the puzzle.",
      "Showed improved focus when using a weighted lap pad. ADL task (buttoning) was completed with {level} assistance."
    ],
    home_tasks: [
      "Practice buttoning shirts and tying shoelaces for 10 minutes daily.",
      "Use resistive therapy putty to strengthen grip while watching TV.",
      "Incorporate heavy work activities (like pushing a laundry basket) before seated tasks."
    ],
    future_plans: [
      "Introduce scissors skills using safety scissors and thick paper.",
      "Increase sensory integration exercises focusing on vestibular input.",
      "Target independent utensil use during a simulated feeding activity."
    ]
  },
  "Speech-Language Pathology": {
    diagnoses: ["Expressive Language Delay", "Childhood Apraxia of Speech", "Autism Spectrum Disorder (ASD)"],
    traits: ["Expressive Language (Mands/Tacts)", "Receptive Language", "Articulation", "Oral Motor Strength"],
    observations: [
      "Patient was able to produce bilabial sounds with {level} prompting. Receptive understanding is progressing.",
      "Used {level} verbal approximations to request desired items during play-based therapy.",
      "Oral motor tone appears low. Required {level} modeling to complete blowing/sucking exercises."
    ],
    home_tasks: [
      "Read interactive books at home and ask simple 'Wh-' questions.",
      "Practice blowing bubbles or using a straw for thick liquids to build oral motor strength.",
      "Encourage pointing and labeling (Tacting) common household items."
    ],
    future_plans: [
      "Target 3-word sentence formulation using visual sentence strips.",
      "Introduce trials for an Augmentative and Alternative Communication (AAC) device.",
      "Focus on articulation of fricative sounds (/f/, /s/) in isolation."
    ]
  },
  "Physical Therapy": {
    diagnoses: ["Cerebral Palsy", "Gross Motor Delay", "Hypotonia"],
    traits: ["Gross Motor Output", "Postural Control", "Dynamic Balance", "Gait Pattern"],
    observations: [
      "Patient displayed {level} balance during single-leg stance. Gait pattern shows slight toe-walking.",
      "Postural control is emerging. Required {level} physical support to maintain a seated position on the therapy ball.",
      "Successfully navigated the clinic stairs with {level} assistance. Lower extremity strength is improving."
    ],
    home_tasks: [
      "Perform a supervised obstacle course in the living room using couch cushions.",
      "Practice walking up and down stairs while holding the railing.",
      "Encourage 'tummy time' or crawling through play tunnels to build core strength."
    ],
    future_plans: [
      "Focus on core strengthening exercises using the pediatric balance board.",
      "Progress to walking on uneven surfaces (mats, wedges).",
      "Target jumping with two feet clearing the ground."
    ]
  },
  "Special Education SPED": {
    diagnoses: ["ADHD", "Global Developmental Delay", "Specific Learning Disability"],
    traits: ["Joint Attention", "Task Completion", "Following Directions", "Pre-academic Skills"],
    observations: [
      "Patient completed the matching task with {level} redirection. Attention span was approximately {minutes} minutes.",
      "Required {level} visual prompts to transition between the desk and the play area.",
      "Demonstrated emerging pre-academic skills. Identified 4 out of 5 primary colors with {level} prompting."
    ],
    home_tasks: [
      "Implement a visual schedule for morning and bedtime routines.",
      "Practice sorting objects by color or shape for 5 minutes a day.",
      "Play 'Simon Says' to practice following multi-step auditory directions."
    ],
    future_plans: [
      "Introduce tracing worksheets for pre-writing skills.",
      "Increase independent, seated work time to 10 consecutive minutes.",
      "Target rote counting from 1 to 20 using physical manipulatives."
    ]
  },
  "Behavioral Therapy": {
    diagnoses: ["Autism Spectrum Disorder (ASD)", "Oppositional Defiant Disorder (ODD)", "ADHD"],
    traits: ["Frustration Tolerance", "Emotional Regulation", "Peer Interaction", "Transitioning"],
    observations: [
      "Patient experienced minor behavioral outbursts lasting {minutes} minutes when denied access to a preferred item. Responded to {level} de-escalation.",
      "Successfully shared a toy with a peer using {level} verbal prompting. Frustration tolerance is improving.",
      "Transitioning away from the iPad required {level} physical guidance and a visual timer."
    ],
    home_tasks: [
      "Use a 'First/Then' board at home (e.g., First eat vegetables, Then iPad).",
      "Reinforce positive behavior immediately using a token economy or sticker chart.",
      "Practice deep breathing exercises together when the child appears visibly agitated."
    ],
    future_plans: [
      "Role-play social scenarios focusing on losing a game gracefully.",
      "Fade continuous reinforcement to an intermittent reinforcement schedule.",
      "Introduce self-monitoring checklists for emotional states (e.g., the 'Zones of Regulation')."
    ]
  }
};

const BIRTH_HISTORIES = [
  "Full-term, uncomplicated delivery", "Premature (34 weeks), 1 week NICU stay",
  "Cesarean section, full-term", "Premature (36 weeks), no complications"
];
const ALLERGIES   = ["None", "Peanuts", "Dairy", "Dust and Pollen", "Amoxicillin"];
const MEDICATIONS = ["None", "Methylphenidate (10mg)", "Melatonin (1mg at night)", "Risperidone (0.5mg)", "Multivitamins only"];
const LEVELS      = ["Full Physical", "Partial Physical", "Visual", "Verbal", "Independent"];
const STATUSES    = ["Emerging", "Delayed", "Progressing"];
const SERVICES    = Object.keys(CLINICAL_DATA);

const PH_FIRST = ["Maria","Jose","Juan","Ana","Rosa","Carlo","Liza","Mark","Rina","Ben",
  "Celia","Danilo","Elena","Fernando","Gloria","Hector","Irene","Jaime","Karen","Luis",
  "Marisol","Noel","Ofelia","Pedro","Quirino","Rosario","Salvador","Teresita","Ulrico","Violeta",
  "Wilma","Xyza","Yolanda","Zaldy","Amelia","Bernard","Caridad","Dionisio","Esperanza","Felix"];
const PH_LAST  = ["Santos","Reyes","Cruz","Bautista","Ocampo","Garcia","Mendoza","Torres",
  "Castillo","Flores","Morales","Ramos","Aquino","Villanueva","Dela Cruz","Lopez","Gonzales",
  "Hernandez","Perez","Jimenez","Lacap","Macapagal","Navarro","Ong","Pascual","Quizon",
  "Rivera","Soriano","Tan","Umali","Valencia","Wenceslao","Xavier","Yap","Zabala"];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function sampleTwo(arr) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}
function fakeName() { return `${rnd(PH_FIRST)} ${rnd(PH_LAST)}`; }
function fakeDate() {
  const now  = new Date();
  const past = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const d    = new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
  return d.toISOString().slice(0, 10);
}

function generateRecords(n = 50) {
  const data = [];
  for (let i = 0; i < n; i++) {
    const service = rnd(SERVICES);
    const sd      = CLINICAL_DATA[service];
    const [t1, t2] = sampleTwo(sd.traits);
    const obs = rnd(sd.observations)
      .replace("{level}",   rnd(LEVELS).toLowerCase())
      .replace("{minutes}", rndInt(2, 15));
    data.push({
      Record_ID:                  `REC-${rndInt(1000, 9999)}`,
      Patient_ID:                 `HC-${rndInt(10000, 99999)}`,
      Patient_Name:               fakeName(),
      Date_of_Session:            fakeDate(),
      Service_Provided:           service,
      Primary_Diagnosis:          rnd(sd.diagnoses),
      Basic_Medical_History:      `Birth: ${rnd(BIRTH_HISTORIES)} | Allergies: ${rnd(ALLERGIES)} | Meds: ${rnd(MEDICATIONS)}`,
      Traits_Tracked_Today:       `1. ${t1} (${rnd(STATUSES)}), 2. ${t2} (${rnd(STATUSES)})`,
      Therapist_Observation_Notes: obs,
      Parent_Home_Task:           rnd(sd.home_tasks),
      Future_Session_Roadmap:     rnd(sd.future_plans),
    });
  }
  return data;
}

function groupByService(records) {
  const groups = {};
  SERVICES.forEach(s => { groups[s] = []; });
  records.forEach(r => groups[r.Service_Provided].push(r));
  return groups;
}

function toCSV(records) {
  if (!records.length) return "";
  const headers = Object.keys(records[0]);
  const escape  = v => `"${String(v).replace(/"/g, '""')}"`;
  return [headers.join(","), ...records.map(r => headers.map(h => escape(r[h])).join(","))].join("\n");
}

function downloadCSV(records, service) {
  const safe     = service.replace(/ /g, "_").replace(/-/g, "_").toLowerCase();
  const filename = `mock_medical_data-records_${safe}.csv`;
  const blob     = new Blob([toCSV(records)], { type: "text/csv" });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// TYPEWRITER HOOK
// ─────────────────────────────────────────────────────────────
function useTypewriter(lines, speed = 6) {
  const [displayed, setDisplayed] = useState([]);
  const [done,      setDone]      = useState(false);
  const timerRef = useRef(null);
  const liRef    = useRef(0);
  const ciRef    = useRef(0);

  useEffect(() => {
    if (!lines || !lines.length) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    liRef.current = 0;
    ciRef.current = 0;
    setDisplayed([]);
    setDone(false);

    const tick = () => {
      const li   = liRef.current;
      const ci   = ciRef.current;
      if (li >= lines.length) { setDone(true); return; }
      const line = lines[li];
      setDisplayed(prev => {
        const next = [...prev];
        next[li] = line.slice(0, ci + 1);
        return next;
      });
      ciRef.current++;
      if (ciRef.current > line.length) { liRef.current++; ciRef.current = 0; }
      timerRef.current = setTimeout(tick, speed);
    };
    timerRef.current = setTimeout(tick, speed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [lines, speed]);

  return { displayed, done };
}

// ─────────────────────────────────────────────────────────────
// TERMINAL GENERATOR VIEW
// ─────────────────────────────────────────────────────────────
function TerminalGenerator({ onBack }) {
  const [phase,     setPhase]     = useState("booting");
  const [genLog,    setGenLog]    = useState([]);
  const [grouped,   setGrouped]   = useState(null);
  const [activeTab, setActiveTab] = useState(SERVICES[0]);
  const scrollRef = useRef(null);

  const BOOT_LINES = useMemo(() => [
    "Medical Sample Data Generator",
    "══════════════════════════════════════════",
    "",
    "  SYSTEM   : Medical Clinical DSS v1.0",
    "  RECORDS  : 50",
    "  SERVICES : 5",
    "  LOCALE   : en_PH",
    "",
    "Initializing data pools...",
    "  [OK] Clinical Data Dictionaries loaded",
    "  [OK] Birth history pool (4 entries)",
    "  [OK] Allergy registry (5 entries)",
    "  [OK] Medication list (5 entries)",
    "  [OK] Prompt level pool (5 entries)",
    "",
    "Generating Comprehensive Medical Records...",
  ], []);

  const { displayed: bootDisplayed, done: bootDone } = useTypewriter(BOOT_LINES, 5);

  // Auto-scroll the log
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [bootDisplayed, genLog]);

  // When boot finishes → generate & build log
  useEffect(() => {
    if (!bootDone || phase !== "booting") return;
    setPhase("generating");

    const records = generateRecords(50);
    const groups  = groupByService(records);

    const log = [];
    SERVICES.forEach(svc => {
      const count = groups[svc].length;
      const safe  = svc.replace(/ /g, "_").replace(/-/g, "_").toLowerCase();
      log.push(`  - Saved ${count} records → mock_medical_records_${safe}.csv`);
    });
    log.push("");
    log.push("Process complete!");
    log.push("");
    log.push("════════════════════════════════════════════════════════════════════════════════════");
    log.push("  All records available below. Use tabs to browse by service. Download as CSV.");
    log.push("════════════════════════════════════════════════════════════════════════════════════");

    setGenLog(log);
    setGrouped(groups);

    setTimeout(() => setPhase("done"), log.length * 55 + 800);
  }, [bootDone, phase]);

  const logScrollClass = phase === "done"
    ? "mdg-term-scroll mdg-term-scroll--collapsed"
    : "mdg-term-scroll mdg-term-scroll--expanded";

  return (
    <div className="mdg-root">
      {/* Header */}
      <div className="mdg-term-bar">
        <span className="mdg-term-bar-title">mock_medical_data_generator.py</span>
        <button className="mdg-btn-back" onClick={onBack}>← BACK</button>
      </div>

      <div className="mdg-term-body">
        {/* Terminal log */}
        <div className={logScrollClass} ref={scrollRef}>
          {bootDisplayed.map((line, i) => (
            <div key={`b-${i}`} className="mdg-term-line">
              {line === "" ? "\u00A0" : (
                <span className={
                  line.startsWith("  [OK]")    ? "mdg-term-success" :
                  line.startsWith("Generating") || line.startsWith("My") ? "mdg-term-bright" :
                  "mdg-term-accent"
                }>
                  {line}
                </span>
              )}
              {i === bootDisplayed.length - 1 && !bootDone && (
                <span className="mdg-term-cursor" />
              )}
            </div>
          ))}

          {bootDone && genLog.map((line, i) => (
            <div
              key={`g-${i}`}
              className="mdg-term-line"
              style={{ animation: `fadeIn 0.1s ${i * 55}ms both` }}
            >
              <span className={
                line.startsWith("  -")                           ? "mdg-term-success" :
                line.startsWith("Process") || line.includes("═") ? "mdg-term-bright"  :
                "mdg-term-accent"
              }>
                {line || "\u00A0"}
              </span>
            </div>
          ))}
        </div>

        {/* Data panel — only after generation */}
        {phase === "done" && grouped && (
          <DataPanel
            grouped={grouped}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DATA PANEL
// ─────────────────────────────────────────────────────────────
const TABLE_COLS = [
  { key: "Record_ID",                   label: "Rec ID"      },
  { key: "Patient_ID",                  label: "Pat ID"      },
  { key: "Patient_Name",                label: "Name"        },
  { key: "Date_of_Session",             label: "Date"        },
  { key: "Primary_Diagnosis",           label: "Diagnosis"   },
  { key: "Traits_Tracked_Today",        label: "Traits"      },
  { key: "Therapist_Observation_Notes", label: "Observation" },
  { key: "Parent_Home_Task",            label: "Home Task"   },
  { key: "Future_Session_Roadmap",      label: "Roadmap"     },
];

const MONO_KEYS = new Set(["Record_ID", "Patient_ID"]);

function DataPanel({ grouped, activeTab, setActiveTab }) {
  const records = grouped[activeTab] || [];

  return (
    <div className="mdg-data-panel">
      {/* Tabs */}
      <div className="mdg-tabs">
        {SERVICES.map(svc => (
          <button
            key={svc}
            className={`mdg-tab${activeTab === svc ? " mdg-tab--active" : ""}`}
            onClick={() => setActiveTab(svc)}
          >
            {svc
              .replace("Special Education SPED", "Sp. Ed. SPED")
              .replace("Speech-Language Pathology", "Speech-Lang.")}
            <span className="mdg-tab-count">({grouped[svc]?.length ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Scrollable table wrapper */}
      <div className="mdg-table-wrap">
        <table className="mdg-table">
          <thead>
            <tr>
              <th className="mdg-th" style={{ width: "28px" }}>#</th>
              {TABLE_COLS.map(c => (
                <th key={c.key} className="mdg-th">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr
                key={r.Record_ID + i}
                className={i % 2 === 0 ? "mdg-tr--even" : "mdg-tr--odd"}
              >
                <td className="mdg-td--mono mdg-td--row-num">{i + 1}</td>
                {TABLE_COLS.map(c => (
                  <td
                    key={c.key}
                    className={MONO_KEYS.has(c.key) ? "mdg-td--mono" : "mdg-td"}
                    title={r[c.key]}
                  >
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer — always visible, never clipped */}
      <div className="mdg-table-footer">
        <span className="mdg-footer-count">
          SHOWING {records.length} RECORD{records.length !== 1 ? "S" : ""} — {activeTab.toUpperCase()}
        </span>
        <button
          className="mdg-btn-download"
          onClick={() => downloadCSV(records, activeTab)}
          title={`Download Medical_records_${activeTab.toLowerCase()}.csv`}
        >
          ↓ DOWNLOAD CSV
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SOURCE VIEWER
// ─────────────────────────────────────────────────────────────
function SourceViewer({ onBack }) {
  const lines = PYTHON_SOURCE.split("\n");
  return (
    <div className="mdg-root">
      <div className="mdg-src-header">
        <span className="mdg-src-filename">mock_medical_data_generator.py</span>
        <button className="mdg-btn-back" onClick={onBack}>← BACK</button>
      </div>
      <div className="mdg-src-scroll">
        {lines.map((line, i) => (
          <div key={i} className="mdg-src-line">
            <span className="mdg-src-num">{i + 1}</span>
            <span className="mdg-src-code">{line || " "}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHOICE SCREEN
// ─────────────────────────────────────────────────────────────
function ChoiceScreen({ onRun, onSource }) {
  return (
    <div className="mdg-root">
      <div className="mdg-choice-wrap">
        <div className="mdg-choice-path">C:\Medical Data Generator\Projects\&gt;_</div>

        <div className="mdg-choice-box">
          <div className="mdg-choice-title">Mock Medical Clinical Random Records Generator</div>
          <div className="mdg-choice-file">mock_medical_data_generator.py</div>
          <div className="mdg-choice-desc">
            50 RECORDS · 5 SERVICES · EN_PH LOCALE · CSV EXPORT
          </div>

          <div className="mdg-choice-btns">
            <button className="mdg-btn-run" onClick={onRun}>
              <span className="mdg-btn-icon">▶</span>
              RUN GENERATOR
            </button>
            <button className="mdg-btn-src" onClick={onSource}>
              <span className="mdg-btn-icon">{"</>"}</span>
              VIEW SOURCE CODE
            </button>
          </div>
        </div>

        <div className="mdg-choice-footer-top">
          <span>OCCUPATIONAL THERAPY · SPEECH-LANGUAGE · PHYSICAL THERAPY</span>
        </div>
        <div className="mdg-choice-footer-bot">
          <span>SPECIAL EDUCATION · BEHAVIORAL THERAPY</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────
export default function MockReportGeneratorApp() {
  const [view, setView] = useState("choice");

  if (view === "terminal") return <TerminalGenerator onBack={() => setView("choice")} />;
  if (view === "source")   return <SourceViewer      onBack={() => setView("choice")} />;
  return <ChoiceScreen onRun={() => setView("terminal")} onSource={() => setView("source")} />;
}