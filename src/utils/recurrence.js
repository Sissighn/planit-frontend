// utils/recurrence.js

// Compute the next occurrence date (ISO format)
export function getNextOccurrence(task) {
  const today = new Date().toISOString().split("T")[0];

  // Non-repeating tasks → just return the deadline
  if (!task.repeatFrequency || task.repeatFrequency === "NONE") {
    return task.deadline || null;
  }

  const { repeatFrequency, repeatInterval, repeatDays, repeatUntil, deadline } =
    task;

  const start = deadline || today;
  const interval = repeatInterval || 1;

  // Convert ISO to Date
  let next = new Date(start);
  let current = new Date(today);

  // DAILY
  if (repeatFrequency === "DAILY") {
    while (next < current) {
      next.setDate(next.getDate() + interval);
    }
  }

  // WEEKLY
  if (repeatFrequency === "WEEKLY") {
    const days = (repeatDays || "")
      .split(",")
      .map((d) => d.trim().toUpperCase());
    const weekdayMap = {
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6,
      SUN: 0,
    };

    let found = false;
    let check = new Date(start);

    while (!found || check < current) {
      for (const day of days) {
        const d = new Date(check);
        while (d.getDay() !== weekdayMap[day]) d.setDate(d.getDate() + 1);

        if (d >= current) {
          next = d;
          found = true;
          break;
        }
      }
      check.setDate(check.getDate() + 7 * interval);
    }
  }

  // MONTHLY
  if (repeatFrequency === "MONTHLY") {
    while (next < current) {
      next.setMonth(next.getMonth() + interval);
    }
  }

  // YEARLY
  if (repeatFrequency === "YEARLY") {
    while (next < current) {
      next.setFullYear(next.getFullYear() + interval);
    }
  }

  const resultISO = next.toISOString().split("T")[0];

  if (repeatUntil && resultISO > repeatUntil) return null;

  return resultISO;
}
