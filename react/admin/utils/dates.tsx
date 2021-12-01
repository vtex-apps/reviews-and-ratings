/* eslint-disable no-restricted-globals */
export function filterDate(date: string, separator = '/') {
  const newDate = new Date(date)
  const day = newDate.getDate()
  const month = newDate.getMonth() + 1
  const year = newDate.getFullYear()

  return `${month < 10 ? `0${month}` : `${month}`}${separator}${
    day < 10 ? `0${day}` : `${day}`
  }${separator}${year}`
}

export function currentDate() {
  const d = new Date()

  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}
