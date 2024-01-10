export function firstLetterUppercase(str: string): string {
  const valueString = str.toLowerCase()
  return valueString
    .split(' ')
    .map(
      (value: string) =>
        `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`
    )
    .join(' ')
}

export function lowerCase(str: string): string {
  return str.toLowerCase()
}

export const toUpperCase = (str: string): string => {
  return str ? str.toUpperCase() : str
}
