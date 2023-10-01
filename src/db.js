import { MongoClient } from 'mongodb'

const { DB_URL, NODE_ENV } = process.env
const DB_NAME = NODE_ENV === 'test' ? DB_URL : 'PROD_DB'

export async function getUserByUserName(username) {
  try {
    const client = await MongoClient.connect(
      `mongodb://localhost:27017/${DB_NAME}`
    )
    const db = client.db('TEST_DB')

    const user = await db.collection('users').findOne({ username })

    client.close()
    if (user) {
      return user
    }
    return null
  } catch (err) {
    console.log({ err })
  }
}

export default { getUserByUserName }
