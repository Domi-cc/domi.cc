export function formatUptime(from, now) {
  let years  = now.getUTCFullYear()  - from.getUTCFullYear();
  let months = now.getUTCMonth()     - from.getUTCMonth();
  let days   = now.getUTCDate()      - from.getUTCDate();
  let hours  = now.getUTCHours()     - from.getUTCHours();
  let mins   = now.getUTCMinutes()   - from.getUTCMinutes();
  let secs   = now.getUTCSeconds()   - from.getUTCSeconds();

  if (secs  < 0) { secs  += 60; mins--; }
  if (mins  < 0) { mins  += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days  < 0) {
    // Borrow from previous month: days in the month before `now`
    const prevMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return `${years}y ${months}mo ${days}d ${hours}h ${mins}m ${secs}s`;
}
