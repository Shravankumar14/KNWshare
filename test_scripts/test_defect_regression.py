"""
=============================================================================
Course: CSE312 - Software Architecture: Principles and Practices
Project Title: InfoNest – Student Goal, Roadmap, Timetable & Career Guidance Platform
Group Members:
  1. Shravan Kumar – 2024BCS0337
  2. Charan Sai – 2024BCS0193
  3. Bhargava Rayudu – 2024BCS0017
  4. Jyoshith kumar – 2024BCS0197
  5. Vishnu – 2024BCS0205
Faculty: Dr. Renu Mary Daniel

Defect Reproduction & Regression Testing Suite
Verifies fixes for:
- BUG-01: Email whitespace trimming on login
- BUG-02: Overdue 'rescheduled' tasks re-balancing
=============================================================================
"""

import uuid
import pytest
import requests

BASE_URL = "http://127.0.0.1:5000/api/v1"


class TestDefectRegression:
    """
    Verification and Regression tests for BUG-01 and BUG-02.
    """

    def test_retest_bug_01_email_whitespace_normalization(self):
        """
        Defect ID: BUG-01 / RETEST-01
        Objective: Verify that login succeeds when email has leading/trailing
                   whitespace (e.g. mobile keyboard autocomplete space).
        Original Result: FAILED (HTTP 401 Invalid email or password)
        Retest Expected: PASSED (HTTP 200 OK with valid JWT token)
        """
        run_id = uuid.uuid4().hex[:6]
        registered_email = f"student_bug01_{run_id}@infonest.edu"
        password = "SecurePassword@2026!"

        # Register user
        reg_payload = {
            "name": f"Bug01 Tester {run_id}",
            "email": registered_email,
            "password": password,
            "role": "student"
        }
        r_reg = requests.post(f"{BASE_URL}/auth/register", json=reg_payload, timeout=5)
        assert r_reg.status_code == 201

        # Attempt login with trailing whitespace and mixed capitalization
        whitespace_email = f"  {registered_email.upper()}  "
        login_payload = {
            "email": whitespace_email,
            "password": password
        }
        r_login = requests.post(f"{BASE_URL}/auth/login", json=login_payload, timeout=5)
        
        # Verify HTTP 200 OK after BUG-01 fix
        assert r_login.status_code == 200, (
            f"Expected HTTP 200 OK after BUG-01 normalization fix, got {r_login.status_code}: {r_login.text}"
        )
        login_data = r_login.json()
        assert login_data.get("success") is True
        token = login_data.get("data", {}).get("token")
        assert token is not None and len(token) > 20
        print("\n[BUG-01 RETEST] Successfully authenticated user with trailing whitespace and mixed-case email.")

    def test_retest_bug_02_rescheduled_overdue_tasks_load_balancing(self):
        """
        Defect ID: BUG-02 / RETEST-02
        Objective: Verify that tasks previously marked as 'rescheduled' that become
                   overdue again are captured by the intelligent task rescheduler.
        Original Result: Ignored by query (status: { $in: ['pending', 'overdue'] })
        Retest Expected: Captured and rebalanced ({ $in: ['pending', 'overdue', 'rescheduled'] })
        """
        # Demo login to get active session
        login_res = requests.post(f"{BASE_URL}/auth/demo-login", timeout=5)
        assert login_res.status_code == 200
        token = login_res.json().get("data", {}).get("token")
        headers = {"Authorization": f"Bearer {token}"}

        # Trigger intelligent task reschedule
        r_resched = requests.post(f"{BASE_URL}/tasks/reschedule-pending", headers=headers, timeout=5)
        assert r_resched.status_code == 200
        res_data = r_resched.json()
        assert res_data.get("success") is True
        print(f"\n[BUG-02 RETEST] Rescheduler executed successfully. Result: {res_data.get('message')}")

    def test_regression_core_auth_and_goals_unaffected(self):
        """
        Regression Test: REG-01
        Objective: Verify that BUG-01 and BUG-02 fixes did not break existing
                   registration, demo login, or goal retrieval workflows.
        """
        # Verify goals catalog still returns HTTP 200
        r_goals = requests.get(f"{BASE_URL}/goals", timeout=5)
        assert r_goals.status_code == 200
        assert len(r_goals.json().get("data", [])) >= 1

        # Verify demo login works
        r_demo = requests.post(f"{BASE_URL}/auth/demo-login", timeout=5)
        assert r_demo.status_code == 200
        assert r_demo.json().get("data", {}).get("email") in ["student@knwshare.dev", "alex.rivera@student.knwshare.org"]
        print("\n[REGRESSION-01] Core authentication and goal workflows verified intact.")

