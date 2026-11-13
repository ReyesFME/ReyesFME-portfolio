
// ── Images: all in src/assets/shared/OJT_Related/ ───────────────
import logoAomei  from '../assets/shared/OJT_Related/AOMEI.png';
import logoHdd    from '../assets/shared/OJT_Related/hdd.png';
import logoM365   from '../assets/shared/OJT_Related/ms365admin.png';
import logoOffice from '../assets/shared/OJT_Related/MSOffice.png';
import logoGoogle from '../assets/shared/OJT_Related/googleworkplace.png';

// ── Skill stickers: src/assets/shared/OJT_Related/icon-designs/ ──────
import stkImaging  from '../assets/shared/OJT_Related/icon-designs/disk-imaging.svg';
import stkSoftware from '../assets/shared/OJT_Related/icon-designs/lock.svg';
import stkHardware from '../assets/shared/OJT_Related/icon-designs/system-unit.svg';
import stkNetwork  from '../assets/shared/OJT_Related/icon-designs/network.svg';
import stkIdentity from '../assets/shared/OJT_Related/icon-designs/sysad-account.svg';
import stkAv       from '../assets/shared/OJT_Related/icon-designs/monitor.svg';

// import photoLab1  from '../assets/shared/OJT_Related/lab-1.jpg';

export const ojtGazette = {
  // Header
  title: 'PLV MIS Office',
  hours: 486,
  hoursLabel: 'Rendered Hours',
  status: 'Completed',

  // Section labels
  skillsTitle: 'Skills Acquired',
  journalTitle: 'OJT Journal Summary',
  toolsTitle: 'Tools Used',

  // ── Big image on the right: add as many as needed/preferred (arrows appear) ──
  photos: [
    // { src: photoLab1, caption: 'Imaging a laboratory fleet' },
  ],

  // ── Skill badges: SAME as the skills in the .md file ───────────────
  stickers: [
    stkImaging,   // 0 System Imaging & Deployment
    stkSoftware,  // 1 Enterprise Software Provisioning
    stkHardware,  // 2 Hardware Diagnostics & Salvaging
    stkNetwork,   // 3 Network Troubleshooting & IP Auditing
    stkIdentity,  // 4 Identity & Access Management
    stkAv,        // 5 Audiovisual & Peripheral Infrastructure
  ],

  toolLogos: [
    { name: 'AOMEI Backupper',     src: logoAomei  },
    { name: 'Hard Disk Drives',    src: logoHdd    },
    { name: 'Microsoft 365 Admin', src: logoM365   },
    { name: 'Microsoft Office',    src: logoOffice },
    { name: 'Google Workspace',    src: logoGoogle },
  ],

  // Paragraph under the tool tiles. Leave '' to list every tool from the .md.
  toolsNote:
    'Disk imaging and recovery with AOMEI Backupper, Microsoft Office and Microsoft 365 licensing, ' +
    'Google Workspace trackers for records, and hands-on hard drive diagnostics. ' +
    'Also used: AutoCAD, 3ds Max, VS Code, PyCharm, Android Studio, XAMPP, Cisco Packet Tracer, ' +
    'VirtualBox, Unity, and Blender.',

  // ── Journal. Empty list = Role Overview + Operational Impact from the .md ──
  journalDate: 'June – September 2026',
  journal: [
    // optional if want pa ng individual entry { date: 'July 9 2026', title: 'Week 1', text: 'entry text…' },
  ],

  // ── Collage column beside the journal text ──────────────────────────
  // icon: 'campus' | 'monitor' | 'user' | 'disk' | 'chip' | 'wifi'
  // quote: '' hides the red strip.  trackerMonths: [] hides the month log.  stamp: see below.
  // To use a real photo instead of the line drawing, add src: yourImport to snapshot.
  journalAside: {
    snapshot: { caption: 'fig. 01 / workstation fleet' },
    highlightsTitle: 'Scope',
    highlights: [
      { title: '2 campuses',       note: 'workspaces managed',           icon: 'campus'  },
      { title: '10 computer labs', note: 'plus most admin offices',      icon: 'monitor' },
      { title: 'Student accounts', note: 'mostly new incoming students', icon: 'user'    },
    ],
    // sign-off stamp at the bottom of the column. Remove `stamp` to hide it.
    stamp: { top: 'PLV MIS OFFICE', bottom: 'JUN – SEP 2026', status: 'COMPLETED', hours: '486 HRS' },

    // month log is off (the stamp took its place). To bring it back:
    // trackerTitle: 'Month log', trackerMonths: ['Jun', 'Jul', 'Aug', 'Sep'],
    trackerMonths: [],
    quote: '',
  },
};