import cors from 'cors'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize } from './models'

const app = express()
app.use(cors())

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '')

    return {
      ...error,
      message,
    }
  },
  context: async () => ({
    models,
    me: await models.User.findByLogin('marekdano'),
  }),
})

server.applyMiddleware({ app, path: '/graphql' })

const eraseDatabaseOnSync = true

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages()
  }

  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql')
  })
})

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'marekdano',
      notes: [{ text: 'Hello' }, { text: 'Cau' }],
    },
    {
      include: [models.Note],
    },
  )
  await models.User.create(
    {
      username: 'lauradanova',
      notes: [{ text: 'Ahoy' }],
    },
    {
      include: [models.Note],
    },
  )
}

// Sample of making request on the client with fetch
// fetch("http://localhost:8000/graphql",
//   {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       query: `{ me { username } }`
//     })
//   }
// )
// .then(res => res.json())
// .then(result => console.log(result))
