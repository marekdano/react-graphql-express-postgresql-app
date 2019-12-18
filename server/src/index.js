import cors from 'cors'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

const app = express()
app.use(cors())

const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  type User {
    id: ID!
    username: String!
  }
`

let users = {
  1: {
    id: '1',
    username: 'Marek Dano',
  },
  2: {
    id: '2',
    username: 'Laura Danova',
  },
}

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users)
    },
    user: (parent, { id }) => {
      return users[id]
    },
    me: (parent, args, { me }) => {
      return me
    },
  },
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql')
})

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
