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

White-Box Unit Testing Suite with Branch & Statement Coverage
Script ID: ATS-03 / UT-01, UT-02, UT-03, UT-04, WB-01, WB-02
=============================================================================
"""

import pytest
import sys
import os

try:
    from test_scripts.scheduling_engine import (
        format_slot_time,
        calculate_daily_max_capacity,
        redistribute_overdue_tasks,
        generate_study_timetable_slots
    )
except ImportError:
    sys.path.insert(0, os.path.dirname(__file__))
    from scheduling_engine import (
        format_slot_time,
        calculate_daily_max_capacity,
        redistribute_overdue_tasks,
        generate_study_timetable_slots
    )



class TestWhiteBoxAlgorithms:
    """
    White-Box Unit Tests verifying statement and branch execution paths
    for the scheduling and task redistribution engines.
    """

    def test_wb_01_empty_pending_tasks_branch(self):
        """
        Test ID: WB-01 / UT-01
        Objective: Test Branch A of redistribute_overdue_tasks when pending list is empty.
        Coverage: Path condition: if not pending_tasks -> returns 0 count.
        """
        res = redistribute_overdue_tasks([], ["2026-09-29", "2026-09-30"], {}, 144)
        assert res["rescheduled_count"] == 0
        assert res["assignments"] == []

    def test_wb_02_task_redistribution_under_capacity_and_overflow(self):
        """
        Test ID: WB-02 / UT-02
        Objective: Test Branch B (earliest day with capacity) AND Branch C (fallback to min-load day).
        Coverage: Exercises both inner condition (load + duration <= max) and fallback reduce loop.
        """
        future_days = ["2026-09-29", "2026-09-30", "2026-10-01"]
        existing_loads = {"2026-09-29": 100, "2026-09-30": 80}
        max_cap = 120  # Max capacity 120 minutes

        tasks = [
            {"id": "task_1", "title": "Maths Revision", "durationMinutes": 30}, # Fits on day 2 (80+30=110 <= 120)
            {"id": "task_2", "title": "Physics Problems", "durationMinutes": 60}, # Fits on uninitialized day 3 (0+60=60 <= 120)
            {"id": "task_3", "title": "Chemistry Mock Test", "durationMinutes": 100} # Exceeds all capacities -> triggers fallback to min-load day (day 3 has 60)
        ]

        res = redistribute_overdue_tasks(tasks, future_days, existing_loads, max_cap)
        assert res["rescheduled_count"] == 3
        assert res["assignments"][0]["target_day"] == "2026-09-30"
        assert res["assignments"][1]["target_day"] == "2026-10-01"
        assert res["assignments"][2]["target_day"] == "2026-10-01"



    def test_wb_03_capacity_calculator_branches(self):
        """
        Test ID: WB-03 / UT-03
        Objective: Test both branches of calculate_daily_max_capacity:
                   Branch 1: hours_per_day <= 0 (defaults to 2 hrs -> 144 min)
                   Branch 2: hours_per_day > 0 (uses supplied hours)
        """
        cap_default = calculate_daily_max_capacity(0)
        assert cap_default == 144  # 2 * 60 * 1.2 = 144

        cap_custom = calculate_daily_max_capacity(3, 1.2)
        assert cap_custom == 216  # 3 * 60 * 1.2 = 216

    def test_wb_04_time_formatter_branches(self):
        """
        Test ID: WB-04 / UT-04
        Objective: Test format_slot_time branches:
                   AM vs PM, hour 12 vs hour != 12, minute < 10 vs minute >= 10.
        """
        assert format_slot_time(9, 0) == "9:00 AM"
        assert format_slot_time(12, 15) == "12:15 PM"
        assert format_slot_time(14, 5) == "2:05 PM"
        assert format_slot_time(0, 30) == "12:30 AM"

    def test_wb_05_timetable_slots_all_preferences_and_breaks(self):
        """
        Test ID: WB-05 / UT-05
        Objective: Test all branches of generate_study_timetable_slots:
                   morning, afternoon, evening, night, default slot,
                   with breaks (True) and without breaks (False).
        """
        # Test morning with breaks
        sched_m = generate_study_timetable_slots(["Monday"], 2, "morning", True)
        assert len(sched_m["Monday"]) == 2
        assert sched_m["Monday"][0]["type"] == "study"
        assert sched_m["Monday"][1]["type"] == "practice"

        # Test afternoon without breaks
        sched_a = generate_study_timetable_slots(["Tuesday"], 1, "afternoon", False)
        assert len(sched_a["Tuesday"]) == 1

        # Test evening
        sched_e = generate_study_timetable_slots(["Wednesday"], 1, "evening", True)
        assert sched_e["Wednesday"][0]["start"] == "6:00 PM"

        # Test night
        sched_n = generate_study_timetable_slots(["Thursday"], 1, "night", True)
        assert sched_n["Thursday"][0]["start"] == "9:00 PM"

        # Test default/unknown slot
        sched_def = generate_study_timetable_slots(["Friday"], 1, "unknown", True)
        assert sched_def["Friday"][0]["start"] == "10:00 AM"
