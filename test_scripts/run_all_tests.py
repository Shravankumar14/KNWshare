"""
=============================================================================
Course: CSE312 - Software Architecture: Principles and Practices
Project Title: InfoNest – Student Goal, Roadmap, Timetable & Career Guidance Platform
Master Automated Test Execution Runner & Evidence Generator
Group Members:
  1. Shravan Kumar – 2024BCS0337
  2. Charan Sai – 2024BCS0193
  3. Bhargava Rayudu – 2024BCS0017
  4. Jyoshith kumar – 2024BCS0197
  5. Vishnu – 2024BCS0205
Faculty: Dr. Renu Mary Daniel
Date: 2026-09-28
=============================================================================
"""

import os
import sys
import time
import subprocess

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EVIDENCE_DIR = os.path.join(WORKSPACE_DIR, "test_evidence")
os.makedirs(EVIDENCE_DIR, exist_ok=True)
LOG_FILE = os.path.join(EVIDENCE_DIR, "test_execution.log")
SUMMARY_FILE = os.path.join(WORKSPACE_DIR, "test_execution_summary.txt")


def log_message(msg):
    print(msg)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(msg + "\n")


def run_test_step(cmd, description):
    log_message("\n" + "=" * 76)
    log_message(f">>> RUNNING: {description}")
    log_message(f"    COMMAND: {' '.join(cmd)}")
    log_message("=" * 76)

    t0 = time.time()
    env = os.environ.copy()
    env["PYTHONPATH"] = WORKSPACE_DIR

    res = subprocess.run(cmd, cwd=WORKSPACE_DIR, env=env, capture_output=True, text=True)
    duration = time.time() - t0

    log_message(res.stdout)
    if res.stderr:
        log_message("--- STDERR ---")
        log_message(res.stderr)

    status = "PASSED" if res.returncode == 0 else "FAILED"
    log_message(f"--- STATUS: {status} (Exit Code: {res.returncode}, Duration: {duration:.2f}s) ---")
    return status, duration, res.stdout


def main():
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write("=== CSE312 AUTOMATED TEST EXECUTION LOG ===\n")
        f.write("Project: InfoNest | Date: 2026-09-28\n\n")

    log_message("============================================================================")
    log_message("        INFONEST AUTOMATED TEST SUITE EXECUTION & VERIFICATION")
    log_message("     Course: CSE312 - Software Architecture: Principles and Practices")
    log_message("============================================================================")
    log_message(" Team Members & Roll Numbers:")
    log_message("   1. Shravan Kumar   - 2024BCS0337")
    log_message("   2. Charan Sai      - 2024BCS0193")
    log_message("   3. Bhargava Rayudu - 2024BCS0017")
    log_message("   4. Jyoshith kumar  - 2024BCS0197")
    log_message("   5. Vishnu          - 2024BCS0205")
    log_message(" Faculty: Dr. Renu Mary Daniel")
    log_message(" Target Architecture: MERN Stack (Node.js API + MongoDB + React Vite)")
    log_message("============================================================================\n")

    steps = [
        (
            [sys.executable, "-m", "pytest", "test_scripts/test_backend_api.py", "-v"],
            "Pytest Automated Backend API Test Suite (Auth, Goals, Timetable, Tasks)"
        ),
        (
            [
                sys.executable, "-m", "pytest", "test_scripts/test_algorithms_whitebox.py",
                "--cov=test_scripts.scheduling_engine", "--cov-branch",
                "--cov-report=term-missing", "--cov-report=html:test_evidence/coverage_html", "-v"
            ],
            "White-Box Algorithmic Unit Tests with Statement & Branch Coverage"
        ),
        (
            [sys.executable, "-m", "pytest", "test_scripts/test_ui_selenium.py", "-v", "-s"],
            "Selenium WebDriver UI Browser E2E Tests (Roadmap Navigation & Student Registration)"
        ),
        (
            [sys.executable, "test_scripts/non_functional_tests.py"],
            "Non-Functional Testing Suite (Performance, Security, Reliability, Usability)"
        ),
        (
            [sys.executable, "-m", "pytest", "test_scripts/test_defect_regression.py", "-v"],
            "Defect Verification (BUG-01, BUG-02) and Regression Testing Suite"
        ),
    ]

    results = []
    total_start = time.time()

    for cmd, desc in steps:
        status, dur, stdout = run_test_step(cmd, desc)
        results.append((desc, status, dur))

    total_time = time.time() - total_start

    # Build Summary
    summary_text = []
    summary_text.append("=" * 80)
    summary_text.append("             CSE312 TEST EXECUTION MASTER SUMMARY REPORT")
    summary_text.append("=" * 80)
    summary_text.append(f"Project Title       : InfoNest – Student Goal, Roadmap & Career Platform")
    summary_text.append(f"Execution Date      : 2026-09-28")
    summary_text.append(f"Faculty Mentor      : Dr. Renu Mary Daniel")
    summary_text.append(f"Team Members        : Shravan Kumar (2024BCS0337), Charan Sai (2024BCS0193),")
    summary_text.append(f"                      Bhargava Rayudu (2024BCS0017), Jyoshith kumar (2024BCS0197),")
    summary_text.append(f"                      Vishnu (2024BCS0205)")
    summary_text.append(f"Total Execution Time: {total_time:.2f}s")
    summary_text.append("-" * 80)
    summary_text.append(f"{'Test Category / Suite Description':<60} {'Status':<10} {'Duration':<8}")
    summary_text.append("-" * 80)

    for desc, status, dur in results:
        summary_text.append(f"{desc[:58]:<60} {status:<10} {dur:>6.2f}s")

    summary_text.append("=" * 80)

    all_passed = all(st == "PASSED" for _, st, _ in results)
    if all_passed:
        summary_text.append(">>> OVERALL RESULT: ALL TEST SUITES PASSED WITH 100% SUCCESS RATE <<<")
    else:
        summary_text.append(">>> OVERALL RESULT: ONE OR MORE TEST SUITES ENCOUNTERED FAILURES <<<")
    summary_text.append("=" * 80)

    final_summary_str = "\n".join(summary_text)
    log_message("\n" + final_summary_str)

    with open(SUMMARY_FILE, "w", encoding="utf-8") as f:
        f.write(final_summary_str + "\n")

    log_message(f"\n[EVIDENCE RECORDED] Execution summary saved to: {SUMMARY_FILE}")
    log_message(f"[EVIDENCE RECORDED] Complete verbose logs saved to: {LOG_FILE}")


if __name__ == "__main__":
    main()
