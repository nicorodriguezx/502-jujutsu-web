// ---------------------------------------------------------------------------
// Shared formatting helpers for Prisma <-> API response conversion
// ---------------------------------------------------------------------------

/**
 * Convert a Prisma DateTime (@db.Time) to a "HH:MM:SS" string.
 * The pg driver returned TIME as a plain string; Prisma returns a Date object.
 */
function formatTime(date) {
  if (!date) return null;
  if (date instanceof Date) {
    return date.toISOString().slice(11, 19); // "HH:MM:SS" in UTC
  }
  return date;
}

/**
 * Convert a "HH:MM" or "HH:MM:SS" string to a Date that Prisma accepts
 * for DateTime @db.Time fields.
 */
function parseTime(time) {
  if (!time) return undefined;
  if (time instanceof Date) return time;
  return new Date(`1970-01-01T${time}Z`);
}

module.exports = { formatTime, parseTime };
