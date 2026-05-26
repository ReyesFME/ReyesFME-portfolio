import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "../../../styles/cpu-scheduler.css";

// ─────────────────────────────────────────────
// RAW SOURCE (Python file contents)
// ─────────────────────────────────────────────
const PYTHON_SOURCE = `# Reyes, Fiona Mae E. - BSIT 3-3
# CPU Scheduling Algorithms: FCFS | SJF | SRTF | Priority (Preemptive) | Round Robin

try:
    from word2number import w2n
    W2N_AVAILABLE = True
except ImportError:
    import subprocess, sys
    subprocess.run([sys.executable, "-m", "pip", "install", "word2number"],
                   capture_output=True)
    try:
        from word2number import w2n
        W2N_AVAILABLE = True
    except ImportError:
        W2N_AVAILABLE = False

def parse_number(token):
    token = token.strip()
    try:
        return int(token)
    except ValueError:
        pass
    if W2N_AVAILABLE:
        try:
            val = w2n.word_to_num(token)
            if isinstance(val, int):
                return val
            return int(val)
        except (ValueError, AttributeError):
            pass
    raise ValueError(f"Cannot parse '{token}' as a number.")

def get_positive_int(prompt):
    while True:
        raw = input(prompt).strip()
        if not raw:
            print("  Input cannot be empty. Please try again.")
            continue
        try:
            val = parse_number(raw)
            if val <= 0:
                print("  Please enter a positive whole number.")
                continue
            return val
        except ValueError:
            print(f"  '{raw}' is not a recognisable number.")

def get_int_list(prompt, n):
    values = []
    while len(values) < n:
        needed = n - len(values)
        raw = input(prompt if not values else
                    f"  Still need {needed} more value(s): ").strip()
        parts = [p.strip() for p in raw.split(",") if p.strip()]
        parsed = []
        rejected = []
        for part in parts:
            try:
                v = parse_number(part)
                if v < 0:
                    rejected.append(part)
                else:
                    parsed.append(v)
            except ValueError:
                rejected.append(part)
        if rejected:
            print(f"  Ignored: {', '.join(rejected)}")
        remaining_slots = n - len(values)
        if len(parsed) > remaining_slots:
            parsed = parsed[:remaining_slots]
        values.extend(parsed)
    return values

def run_non_preemptive(processes, choice):
    n = len(processes)
    current_time = 0
    completed_count = 0
    is_completed = [False] * n
    results = []
    gantt_chart = []
    while completed_count < n:
        available = [i for i, p in enumerate(processes)
                     if p['at'] <= current_time and not is_completed[i]]
        if not available:
            next_arrival = min(p['at'] for i, p in enumerate(processes)
                               if not is_completed[i])
            gantt_chart.append(("IDLE", current_time, next_arrival))
            current_time = next_arrival
            continue
        if choice == '1':
            idx = min(available, key=lambda i: processes[i]['at'])
        else:
            idx = min(available, key=lambda i: processes[i]['bt'])
        p = processes[idx]
        start_time = current_time
        ct  = start_time + p['bt']
        tat = ct - p['at']
        wt  = tat - p['bt']
        results.append({"id": p['id'], "at": p['at'], "bt": p['bt'],
                         "ct": ct, "tat": tat, "wt": wt})
        gantt_chart.append((p['id'], start_time, ct))
        is_completed[idx] = True
        current_time = ct
        completed_count += 1
    return results, gantt_chart

def compress_timeline(gantt_timeline):
    gantt_chart = []
    if not gantt_timeline:
        return gantt_chart
    current_p = gantt_timeline[0]
    start_t   = 0
    for t in range(1, len(gantt_timeline)):
        if gantt_timeline[t] != current_p:
            gantt_chart.append((current_p, start_t, t))
            current_p = gantt_timeline[t]
            start_t   = t
    gantt_chart.append((current_p, start_t, len(gantt_timeline)))
    return gantt_chart

def run_preemptive_standard(processes, choice):
    n = len(processes)
    current_time = 0
    completed_count = 0
    gantt_timeline = []
    results = []
    while completed_count < n:
        available = [i for i, p in enumerate(processes)
                     if p['at'] <= current_time and p['rt'] > 0]
        if not available:
            gantt_timeline.append("IDLE")
            current_time += 1
            continue
        if choice == '1':
            idx = min(available, key=lambda i: processes[i]['rt'])
        else:
            idx = min(available, key=lambda i: processes[i]['priority'])
        gantt_timeline.append(processes[idx]['id'])
        processes[idx]['rt'] -= 1
        current_time += 1
        if processes[idx]['rt'] == 0:
            completed_count += 1
            p   = processes[idx]
            ct  = current_time
            tat = ct - p['at']
            wt  = tat - p['bt']
            results.append({"id": p['id'], "at": p['at'], "bt": p['bt'],
                             "ct": ct, "tat": tat, "wt": wt})
    return results, compress_timeline(gantt_timeline)

def run_round_robin(processes, tq):
    n = len(processes)
    current_time = 0
    completed_count = 0
    gantt_timeline = []
    results = []
    queue = []
    has_arrived = [False] * n
    for i, p in enumerate(processes):
        if p['at'] <= current_time:
            queue.append(i)
            has_arrived[i] = True
    while completed_count < n:
        if not queue:
            gantt_timeline.append("IDLE")
            current_time += 1
            for i, p in enumerate(processes):
                if p['at'] <= current_time and not has_arrived[i]:
                    queue.append(i)
                    has_arrived[i] = True
            continue
        idx = queue.pop(0)
        p   = processes[idx]
        time_to_run = min(tq, p['rt'])
        arrived_during = []
        for _ in range(time_to_run):
            gantt_timeline.append(p['id'])
            current_time += 1
            for i, proc in enumerate(processes):
                if proc['at'] <= current_time and not has_arrived[i]:
                    arrived_during.append(i)
                    has_arrived[i] = True
        p['rt'] -= time_to_run
        if p['rt'] == 0:
            queue.extend(arrived_during)
            completed_count += 1
            ct  = current_time
            tat = ct - p['at']
            wt  = tat - p['bt']
            results.append({"id": p['id'], "at": p['at'], "bt": p['bt'],
                             "ct": ct, "tat": tat, "wt": wt})
        else:
            queue.extend(arrived_during)
            queue.append(idx)
    return results, compress_timeline(gantt_timeline)

def main():
    print("CPU Scheduling Algorithms")
    n = get_positive_int("\\nHow many processes? ")
    bt_list = get_int_list(f"Burst Times   (comma-separated, {n} value(s)): ", n)
    at_list = get_int_list(f"Arrival Times (comma-separated, {n} value(s)): ", n)
    print("\\nAlgorithm Groups:")
    print("  1. Non-Preemptive  (FCFS / SJF)")
    print("  2. Preemptive      (SRTF / Priority / Round Robin)")
    group = get_choice("Group Choice: ", ['1', '2'])

if __name__ == "__main__":
    main()`;

// ─────────────────────────────────────────────
// SCHEDULING ALGORITHMS (JS port)
// ─────────────────────────────────────────────
function runNonPreemptive(processes, choice) {
  const procs = processes.map(p => ({ ...p }));
  let currentTime = 0, completedCount = 0;
  const isCompleted = new Array(procs.length).fill(false);
  const results = [], gantt = [];
  while (completedCount < procs.length) {
    const available = procs
      .map((p, i) => i)
      .filter(i => procs[i].at <= currentTime && !isCompleted[i]);
    if (!available.length) {
      const nextArrival = Math.min(...procs.filter((_, i) => !isCompleted[i]).map(p => p.at));
      gantt.push({ id: "IDLE", start: currentTime, end: nextArrival });
      currentTime = nextArrival;
      continue;
    }
    const idx = choice === "fcfs"
      ? available.reduce((a, b) => procs[a].at <= procs[b].at ? a : b)
      : available.reduce((a, b) => procs[a].bt <= procs[b].bt ? a : b);
    const p = procs[idx];
    const ct = currentTime + p.bt;
    const tat = ct - p.at;
    const wt = tat - p.bt;
    results.push({ id: p.id, at: p.at, bt: p.bt, ct, tat, wt });
    gantt.push({ id: p.id, start: currentTime, end: ct });
    isCompleted[idx] = true;
    currentTime = ct;
    completedCount++;
  }
  return { results, gantt };
}

function compressTimeline(timeline) {
  if (!timeline.length) return [];
  const gantt = [];
  let cur = timeline[0], start = 0;
  for (let t = 1; t < timeline.length; t++) {
    if (timeline[t] !== cur) { gantt.push({ id: cur, start, end: t }); cur = timeline[t]; start = t; }
  }
  gantt.push({ id: cur, start, end: timeline.length });
  return gantt;
}

function runPreemptive(processes, choice) {
  const procs = processes.map(p => ({ ...p, rt: p.bt }));
  let currentTime = 0, completedCount = 0;
  const timeline = [], results = [];
  while (completedCount < procs.length) {
    const available = procs.filter(p => p.at <= currentTime && p.rt > 0);
    if (!available.length) { timeline.push("IDLE"); currentTime++; continue; }
    const sel = choice === "srtf"
      ? available.reduce((a, b) => a.rt <= b.rt ? a : b)
      : available.reduce((a, b) => a.priority <= b.priority ? a : b);
    timeline.push(sel.id);
    sel.rt--;
    currentTime++;
    if (sel.rt === 0) {
      completedCount++;
      const ct = currentTime, tat = ct - sel.at, wt = tat - sel.bt;
      results.push({ id: sel.id, at: sel.at, bt: sel.bt, ct, tat, wt });
    }
  }
  return { results, gantt: compressTimeline(timeline) };
}

function runRoundRobin(processes, tq) {
  const procs = processes.map(p => ({ ...p, rt: p.bt }));
  let currentTime = 0, completedCount = 0;
  const timeline = [], results = [], queue = [];
  const hasArrived = new Array(procs.length).fill(false);
  procs.forEach((p, i) => { if (p.at <= currentTime) { queue.push(i); hasArrived[i] = true; } });
  while (completedCount < procs.length) {
    if (!queue.length) {
      timeline.push("IDLE"); currentTime++;
      procs.forEach((p, i) => { if (p.at <= currentTime && !hasArrived[i]) { queue.push(i); hasArrived[i] = true; } });
      continue;
    }
    const idx = queue.shift();
    const p = procs[idx];
    const timeToRun = Math.min(tq, p.rt);
    const arrivedDuring = [];
    for (let k = 0; k < timeToRun; k++) {
      timeline.push(p.id); currentTime++;
      procs.forEach((proc, i) => { if (proc.at <= currentTime && !hasArrived[i]) { arrivedDuring.push(i); hasArrived[i] = true; } });
    }
    p.rt -= timeToRun;
    if (p.rt === 0) {
      queue.push(...arrivedDuring); completedCount++;
      const ct = currentTime, tat = ct - p.at, wt = tat - p.bt;
      results.push({ id: p.id, at: p.at, bt: p.bt, ct, tat, wt });
    } else {
      queue.push(...arrivedDuring); queue.push(idx);
    }
  }
  return { results, gantt: compressTimeline(timeline) };
}

// ─────────────────────────────────────────────
// TYPEWRITER HOOK
// ─────────────────────────────────────────────
function useTypewriter(lines, speed = 18) {
  const [displayed, setDisplayed] = useState([]);
  const [done, setDone] = useState(false);
  const timeoutRef = useRef(null);
  const lineRef = useRef(0);
  const charRef = useRef(0);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    lineRef.current = 0;
    charRef.current = 0;
    setDisplayed([]);
    setDone(false);
  }, []);

  useEffect(() => {
    if (!lines.length) return;
    reset();

    const tick = () => {
      const li = lineRef.current;
      const ci = charRef.current;
      if (li >= lines.length) { setDone(true); return; }

      const line = lines[li];
      setDisplayed(prev => {
        const next = [...prev];
        if (!next[li]) next[li] = "";
        next[li] = line.slice(0, ci + 1);
        return next;
      });

      charRef.current++;
      if (charRef.current > line.length) {
        lineRef.current++;
        charRef.current = 0;
      }
      timeoutRef.current = setTimeout(tick, speed);
    };

    timeoutRef.current = setTimeout(tick, speed);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [lines, speed]);

  return { displayed, done, reset };
}

// ─────────────────────────────────────────────
// TERMINAL SESSION STEPS
// ─────────────────────────────────────────────
const STEP = {
  INTRO:        "intro",
  NUM_PROCS:    "num_procs",
  BURST_TIMES:  "burst_times",
  ARRIVE_TIMES: "arrive_times",
  GROUP:        "group",
  ALGO_NP:      "algo_np",
  ALGO_P:       "algo_p",
  PRIORITIES:   "priorities",
  TIME_QUANTUM: "time_quantum",
  RESULTS:      "results",
  DONE:         "done",
};

// ─────────────────────────────────────────────
// TERMINAL COMPONENT
// ─────────────────────────────────────────────
function TerminalSession({ onBack }) {
  const [step, setStep]         = useState(STEP.INTRO);
  const [inputVal, setInputVal] = useState("");
  const [inputErr, setInputErr] = useState("");
  const [history, setHistory]   = useState([]);

  const initialSession = {
    n: 0, btList: [], atList: [], prList: [], tq: 0,
    group: "", algo: "", results: null, gantt: null, algoName: "",
  };
  const [session, setSession]   = useState(initialSession);

  // ── FIX: keep a ref that always reflects the latest session ──
  const sessionRef = useRef(initialSession);
  useEffect(() => { sessionRef.current = session; }, [session]);

  const [promptLines, setPromptLines] = useState([]);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const { displayed, done } = useTypewriter(promptLines, 12);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [displayed, history]);

  // Focus input when prompt finishes typing
  useEffect(() => {
    if (done && inputRef.current) inputRef.current.focus();
  }, [done]);

  // Set prompt for current step
  useEffect(() => {
    // Use the ref for n here so we always have the latest value
    const lines = getPromptLines(step, sessionRef.current);
    setPromptLines(lines);
    setInputVal("");
    setInputErr("");
  }, [step]);

  function getPromptLines(s, sess) {
    switch (s) {
      case STEP.INTRO:
        return [
          "╔══════════════════════════════════════════════════╗",
          "║    CPU SCHEDULING ALGORITHMS  v7.2.0             ║",
          "║                                                  ║",
          "╚══════════════════════════════════════════════════╝",
          "",
          "  Algorithms available:",
          "  · FCFS   — First Come First Serve",
          "  · SJF    — Shortest Job First",
          "  · SRTF   — Shortest Remaining Time First",
          "  · PRIO   — Preemptive Priority",
          "  · RR     — Round Robin",
          "",
          "  How many processes?",
        ];
      case STEP.BURST_TIMES:
        return [`  Enter Burst Times for ${sess.n} process(es), comma-separated:`];
      case STEP.ARRIVE_TIMES:
        return [`  Enter Arrival Times for ${sess.n} process(es), comma-separated:`];
      case STEP.GROUP:
        return [
          "  Choose algorithm group:",
          "  [1]  Non-Preemptive   (FCFS / SJF)",
          "  [2]  Preemptive       (SRTF / Priority / Round Robin)",
        ];
      case STEP.ALGO_NP:
        return [
          "  Choose algorithm:",
          "  [1]  FCFS — First Come First Serve",
          "  [2]  SJF  — Shortest Job First",
        ];
      case STEP.ALGO_P:
        return [
          "  Choose algorithm:",
          "  [1]  SRTF     — Shortest Remaining Time First",
          "  [2]  Priority — Preemptive Priority",
          "  [3]  RR       — Round Robin",
        ];
      case STEP.PRIORITIES:
        return [`  Enter Priority values for ${sess.n} process(es) (lower = higher priority), comma-separated:`];
      case STEP.TIME_QUANTUM:
        return ["  Enter Time Quantum (positive integer):"];
      default:
        return [];
    }
  }

  function parseIntList(raw, n) {
    const parts = raw.split(",").map(s => s.trim()).filter(Boolean);
    const nums = [];
    for (const p of parts) {
      const v = parseInt(p, 10);
      if (!isNaN(v) && v >= 0) nums.push(v);
    }
    return nums;
  }

  function pushHistory(lines) {
    setHistory(prev => [...prev, ...lines]);
  }

  function handleSubmit() {
    const raw = inputVal.trim();
    if (!raw) { setInputErr("Input cannot be empty."); return; }

    // ── FIX: always read from the ref, not the stale closure ──
    const cur = sessionRef.current;

    switch (step) {
      case STEP.INTRO: {
        const n = parseInt(raw, 10);
        if (isNaN(n) || n <= 0 || n > 20) { setInputErr("Enter a number between 1 and 20."); return; }
        pushHistory([`  > ${raw}`, `  ✓ ${n} process(es) registered.`, ""]);
        setSession(s => {
          const next = { ...s, n };
          sessionRef.current = next;
          return next;
        });
        setStep(STEP.BURST_TIMES);
        break;
      }
      case STEP.BURST_TIMES: {
        const nums = parseIntList(raw, cur.n);
        if (nums.length < cur.n) { setInputErr(`Need exactly ${cur.n} non-negative integers.`); return; }
        const bt = nums.slice(0, cur.n);
        const btExcess = nums.length - cur.n;
        const btNotice = btExcess > 0 ? [`  ! ${btExcess} excess value(s) ignored. Using first ${cur.n}: [${bt.join(", ")}]`] : [];
        pushHistory([`  > ${raw}`, ...btNotice, `  ✓ Burst Times: [${bt.join(", ")}]`, ""]);
        setSession(s => {
          const next = { ...s, btList: bt };
          sessionRef.current = next;
          return next;
        });
        setStep(STEP.ARRIVE_TIMES);
        break;
      }
      case STEP.ARRIVE_TIMES: {
        const nums = parseIntList(raw, cur.n);
        if (nums.length < cur.n) { setInputErr(`Need exactly ${cur.n} non-negative integers.`); return; }
        const at = nums.slice(0, cur.n);
        const atExcess = nums.length - cur.n;
        const atNotice = atExcess > 0 ? [`  ! ${atExcess} excess value(s) ignored. Using first ${cur.n}: [${at.join(", ")}]`] : [];
        pushHistory([`  > ${raw}`, ...atNotice, `  ✓ Arrival Times: [${at.join(", ")}]`, ""]);
        setSession(s => {
          const next = { ...s, atList: at };
          sessionRef.current = next;
          return next;
        });
        setStep(STEP.GROUP);
        break;
      }
      case STEP.GROUP: {
        if (!["1","2"].includes(raw)) { setInputErr("Enter 1 or 2."); return; }
        pushHistory([`  > ${raw}`, ""]);
        setSession(s => {
          const next = { ...s, group: raw };
          sessionRef.current = next;
          return next;
        });
        setStep(raw === "1" ? STEP.ALGO_NP : STEP.ALGO_P);
        break;
      }
      case STEP.ALGO_NP: {
        if (!["1","2"].includes(raw)) { setInputErr("Enter 1 or 2."); return; }
        pushHistory([`  > ${raw}`, ""]);
        const algo = raw === "1" ? "fcfs" : "sjf";
        // ── FIX: update ref synchronously before calling runAndShowResults ──
        const merged = { ...cur, algo };
        sessionRef.current = merged;
        setSession(merged);
        runAndShowResults(merged);
        break;
      }
      case STEP.ALGO_P: {
        if (!["1","2","3"].includes(raw)) { setInputErr("Enter 1, 2, or 3."); return; }
        pushHistory([`  > ${raw}`, ""]);
        if (raw === "2") {
          const next = { ...cur, algo: "priority" };
          sessionRef.current = next;
          setSession(next);
          setStep(STEP.PRIORITIES);
        } else if (raw === "3") {
          const next = { ...cur, algo: "rr" };
          sessionRef.current = next;
          setSession(next);
          setStep(STEP.TIME_QUANTUM);
        } else {
          // SRTF
          const merged = { ...cur, algo: "srtf" };
          sessionRef.current = merged;
          setSession(merged);
          runAndShowResults(merged);
        }
        break;
      }
      case STEP.PRIORITIES: {
        const nums = parseIntList(raw, cur.n);
        if (nums.length < cur.n) { setInputErr(`Need exactly ${cur.n} non-negative integers.`); return; }
        const pr = nums.slice(0, cur.n);
        const prExcess = nums.length - cur.n;
        const prNotice = prExcess > 0 ? [`  ! ${prExcess} excess value(s) ignored. Using first ${cur.n}: [${pr.join(", ")}]`] : [];
        pushHistory([`  > ${raw}`, ...prNotice, `  ✓ Priorities: [${pr.join(", ")}]`, ""]);
        const merged = { ...cur, prList: pr };
        sessionRef.current = merged;
        setSession(merged);
        runAndShowResults(merged);
        break;
      }
      case STEP.TIME_QUANTUM: {
        const tq = parseInt(raw, 10);
        if (isNaN(tq) || tq <= 0) { setInputErr("Time quantum must be a positive integer."); return; }
        pushHistory([`  > ${raw}`, `  ✓ Time Quantum: ${tq}`, ""]);
        const merged = { ...cur, tq };
        sessionRef.current = merged;
        setSession(merged);
        runAndShowResults(merged);
        break;
      }
      default: break;
    }
  }

  function runAndShowResults(sess) {
    const { btList, atList, prList, algo, tq } = sess;
    const processes = btList.map((bt, i) => ({
      id: `P${i + 1}`, at: atList[i], bt, rt: bt,
      priority: prList[i] ?? 0,
    }));

    let results, gantt;
    let algoName = "";

    if (algo === "fcfs" || algo === "sjf") {
      ({ results, gantt } = runNonPreemptive(processes, algo));
      algoName = algo === "fcfs" ? "First Come First Serve (FCFS)" : "Shortest Job First (SJF)";
    } else if (algo === "srtf" || algo === "priority") {
      ({ results, gantt } = runPreemptive(processes, algo));
      algoName = algo === "srtf" ? "Shortest Remaining Time First (SRTF)" : "Preemptive Priority";
    } else {
      ({ results, gantt } = runRoundRobin(processes, tq));
      algoName = `Round Robin (TQ = ${tq})`;
    }

    results.sort((a, b) => parseInt(a.id.slice(1)) - parseInt(b.id.slice(1)));
    const totalTat = results.reduce((s, r) => s + r.tat, 0);
    const totalWt  = results.reduce((s, r) => s + r.wt, 0);

    const final = { ...sess, results, gantt, algoName, totalTat, totalWt };
    sessionRef.current = final;
    setSession(final);
    setStep(STEP.RESULTS);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  function handleReset() {
    const fresh = { n: 0, btList: [], atList: [], prList: [], tq: 0, group: "", algo: "", results: null, gantt: null };
    sessionRef.current = fresh;
    setSession(fresh);
    setHistory([]);
    setStep(STEP.INTRO);
  }

  const showInput = done && step !== STEP.RESULTS && step !== STEP.DONE;

  return (
    <div className="cpu-terminal">
      <div className="cpu-terminal-scroll" ref={scrollRef}>
        {/* History (already typed lines) */}
        {history.map((line, i) => (
          <div key={`h-${i}`} className="cpu-line cpu-line--history">{line || "\u00A0"}</div>
        ))}

        {/* Currently typing lines */}
        {displayed.map((line, i) => (
          <div key={`d-${i}`} className="cpu-line cpu-line--typing">
            {line || "\u00A0"}
            {i === displayed.length - 1 && !done && <span className="cpu-cursor">█</span>}
          </div>
        ))}

        {/* Results display */}
        {step === STEP.RESULTS && session.results && (
          <ResultsPanel session={session} onReset={handleReset} onBack={onBack} />
        )}
      </div>

      {/* Input area */}
      {showInput && (
        <div className="cpu-input-row">
          <span className="cpu-prompt-sym">C:\&gt;</span>
          <input
            ref={inputRef}
            className="cpu-input"
            type="text"
            value={inputVal}
            onChange={e => { setInputVal(e.target.value); setInputErr(""); }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      )}
      {inputErr && <div className="cpu-input-err">{inputErr}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULTS PANEL
// ─────────────────────────────────────────────
function ResultsPanel({ session, onReset, onBack }) {
  const { results, gantt, algoName, totalTat, totalWt } = session;
  const n = results.length;

  // ── FIX: memoize so the array reference is stable across re-renders.
  // useTypewriter depends on `lines` — a new array every render caused
  // reset() → setDisplayed([]) → re-render → new array → infinite loop.
  const allLines = useMemo(() => {
    const ganttTop    = "  " + gantt.map(g => `|  ${g.id.padEnd(4)} `).join("") + "|";
    const ganttBottom = "  " + gantt.map(g => String(g.start).padEnd(7)).join("") + String(gantt[gantt.length - 1]?.end ?? "");
    return [
      "",
      `  ┌─ RESULTS: ${algoName} ${"─".repeat(Math.max(0, 42 - algoName.length))}┐`,
      `  │  ${"Process".padEnd(9)}${"AT".padEnd(5)}${"BT".padEnd(5)}${"CT".padEnd(5)}${"TAT".padEnd(5)}${"WT".padEnd(5)}│`,
      `  ├${"─".repeat(44)}┤`,
      ...results.map(r =>
        `  │  ${r.id.padEnd(9)}${String(r.at).padEnd(5)}${String(r.bt).padEnd(5)}${String(r.ct).padEnd(5)}${String(r.tat).padEnd(5)}${String(r.wt).padEnd(5)}│`
      ),
      `  ├${"─".repeat(44)}┤`,
      `  │  Avg TAT: ${(totalTat / n).toFixed(2).padEnd(8)} Avg WT: ${(totalWt / n).toFixed(2).padEnd(12)}│`,
      `  └${"─".repeat(44)}┘`,
      "",
      "  GANTT CHART:",
      ganttTop,
      ganttBottom,
      "",
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // session data never changes once ResultsPanel mounts — safe empty deps

  const { displayed, done } = useTypewriter(allLines, 10);

  return (
    <div className="cpu-results">
      {displayed.map((line, i) => (
        <div key={i} className="cpu-line cpu-line--result">
          {line || "\u00A0"}
          {i === displayed.length - 1 && !done && <span className="cpu-cursor">█</span>}
        </div>
      ))}
      {done && (
        <div className="cpu-results-actions">
          <button className="cpu-action-btn" onClick={onReset}>↺ Run Again</button>
          <button className="cpu-action-btn cpu-action-btn--muted" onClick={onBack}>← Back</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SOURCE VIEWER COMPONENT
// ─────────────────────────────────────────────
function SourceViewer({ onBack }) {
  const lines = PYTHON_SOURCE.split("\n");
  return (
    <div className="cpu-source-viewer">
      <div className="cpu-source-header">
        <span className="cpu-source-filename"> CPU_scheduling_algorithms.py</span>
        <button className="cpu-action-btn cpu-action-btn--muted" onClick={onBack}>← Back</button>
      </div>
      <div className="cpu-source-scroll">
        {lines.map((line, i) => (
          <div key={i} className="cpu-source-line">
            <span className="cpu-source-linenum">{String(i + 1).padStart(3, " ")}</span>
            <span className="cpu-source-code">{line || "\u00A0"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────
const CPUSchedulerApp = () => {
  const [view, setView] = useState("choice"); // choice | terminal | source

  if (view === "terminal") return <TerminalSession onBack={() => setView("choice")} />;
  if (view === "source")   return <SourceViewer   onBack={() => setView("choice")} />;

  return (
    <div className="cpu-choice-screen">
      <div className="cpu-choice-glow" />
      <div className="cpu-choice-card">
        <div className="cpu-choice-title">CPU_scheduling_algorithms.py</div>
        <div className="cpu-choice-desc">
          FCFS · SJF · SRTF · Preemptive Priority · Round Robin
        </div>
        <div className="cpu-choice-btns">
          <button className="cpu-choice-btn cpu-choice-btn--run" onClick={() => setView("terminal")}>
            <span className="cpu-choice-btn-icon">▶</span>
            Run Interactive Demo
          </button>
          <button className="cpu-choice-btn cpu-choice-btn--src" onClick={() => setView("source")}>
            <span className="cpu-choice-btn-icon">{"</>"}</span>
            View Source Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default CPUSchedulerApp;