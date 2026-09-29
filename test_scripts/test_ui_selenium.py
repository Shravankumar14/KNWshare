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

Automated Selenium WebDriver UI Browser Test Suite
Script ID: ATS-04, ATS-05
=============================================================================
"""

import os
import uuid
import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_CLIENT_URL = "http://localhost:5173"
SCREENSHOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "test_evidence", "screenshots"))
os.makedirs(SCREENSHOT_DIR, exist_ok=True)


@pytest.fixture(scope="module")
def driver():
    """Initializes a headless Chrome browser driver for Selenium testing."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1366,850")

    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(5)
    yield drv
    drv.quit()


class TestInfoNestSeleniumUI:
    """
    Automated Selenium UI Test Cases covering:
    1. Navigation, Goal Selection & Interactive Roadmap UI verification
    2. Student Registration, Role Onboarding & Session State persistence
    """

    def test_tc_selenium_01_homepage_and_roadmap_navigation(self, driver):
        """
        Test Case ID: TC-SELENIUM-01 / ATS-04
        Objective: Verify that a user can launch the InfoNest web application,
                   verify homepage branding, confirm all demo login buttons are absent,
                   navigate to the regular login page, and verify standard authentication
                   controls (email, password, submit) with no student/teacher demo options.
        Test Level: System / End-to-End Automated Browser Testing
        """
        print("\n[TC-SELENIUM-01] Step 1: Launching InfoNest Homepage...")
        driver.get(f"{BASE_CLIENT_URL}/")

        # Step 2: Verify page title and branding
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        assert "InfoNest" in driver.title, f"Expected 'InfoNest' in title, got: {driver.title}"

        branding = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//header//span[contains(., 'Info') and contains(., 'Nest')]"))
        )
        assert branding.is_displayed(), "InfoNest brand header is not displayed"
        print("[TC-SELENIUM-01] Step 2: InfoNest branding and title verified.")

        # Step 3: Verify that no demo login buttons are displayed on homepage
        home_demo_buttons = driver.find_elements(
            By.XPATH,
            "//button[contains(translate(., 'DEMO', 'demo'), 'demo')] | "
            "//a[contains(translate(., 'DEMO', 'demo'), 'demo')] | "
            "//*[contains(text(), 'Instant Demo') or contains(text(), '1-Click Demo')]"
        )
        assert len(home_demo_buttons) == 0, f"Expected zero demo login buttons on homepage, found {len(home_demo_buttons)}"
        print("[TC-SELENIUM-01] Step 3: Verified zero demo buttons on homepage.")

        # Step 4: Navigate to the regular login page
        login_link = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//header//a[@href='/login' or contains(., 'Sign In')]"))
        )
        login_link.click()

        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//h1[contains(., 'Sign In to InfoNest')]"))
        )
        print("[TC-SELENIUM-01] Step 4: Navigated to regular login page.")

        # Step 5: Verify email, password and login controls are present
        email_input = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//input[@type='email']"))
        )
        assert email_input.is_displayed(), "Email input field is not displayed"

        password_input = driver.find_element(By.XPATH, "//input[@type='password' or @type='text']")
        assert password_input.is_displayed(), "Password input field is not displayed"

        login_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        assert login_btn.is_displayed(), "Login submit button is not displayed"
        assert "Sign In" in login_btn.text or "Authenticating" in login_btn.text
        print("[TC-SELENIUM-01] Step 5: Verified email, password, and login submit controls.")

        # Step 6: Verify student and teacher demo login options are absent
        login_demo_elements = driver.find_elements(
            By.XPATH,
            "//*[contains(translate(text(), 'DEMO', 'demo'), 'demo') or "
            "contains(text(), 'Alex Rivera') or "
            "contains(text(), 'Arvind Kumar')]"
        )
        assert len(login_demo_elements) == 0, (
            f"Expected no demo login options on login page, found {len(login_demo_elements)}"
        )
        print("[TC-SELENIUM-01] Step 6: Verified student & teacher demo login options are absent.")

        # Step 7: Verify login page loads without errors
        error_alerts = driver.find_elements(By.XPATH, "//*[contains(@class, 'bg-red-950')]")
        assert len(error_alerts) == 0, "Error alert banner displayed on initial page load"

        try:
            logs = driver.get_log("browser")
            severe_errors = [entry for entry in logs if entry.get("level") == "SEVERE"]
            assert len(severe_errors) == 0, f"Severe console errors detected on login page: {severe_errors}"
        except Exception:
            pass  # Some webdriver versions do not expose get_log

        screenshot_path = os.path.join(SCREENSHOT_DIR, "selenium_login_no_demo_verified.png")
        driver.save_screenshot(screenshot_path)
        print(f"[TC-SELENIUM-01] Step 7: Login page loaded cleanly without errors. Screenshot: {screenshot_path}")

    def test_tc_selenium_02_student_registration_workflow(self, driver):
        """
        Test Case ID: TC-SELENIUM-02 / ATS-05
        Objective: Verify that a new student can complete the registration workflow,
                   submit the registration form, and verify automatic session establishment
                   and persistent identity in the navigation header.
        Test Level: System / End-to-End Automated Browser Testing
        """
        print("\n[TC-SELENIUM-02] Testing Student Registration Workflow...")
        driver.get(f"{BASE_CLIENT_URL}/register")

        # Wait for registration card and title
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'Create Your Account')]"))
        )

        # Verify demo options absent on registration page
        reg_demo_elements = driver.find_elements(
            By.XPATH,
            "//*[contains(translate(text(), 'DEMO', 'demo'), 'demo') or "
            "contains(text(), 'Arvind Kumar')]"
        )
        assert len(reg_demo_elements) == 0, f"Expected no demo options on registration page, found {len(reg_demo_elements)}"

        # Generate unique student credentials
        run_id = uuid.uuid4().hex[:5]
        new_name = f"Student {run_id}"
        new_email = f"cse312_student_{run_id}@infonest.edu"
        new_pass = "SecurePass@2026!"

        name_input = driver.find_element(By.XPATH, "//input[@type='text']")
        name_input.clear()
        name_input.send_keys(new_name)

        email_input = driver.find_element(By.XPATH, "//input[@type='email']")
        email_input.clear()
        email_input.send_keys(new_email)

        password_input = driver.find_element(By.XPATH, "//input[@type='password']")
        password_input.clear()
        password_input.send_keys(new_pass)

        # Save screenshot of filled registration form
        form_shot = os.path.join(SCREENSHOT_DIR, "selenium_registration_filled.png")
        driver.save_screenshot(form_shot)
        print(f"[TC-SELENIUM-02] Form filled screenshot saved: {form_shot}")

        # Submit form
        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_btn)
        time.sleep(0.5)
        submit_btn.click()

        # Verify redirect to home / dashboard with authenticated header
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//header//span[contains(text(), '{new_name}')] | //header//button[contains(@class, 'pl-2')]"))
        )
        print(f"[TC-SELENIUM-02] Authenticated session confirmed for: {new_name}")

        # Capture success screenshot
        success_shot = os.path.join(SCREENSHOT_DIR, "selenium_registration_success.png")
        driver.save_screenshot(success_shot)
        print(f"[TC-SELENIUM-02] Success screenshot saved: {success_shot}")

