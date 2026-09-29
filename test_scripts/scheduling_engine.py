"""
=============================================================================
Course: CSE312 - Software Architecture: Principles and Practices
Core Scheduling & Algorithmic Logic Implementation for White-Box Unit Testing
=============================================================================
"""

import math
from datetime import datetime, timedelta


def format_slot_time(hour, minute):
    """Formats 24h hour and minute into 12-hour AM/PM string."""
    period = "PM" if hour >= 12 else "AM"
    display_hour = 12 if hour % 12 == 0 else hour % 12
    display_minute = f"0{minute}" if minute < 10 else f"{minute}"
    return f"{display_hour}:{display_minute} {period}"


def calculate_daily_max_capacity(hours_per_day, tolerance_factor=1.2):
    """
    Calculates maximum allowable minutes per day with tolerance factor.
    Branch 1: hours_per_day <= 0 defaults to 2 hours
    Branch 2: hours_per_day > 0 uses provided hours
    """
    effective_hours = hours_per_day if hours_per_day and hours_per_day > 0 else 2
    daily_max_minutes = effective_hours * 60
    return round(daily_max_minutes * tolerance_factor)


def redistribute_overdue_tasks(pending_tasks, future_days, existing_daily_loads, max_capacity_minutes):
    """
    White-Box Unit Function:
    Redistributes pending/overdue tasks across upcoming days without overloading.
    Branches:
    - If pending_tasks is empty -> return 0 redistributed
    - For each task:
      - Branch A: Finds earliest future day where current_load + duration <= max_capacity
      - Branch B: If all days at capacity, finds future day with minimum load
    """
    if not pending_tasks:
        return {"rescheduled_count": 0, "assignments": []}

    daily_loads = dict(existing_daily_loads)
    for day in future_days:
        if day not in daily_loads:
            daily_loads[day] = 0

    assignments = []

    for task in pending_tasks:
        task_duration = task.get("durationMinutes", 60)
        target_day = None

        # Branch A: Earliest day with capacity
        for day in future_days:
            if daily_loads[day] + task_duration <= max_capacity_minutes:
                target_day = day
                daily_loads[day] += task_duration
                break

        # Branch B: Fallback to day with minimum load
        if not target_day:
            target_day = min(future_days, key=lambda d: daily_loads[d])
            daily_loads[target_day] += task_duration

        assignments.append({
            "task_id": task["id"],
            "title": task["title"],
            "target_day": target_day,
            "duration": task_duration
        })

    return {
        "rescheduled_count": len(assignments),
        "assignments": assignments,
        "final_loads": daily_loads
    }


def generate_study_timetable_slots(available_days, daily_hours, preferred_slot="morning", include_breaks=True):
    """
    White-Box Unit Function:
    Generates study and practice timetable blocks with optional recovery breaks.
    Branches:
    - preferred_slot: morning (9am), afternoon (2pm), evening (6pm), night (9pm), default (10am)
    - include_breaks: True inserts 15-min break between blocks; False does not
    """
    if preferred_slot == "morning":
        start_hour = 9
    elif preferred_slot == "afternoon":
        start_hour = 14
    elif preferred_slot == "evening":
        start_hour = 18
    elif preferred_slot == "night":
        start_hour = 21
    else:
        start_hour = 10

    study_block_minutes = 60
    break_minutes = 15 if include_breaks else 0
    daily_target_minutes = (daily_hours if daily_hours > 0 else 2) * 60

    schedule = {}

    for day in available_days:
        current_minutes = start_hour * 60
        accumulated_study = 0
        day_blocks = []
        block_idx = 0

        while accumulated_study + study_block_minutes <= daily_target_minutes:
            is_practice = (block_idx % 2 == 1)
            block_type = "practice" if is_practice else "study"

            start_h = current_minutes // 60
            start_m = current_minutes % 60
            end_minutes = current_minutes + study_block_minutes
            end_h = end_minutes // 60
            end_m = end_minutes % 60

            day_blocks.append({
                "type": block_type,
                "start": format_slot_time(start_h, start_m),
                "end": format_slot_time(end_h, end_m),
                "duration": study_block_minutes
            })

            accumulated_study += study_block_minutes
            current_minutes = end_minutes + break_minutes
            block_idx += 1

        schedule[day] = day_blocks

    return schedule
