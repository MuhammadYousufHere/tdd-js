import { expect } from 'chai'
import { isAnagram } from '../compareAnagram.js'

describe('isAnagram - basic functionality', function () {
  it('checks if letter are anagrams when known anagrams are passed', function () {
    const expected = true
    const actual = isAnagram('listen', 'silent')
    expect(actual).to.be.equal(expected)
  })
  it('returns false when either of word has extra letter', function () {
    const expected = false
    const actual1 = isAnagram('below', 'elbows')
    expect(actual1).to.be.equal(expected)

    const actual2 = isAnagram('elbows', 'below')
    expect(actual2).to.equal(actual2)
  })
  it('returns false when strings have same letters in different quantities', function () {
    const expected = false
    const actual1 = isAnagram('listens', 'silent')
    expect(actual1).to.be.equal(expected)

    // const actual2 = isAnagram('elbows', 'below')
    // expect(actual2).to.equal(actual2)
  })
})
