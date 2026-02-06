/**
 * Date and time formatting utilities
 */

/**
 * Format a date to yyyy-MM-dd
 */
export function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a time to HH:mm
 */
export function formatTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format a datetime to yyyy-MM-dd HH:mm:ss
 */
export function formatDateTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const dateStr = formatDate(date);
  const timeStr = formatTime(date);
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${dateStr} ${timeStr}:${seconds}`;
}

/**
 * Parse a time string (HH:mm) to minutes since midnight
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes to time string (HH:mm)
 */
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Convert minutes to hours display (e.g., 7h 30m)
 */
export function minutesToHoursDisplay(minutes) {
  if (!minutes && minutes !== 0) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Get today's date in yyyy-MM-dd format
 */
export function getToday() {
  return formatDate(new Date());
}

/**
 * Parse a date string to Date object
 */
export function parseDate(dateStr) {
  return new Date(dateStr);
}

/**
 * Get a date offset by days
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format date for display (e.g., "15 de enero de 2026")
 */
export function formatDateForDisplay(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}
