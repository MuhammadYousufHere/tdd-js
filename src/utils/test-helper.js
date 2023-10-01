import { MongoClient } from 'mongodb'

export const setDB = async (collecName, data) => {
  const client = await MongoClient.connect('mongodb://localhost:27017/TEST_DB')

  const db = client.db('TEST_DB')

  await db.collection(collecName).insertMany(data)

  // close the connection
  client.close()
}
export const getDBData = async (collecName) => {
  const client = await MongoClient.connect('mongodb://localhost:27017/TEST_DB')

  const db = client.db('TEST_DB')

  const res = await db.collection(collecName).find({}).toArray()

  // close the connection
  client.close()
  return res
}
export const resetDB = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017/TEST_DB')

  const db = client.db('TEST_DB')

  await db.dropDatabase()

  // close the connection
  client.close()
}
