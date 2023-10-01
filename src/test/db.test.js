import { expect } from 'chai'
import { getUserByUserName } from '../db.js'
import { getDBData, resetDB, setDB } from '../utils/test-helper.js'

describe('getUserByUserName', function () {
  // utilize the afterEach form mocha to cleanup the dbs to avoid fake assertion to new tests.
  afterEach('cleanup - reset db', async () => {
    await resetDB()
  })
  it('gets the correct user form db provided the username', async function () {
    // Tests
    const fakeData = [
      {
        id: '1232fe',
        fullName: 'Ali Khan',
        username: 'alihere',
        email: 'kkhanali@gmail.com',
      },
      {
        id: 'ewr32fe',
        fullName: 'Baqir Raza',
        username: '',
        email: 'razabaqir@gmail.com',
      },
      {
        id: '12rwt2fe',
        fullName: 'Asim Ahemd',
        username: '',
        email: 'iasim@gmail.com',
      },
      {
        id: '12rewfe',
        fullName: 'Sameer Hassan',
        username: '',
        email: 'hassans@gmail.com',
      },
    ]
    await setDB('users', fakeData)
    const actualUser = await getUserByUserName('alihere')

    const dbState = await getDBData('users')
    // tests

    const expected = {
      id: '1232fe',
      username: 'alihere',
      fullName: 'Ali Khan',
      email: 'kkhanali@gmail.com',
    }
    expect(actualUser).excludingEvery('_id').to.deep.equal(expected)
    expect(dbState).excludingEvery('_id').to.deep.equal(fakeData)
  })
  it('returns the appropriate response when the user is not found', async function () {
    await setDB('users', [
      {
        id: '1232fe',
        username: 'alihere',
        fullName: 'Ali Khan',
        email: 'kkhanali@gmail.com',
      },
    ])
    const actual = await getUserByUserName('lol')
    expect(actual).to.be.null
  })
})
