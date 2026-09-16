export function getStableDateRange(to = 30) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - to)

  const formatDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  const startDate = `${formatDate(start)}T00:00:00.000Z`
  const endDate = `${formatDate(end)}T23:59:59.999Z`

  const label = `${start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} – ${end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`

  return { startDate, endDate, label }
}
