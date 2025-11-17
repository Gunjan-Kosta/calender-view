
/**
 * Gets the long month name for a given date.
 * @param date - The date to get the month name from.
 * @param locale - The locale to use for formatting. Defaults to 'en-US'.
 * @returns The full name of the month (e.g., "January").
 */
export const getMonthName = (date: Date, locale = 'en-US'): string => {
  return date.toLocaleString(locale, { month: 'long' });
};

/**
 * Gets the full year from a given date.
 * @param date - The date object.
 * @returns The four-digit year.
 */
export const getYear = (date: Date): number => {
  return date.getFullYear();
};

/**
 * Checks if two dates fall on the same day, ignoring time.
 * Returns false if either date is falsy.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns True if the dates are on the same day, false otherwise.
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Checks if a given date is today.
 * @param date - The date to check.
 * @returns True if the date is today, false otherwise.
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Generates a 42-cell (6 weeks x 7 days) grid of dates for a month view.
 * The grid starts on a Sunday and includes days from the previous and next months.
 * @param date - A date within the target month.
 * @returns An array of 42 Date objects representing the calendar grid.
 */
export const getCalendarGrid = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); 

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfWeek);

  const grid: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);
    grid.push(day);
  }
  return grid;
};

/**
 * Generates an array of 7 dates representing a full week (Sunday to Saturday)
 * containing the given date.
 * @param date - A date within the target week.
 * @returns An array of 7 Date objects for the week.
 */
export const getWeekDays = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const week = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        week.push(day);
    }
    return week;
}

/**
 * Formats a date object into a time string (e.g., "10:30 AM").
 * @param date - The date to format.
 * @returns A formatted time string with AM/PM.
 */
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Calculates the number of hours between two dates.
 * @param start - The start date.
 * @param end - The end date.
 * @returns The total number of hours between the two dates.
 */
export const getHoursBetween = (start: Date, end: Date): number => {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
