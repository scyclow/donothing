// reusable: total seconds -> human string.
// 43 -> "43 seconds", 65 -> "1 minute, 5 seconds", 3603 -> "1 hour, 0 minutes, 3 seconds"
export const formatTime = totalSeconds => {
  const t = Math.max(0, Math.floor(totalSeconds))

  const units = [
    [Math.floor(t / 86400), 'day'],
    [Math.floor((t % 86400) / 3600), 'hour'],
    [Math.floor((t % 3600) / 60), 'minute'],
    [t % 60, 'second'],
  ]

  const first = units.findIndex(([v]) => v > 0)
  if (first === -1) return '0 seconds'

  return units
    .slice(first)
    .map(([v, u]) => `${v} ${u}${v === 1 ? '' : 's'}`)
    .join(', ')
}
