import 'dotenv/config'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import express from 'express'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize } from './models'

const app = express()
app.use(cors())

const getMe = async req => {
  const token = req.headers['x-token']
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET)
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.')
    }
  }
}

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
  context: async ({ req }) => {
    const me = await getMe(req)
    return {
      models,
      me,
      secret: process.env.SECRET,
    }
  },
})

server.applyMiddleware({ app, path: '/graphql' })

const eraseDatabaseOnSync = true

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithNotes()
  }

  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql')
  })
})

const createUsersWithNotes = async () => {
  await models.User.create(
    {
      username: 'marekdano',
      email: 'marekdano@gmail.com',
      password: '1234567',
      notes: [{ text: 'Hello' }, { text: 'Cau' }],
    },
    {
      include: [models.Note],
    },
  )
  await models.User.create(
    {
      username: 'lauradanova',
      email: 'lauradanova@gmail.com',
      password: '1234567',
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
