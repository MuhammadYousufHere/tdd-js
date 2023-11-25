/* eslint-disable no-unused-vars */
import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb'
import config from '../config/config.js'
import CustomError from '../utils/error.js'
import logger from './logger.js'

const MondgoDbInstance = new MongoClient(config.mongodbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

/**
 * @type {null | Db}
 *
 * */
let client = null

export class MongoDB {
  /**
   * @returns {MongoClient} database connection.
   */
  static dbClient() {
    return client
  }

  /**
   * Return the specified collection.
   *
   * @param   {string} collectionName - Name of the collection.
   * @returns {Collection} The MongoDB collection.
   *
   * @example
   *   const booksColln = await Db.collection('books');
   *   const books = await booksColln.find({ author: 'David' }).toArray();
   */

  static async collection(collectionName) {
    if (!client) await makeConnection()

    const collection = client.collection(collectionName)
    if (!collection) throw new Error(`Collection ${collectionName} not found`)

    return collection
  }

  /**
   * Create a collection.
   *
   * @param {string} collectionName - Name of collection to be created.
   * @param {Object} options - Create collection options.
   */

  static async createCollection(collectionName, options) {
    if (!client) await makeConnection()

    await client.createCollection(collectionName, { ...options })
  }

  /**
   * Execute database command.
   *
   * @param {Object} command - Command hash
   */

  static async command(command) {
    if (!client) await makeConnection()

    await client.command(command)
  }
}

/**
 * @type {string} dbName - name of database
 *
 * */
async function makeConnection(dbName = 'test') {
  if (!config.mongodbURI) throw new Error('No MongoDB configuration available')

  try {
    const availableDbs = (await MondgoDbInstance.db().admin().listDatabases())
      .databases
    const dbExists = availableDbs.findIndex(currdb => currdb.name === dbName)
    if (dbExists !== -1) {
      logger.info(`Connecting to Database: ${dbName}`)
      client = MondgoDbInstance.db(dbName)
      return await MondgoDbInstance.db(dbName).command({ ping: 1 })
    }
    throw new CustomError(
      `Database ${dbName} does not exists! 💣`,
      `Available Databases are: ${availableDbs.map(
        currdb => `${currdb.name}`,
      )} ✨`,
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  } finally {
    MondgoDbInstance.close()
  }
}

export default makeConnection
