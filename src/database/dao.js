import {
  partial,
  always,
  identity,
  ifElse,
  isNil,
  merge,
  assoc,
  prop,
  pipe,
  omit,
  map,
} from 'ramda'

import retryPromise from 'bluebird-retry'

const queries = {
  notDeleted: { deletedAt: { $exists: false } },
}

const retry = func =>
  retryPromise(func, { max_tries: 4, interval: 500 })

function find (collection, query) {
  return retry(() =>
    collection.find(merge(queries.notDeleted, query))
      .toArray()
  )
}

function update (collection, query, document, options) {
  const sealed = merge({}, document)
  const opts = merge({ returnOriginal: false }, options || {})

  return retry(() =>
    collection.findOneAndUpdate(query, sealed, opts)
      .then(prop('value'))
      .then(ifElse(
        isNil,
        identity
      ))
  )
}

function create (collection, document) {
  const now = new Date()
  const timestamps = {
    createdAt: now,
    updatedAt: now,
  }

  const sealed = merge(document, timestamps)

  return retry(() =>
    collection.insertOne(sealed)
  )
}

function destroy (collection, query, options) {
  if (options.hard) {
    return retry(() => collection.remove(query))
  }

  return retry(() => collection.findOneAndUpdate(
    query, { $set: { deletedAt: new Date() } }))
}

function aggregate (collection, pipeline) {
  return retry(() => collection.aggregate(pipeline).toArray())
}

function build (collection) {
  return {
    find: partial(find, [collection]),
    update: partial(update, [collection]),
    create: partial(create, [collection]),
    destroy: partial(destroy, [collection]),
    aggregate: partial(aggregate, [collection]),
  }
}

export default {
  build,
}
