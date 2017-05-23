import {
  contains,
  keys,
  without,
} from 'ramda'


export const validate = (required, { query }, res) => {
  if (!contains(required, keys(query))) {
    res.send({
      error: {
        message: `Missing query. ${without(query, required)} is required`,
      },
    })
  }
}
