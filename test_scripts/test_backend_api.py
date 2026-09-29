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

Automated Backend API Test Suite (Pytest)
Script ID: ATS-01, ATS-02
=============================================================================
"""

import uuid
import pytest
import requests

BASE_URL = "http://127.0.0.1:5000/api/v1"



class TestInfoNestBackendAPI:
    """
    Automated Pytest API test cases covering Authentication, Protected Routes,
    Goal Selection, Timetable Generation, and Security Boundaries.
    """

    def test_tc_auth_01_student_registration_and_profile_access(self):
        """
        Test Case ID: TC-AUTH-01 / ATS-01
        Objective: Verify that a student can successfully register, receive a valid
                   JWT bearer token, and access the protected profile endpoint (/auth/me).
        Test Level: Integration / Automated API Testing
        Type: Positive Functional Test
        """
        run_id = uuid.uuid4().hex[:6]
        student_email = f"cse312_student_{run_id}@infonest.edu"
        student_password = "SecurePassword@2026!"
        student_name = "Shravan Kumar (2024BCS0337)"

        # 1. Register student
        payload = {
            "name": student_name,
            "email": student_email,
            "password": student_password,
            "role": "student",
            "bio": "CSE312 Software Architecture Project Member"
        }
        res = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        assert res.status_code == 201, f"Expected 201 Created, got {res.status_code}: {res.text}"
        data = res.json()
        assert data.get("success") is True
        token = data.get("data", {}).get("token")
        assert token is not None and len(token) > 20, "Valid JWT token must be returned"
        assert data.get("data", {}).get("email") == student_email.lower()

        # 2. Access protected profile route
        headers = {"Authorization": f"Bearer {token}"}
        profile_res = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        assert profile_res.status_code == 200, f"Expected 200 OK, got {profile_res.status_code}"
        profile_data = profile_res.json()
        assert profile_data.get("success") is True
        assert profile_data.get("data", {}).get("email") == student_email.lower()
        assert profile_data.get("data", {}).get("name") == student_name
        print(f"\n[TC-AUTH-01] Successfully registered {student_email} and verified JWT profile access.")

    def test_tc_auth_02_negative_security_and_boundary_rejection(self):
        """
        Test Case ID: TC-AUTH-02 / ATS-02
        Objective: Verify security and input boundaries:
                   (a) Reject login with incorrect password (HTTP 401)
                   (b) Reject duplicate registration with existing email (HTTP 400)
                   (c) Reject access to protected profile without token (HTTP 401)
        Test Level: Integration / Security Testing
        Type: Negative Boundary Test
        """
        run_id = uuid.uuid4().hex[:6]
        seed_email = f"cse312_sec_{run_id}@infonest.edu"
        seed_password = "Password@123456"

        # Register seed user
        setup_payload = {
            "name": "Security Boundary Test User",
            "email": seed_email,
            "password": seed_password,
            "role": "student"
        }
        setup_res = requests.post(f"{BASE_URL}/auth/register", json=setup_payload, timeout=10)
        assert setup_res.status_code == 201

        # Scenario A: Wrong password
        bad_login = {
            "email": seed_email,
            "password": "WrongPassword_999!"
        }
        login_res = requests.post(f"{BASE_URL}/auth/login", json=bad_login, timeout=10)
        assert login_res.status_code == 401, f"Expected 401, got {login_res.status_code}"
        assert login_res.json().get("success") is False
        assert "Invalid email or password" in login_res.json().get("message", "")

        # Scenario B: Duplicate email registration
        dup_payload = {
            "name": "Duplicate Tester",
            "email": seed_email,
            "password": "AnotherPassword@2026"
        }
        dup_res = requests.post(f"{BASE_URL}/auth/register", json=dup_payload, timeout=10)
        assert dup_res.status_code == 400, f"Expected 400, got {dup_res.status_code}"
        assert dup_res.json().get("success") is False
        assert "already exists" in dup_res.json().get("message", "").lower()

        # Scenario C: Protected route access without token
        unauth_res = requests.get(f"{BASE_URL}/auth/me", timeout=10)
        assert unauth_res.status_code == 401
        assert unauth_res.json().get("success") is False

        print("\n[TC-AUTH-02] Successfully verified negative authentication and security boundary rejections.")

    def test_tc_goal_01_catalog_retrieval_and_goal_enrollment(self):
        """
        Test Case ID: TC-GOAL-01 / ATS-05
        Objective: Verify that goals catalog can be fetched and student can enroll
                   in 'Full Stack Development' goal.
        Test Level: Integration Testing
        Type: Positive Functional Test
        """
        # Fetch goals
        res = requests.get(f"{BASE_URL}/goals", timeout=10)
        assert res.status_code == 200
        goals_data = res.json().get("data", [])
        assert len(goals_data) >= 1, "At least 1 curated goal must be available"
        
        # Pick Full Stack Development or first available
        target_goal = next((g for g in goals_data if "full-stack" in g.get("slug", "")), goals_data[0])
        goal_id = target_goal["_id"]

        # Demo login to get token
        login_res = requests.post(f"{BASE_URL}/auth/demo-login", timeout=10)
        assert login_res.status_code == 200
        token = login_res.json().get("data", {}).get("token")
        headers = {"Authorization": f"Bearer {token}"}

        # Enroll in goal
        enroll_res = requests.post(f"{BASE_URL}/goals/select", json={"goalId": goal_id, "hoursPerDay": 3}, headers=headers, timeout=10)
        assert enroll_res.status_code in [200, 201], f"Expected 200/201, got {enroll_res.status_code}: {enroll_res.text}"
        enroll_json = enroll_res.json()
        assert enroll_json.get("success") is True
        print(f"\n[TC-GOAL-01] Successfully enrolled in goal: {target_goal.get('title')}")

    def test_tc_time_01_weekly_timetable_and_task_generation(self):
        """
        Test Case ID: TC-TIME-01 / ATS-06
        Objective: Verify timetable service generates a balanced schedule and
                   creates actionable tasks in the database.
        Test Level: Integration Testing
        Type: Positive Functional Test
        """
        # Demo login
        login_res = requests.post(f"{BASE_URL}/auth/demo-login", timeout=10)
        assert login_res.status_code == 200
        token = login_res.json().get("data", {}).get("token")
        headers = {"Authorization": f"Bearer {token}"}

        # Generate Timetable
        payload = {
            "availableDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "dailyHours": 2,
            "preferredSlot": "morning",
            "includeBreaks": True
        }
        gen_res = requests.post(f"{BASE_URL}/timetable/generate", json=payload, headers=headers, timeout=10)
        assert gen_res.status_code == 201, f"Expected 201 Created, got {gen_res.status_code}: {gen_res.text}"
        data = gen_res.json()
        assert data.get("success") is True
        tasks_count = data.get("tasksGenerated", 0)
        assert tasks_count > 0, "Timetable generation must produce at least 1 task"

        # Verify tasks endpoint returns these tasks
        tasks_res = requests.get(f"{BASE_URL}/tasks", headers=headers, timeout=10)
        assert tasks_res.status_code == 200
        tasks_list = tasks_res.json().get("data", [])
        assert len(tasks_list) >= tasks_count
        print(f"\n[TC-TIME-01] Successfully generated timetable with {tasks_count} study/practice tasks.")
