import routes from './models/routes'
import handlers from './handlers'
import database from './database'


export default app =>
  database.connect()
    .then(dao => {
      routes.forEach(({ method, path, handler }) => {
        app[method](path, handlers[handler](dao))
      })
      return app
    })
