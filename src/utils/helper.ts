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
export const formatedDate = new Date()
  .toISOString()
  .replace(/T/, ' ')
  .replace(/\..+/g, '')

export const toUpperCase = (str: string): string => {
  return str ? str.toUpperCase() : str
}
export function isEmail(email: string): boolean {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi
  return regexExp.test(email)
}
