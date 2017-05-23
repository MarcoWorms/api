import { MongoClient } from 'mongodb'

import dao from './dao'

function build (db) {
  return {
    users: dao.build(db.collection('users')),
  }
}

function connect () {
  return MongoClient
    .connect(process.env.MONGO_URL, { promiseLibrary: Promise })
    .then(build)
}

export default {
  connect,
}
