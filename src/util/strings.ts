export const truncate = (str: string, n: number): string => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str
}

export const humanize = (str: string) => {
  return str
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/^[a-z]/, function(m) {
      return m.toUpperCase()
    })
}
