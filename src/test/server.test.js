import { expect } from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import db from '../db.js'
import { app } from '../server.js'

describe('GET /users/username', function () {
  it('sends the correct username response when a user with a username is passed', async function () {
    // create test doubles - SINON - replaces the original with the fake function
    // test server endpoints - SUPERTEST

    const fakeData = {
      id: '1232fe',
      fullName: 'Ali Khan',
      username: 'alihere',
      email: 'kkhanali@gmail.com',
    }
    // sinon
    const stub = sinon.stub(db, 'getUserByUserName').resolves(fakeData)

    // test how our server behaves when recieves the get request
    await request(app)
      .get('/users/alihere')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(fakeData)

    // first call to stub should be called with arg - alihere
    expect(stub.getCall(0).args[0]).to.equal('alihere')
    stub.restore() //  method is returned to normal when other test runs.
  })
  it('handles the server error response', async function () {
    const fakeError = {
      message: 'Something went wrong:(',
    }
    // sinon
    const stub = sinon.stub(db, 'getUserByUserName').throws(fakeError)

    // test how our server behaves when recieves the get request
    await request(app)
      .get('/users/alihere')
      .expect(500)
      .expect('Content-Type', /json/)
      .expect(fakeError)

    stub.restore() //  method is returned to normal when other test runs.
  })
  it('returns the appropriate response when the user is not found', async function () {
    const stub = sinon.stub(db, 'getUserByUserName').resolves(null)

    await request(app).get('/users/def').expect(404)
    stub.restore()
  })
})
