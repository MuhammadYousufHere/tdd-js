import _ from 'lodash'
import { getLetterCount } from './getLetterCount.js'

export const isAnagram = (str1, str2) => {
  // const strLetters1 = str1.split('')
  // const strLetters2 = str2.split('')
  const strLetters1Count = getLetterCount(str1)
  const strLetters2Count = getLetterCount(str2)

  // return strLetters1.every(
  //   (char) =>
  //     strLetters2.includes(char) &&
  //     strLetters2.every((letter) => strLetters1.includes(letter))
  // )

  return _.isEqual(strLetters1Count, strLetters2Count)
}
