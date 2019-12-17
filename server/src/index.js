import cors from 'cors'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

const app = express()
app.use(cors())

const schema = gql`
  type Query {
    me: User
  }

  type User {
    username: String!
  }
`

const resolvers = {
  Query: {
    me: () => {
      return {
        username: 'Marek Dano',
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
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
