# Reyes, Fiona Mae E. - BSIT 3-3
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

# -----------------------------------------
# WORD-TO-NUMBER PARSER
# -----------------------------------------

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


# -----------------------------------------
# INPUT HELPERS
# -----------------------------------------

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
            print(f"  '{raw}' is not a recognisable number. "
                  f"Try digits (e.g. 4) or words (e.g. four).")


def get_int_list(prompt, n):
    values = []
    while len(values) < n:
        needed = n - len(values)
        raw = input(prompt if not values else
                    f"  Still need {needed} more value(s) - enter them now: ").strip()

        if not raw:
            print("  Input cannot be empty.")
            continue

        parts = [p.strip() for p in raw.split(",") if p.strip()]
        if not parts:
            print("  No entries found. Please separate values with commas.")
            continue

        parsed   = []
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
            print(f"  Ignored unrecognised entries: {', '.join(rejected)}")

        if not parsed:
            print("  No valid numbers found. "
                  "Use digits (3) or words (three) separated by commas.")
            continue

        remaining_slots = n - len(values)

        if len(parsed) > remaining_slots:
            trimmed = parsed[remaining_slots:]
            parsed  = parsed[:remaining_slots]
            print(f"  Too many values - trimmed the excess: "
                  f"{', '.join(map(str, trimmed))}")

        values.extend(parsed)

    return values


def get_choice(prompt, valid_choices):
    while True:
        raw = input(prompt).strip()
        if raw in valid_choices:
            return raw
        print(f"  Invalid choice. Please enter one of: {', '.join(valid_choices)}")


# -----------------------------------------
# OUTPUT HELPERS
# -----------------------------------------

def print_results_table(results, n):
    print("\n{:<8} {:<4} {:<4} {:<4} {:<4} {:<4}".format(
        "Process", "AT", "BT", "CT", "TAT", "WT"))
    print("-" * 35)
    total_tat, total_wt = 0, 0
    for r in sorted(results, key=lambda x: int(x['id'][1:])):
        print("{:<8} {:<4} {:<4} {:<4} {:<4} {:<4}".format(
            r['id'], r['at'], r['bt'], r['ct'], r['tat'], r['wt']))
        total_tat += r['tat']
        total_wt += r['wt']
    print("-" * 35)
    return total_tat, total_wt


def print_gantt_chart(gantt_chart):
    print("\nGANTT CHART:")
    for item in gantt_chart:
        print(f"|  {item[0]}  ", end="")
    print("|")
    for item in gantt_chart:
        print(f"{item[1]:<7}", end="")
    if gantt_chart:
        print(gantt_chart[-1][2])


# -----------------------------------------
# ALGORITHM: FCFS & SJF (Non-Preemptive)
# -----------------------------------------

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

    return results, gantt_chart, current_time


# -----------------------------------------
# ALGORITHM: SRTF & PREEMPTIVE PRIORITY
# -----------------------------------------

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


# -----------------------------------------
# ALGORITHM: ROUND ROBIN
# -----------------------------------------

def run_round_robin(processes, tq):
    n = len(processes)
    current_time = 0
    completed_count = 0
    gantt_timeline = []
    results = []
    queue = []
    has_arrived = [False] * n

    # Queue processes already present at t=0
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

        # Run tick by tick, buffering new arrivals separately
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
            # Process done: new arrivals join queue, current does not re-queue
            queue.extend(arrived_during)
            completed_count += 1
            ct  = current_time
            tat = ct - p['at']
            wt  = tat - p['bt']
            results.append({"id": p['id'], "at": p['at'], "bt": p['bt'],
                             "ct": ct, "tat": tat, "wt": wt})
        else:
            # Not done: arrivals go first, then current re-queues at the back
            queue.extend(arrived_during)
            queue.append(idx)

    return results, compress_timeline(gantt_timeline)


# -----------------------------------------
# GANTT CHART COMPRESSION
# -----------------------------------------

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


# -----------------------------------------
# MAIN
# -----------------------------------------

def main():
    print("CPU Scheduling Algorithms")

    if not W2N_AVAILABLE:
        print("  Note: word2number not installed - word inputs (e.g. 'three') "
              "won't be recognised.\n  Run:  pip install word2number")

    n = get_positive_int("\nHow many processes? ")

    print(f"\nPlease input {n} value(s) for each process below.")
    bt_list = get_int_list(f"Burst Times   (comma-separated, {n} value(s)): ", n)
    at_list = get_int_list(f"Arrival Times (comma-separated, {n} value(s)): ", n)

    print("\nChoose Algorithm Group:")
    print("  1. Non-Preemptive  (FCFS / SJF)")
    print("  2. Preemptive      (SRTF / Priority / Round Robin)")
    group = get_choice("Group Choice: ", ['1', '2'])

    processes = []
    for i in range(n):
        processes.append({
            "id":       f"P{i + 1}",
            "at":       at_list[i],
            "bt":       bt_list[i],
            "rt":       bt_list[i],
            "priority": 0
        })

    if group == '1':
        print("\nChoose Algorithm: 1. FCFS  |  2. SJF")
        choice = get_choice("Choice: ", ['1', '2'])

        results, gantt_chart, final_time = run_non_preemptive(processes, choice)

        algo_name = "First Come First Serve (FCFS)" if choice == '1' \
                    else "Shortest Job First (SJF)"
        print(f"\n--- Results: {algo_name} ---")
        total_tat, total_wt = print_results_table(results, n)
        print_gantt_chart(gantt_chart)

    else:
        print("\nChoose Algorithm: 1. SRTF  |  2. Priority (Preemptive)  |  3. Round Robin")
        choice = get_choice("Choice: ", ['1', '2', '3'])

        if choice == '2':
            pr_list = get_int_list(
                f"Priorities (comma-separated, {n} value(s), lower = higher priority): ", n)
            for i in range(n):
                processes[i]['priority'] = pr_list[i]

        tq = 0
        if choice == '3':
            tq = get_positive_int("Time Quantum: ")

        if choice in ['1', '2']:
            results, gantt_chart = run_preemptive_standard(processes, choice)
        else:
            results, gantt_chart = run_round_robin(processes, tq)

        algo_name = {
            '1': "Shortest Remaining Time First (SRTF)",
            '2': "Preemptive Priority",
            '3': f"Round Robin (TQ = {tq})"
        }[choice]
        print(f"\n--- Results: {algo_name} ---")
        total_tat, total_wt = print_results_table(results, n)
        print_gantt_chart(gantt_chart)

    print(f"\nAverage TAT : {total_tat / n:.2f}")
    print(f"Average WT  : {total_wt / n:.2f}")
    print()


if __name__ == "__main__":
    main()