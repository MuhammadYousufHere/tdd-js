import { expect } from 'chai'
import { getLetterCount } from '../getLetterCount.js'

// # Vocab
// deep.equal ==> compare objects

describe('getLetterCount', function () {
  // describe - can use describe again to catogories
  // it - use to test individual edge case

  it('returns an empty object when a empty string is passed as argument', function () {
    const expected = {}
    const actual = getLetterCount('')

    expect(actual).to.deep.equal(expected)
  })
  it('should return the correct letter count for a word with only one of each letter', function () {
    const expected = { c: 1, a: 1, t: 1 }
    const actual = getLetterCount('cat')

    expect(actual).to.deep.equal(expected)
  })
  it('should return the correct letter count for a word with more then one of certain letters - mississippi', function () {
    const expected = { m: 1, i: 4, s: 4, p: 2 }
    const actual = getLetterCount('mississippi')

    expect(actual).to.deep.equal(expected)
  })
})
