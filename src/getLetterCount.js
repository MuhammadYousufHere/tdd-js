export const getLetterCount = (str) => {
  // if (!str) return {}
  const letters = str.split('')
  const letterCount = {}

  letters.forEach((letter) => {
    if (!letterCount[letter]) {
      letterCount[letter] = 1
    } else {
      letterCount[letter] += 1
    }
  })
  return letterCount
}
