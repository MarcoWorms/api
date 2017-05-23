import { validate } from './utils'

export default dao => (req, res) => {
  validate(['email', 'password'], req, res)
  const { email, password } = req.params
  return dao.users.create({ email, password })
    .then(() => res.send('success'))
}
