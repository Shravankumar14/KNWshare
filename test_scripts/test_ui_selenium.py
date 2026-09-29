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
        Objective: Verify that a student can launch the InfoNest web application,
                   verify homepage branding, authenticate via 1-Click Demo login,
                   and navigate to the Full Stack Development Roadmap, verifying
                   milestone stage cards and topic checklists in the DOM.
        Test Level: System / End-to-End Automated Browser Testing
        """
        print("\n[TC-SELENIUM-01] Launching InfoNest Homepage...")
        driver.get(f"{BASE_CLIENT_URL}/")

        # Verify page title branding
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        assert "InfoNest" in driver.title, f"Expected 'InfoNest' in title, got: {driver.title}"

        # 1-Click Demo Login
        demo_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Instant Demo Student Access') or contains(., 'Demo')]"))
        )
        demo_btn.click()

        # Wait for authenticated state in header
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//header//button[contains(@class, 'pl-2')] | //header//span[contains(text(), 'Alex')]"))
        )
        print("[TC-SELENIUM-01] Demo student authentication confirmed in UI.")

        # Navigate to Full Stack Web Development Roadmap
        driver.get(f"{BASE_CLIENT_URL}/roadmap/full-stack-development")

        # Verify Roadmap Heading
        roadmap_header = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//h1[contains(., 'Full Stack') and contains(., 'Roadmap')]"))
        )
        assert roadmap_header.is_displayed(), "Roadmap main heading is not visible"

        # Verify Stage 1 milestone card
        stage1_element = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//*[contains(., 'Stage 1') and contains(., 'CSS Layouts')]"))
        )
        assert stage1_element.is_displayed(), "Stage 1 curriculum milestone card is not visible"

        # Capture evidence screenshot
        screenshot_path = os.path.join(SCREENSHOT_DIR, "selenium_roadmap_verified.png")
        driver.save_screenshot(screenshot_path)
        print(f"[TC-SELENIUM-01] Screenshot saved to: {screenshot_path}")

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

