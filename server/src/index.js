import cors from 'cors'
import express from 'express'
import uuidv4 from 'uuid/v4'
import { ApolloServer, gql } from 'apollo-server-express'

const app = express()
app.use(cors())

const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User

    notes: [Note!]
    note(id: ID!): Note!
  }

  type User {
    id: ID!
    username: String!
    notes: [Note!]
  }

  type Note {
    id: ID!
    text: String!
    user: User!
  }

  type Mutation {
    createNote(text: String!): Note!
    deleteNote(id: ID!): Boolean!
  }
`

let users = {
  1: {
    id: '1',
    username: 'Marek Dano',
    noteIds: [1, 2],
  },
  2: {
    id: '2',
    username: 'Laura Danova',
    noteIds: [3],
  },
}

let notes = {
  1: {
    id: '1',
    text: 'Hello',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'Cau',
    userId: '1',
  },
  3: {
    id: '3',
    text: 'Ahoy',
    userId: '2',
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
    notes: () => {
      return Object.values(notes)
    },
    note: (parent, { id }) => {
      return notes[id]
    },
  },
  User: {
    notes: user => {
      return Object.values(notes).filter(note => note.userId === user.id)
    },
  },
  Note: {
    user: note => {
      return users[note.userId]
    },
  },
  Mutation: {
    createNote: (parent, { text }, { me }) => {
      const id = uuidv4()
      const note = {
        id,
        text,
        userId: me.id,
      }

      notes[id] = note
      users[me.id].noteIds.push(id)
      return note
    },
    deleteNote: (parent, { id }) => {
      const { [id]: note, ...otherNotes } = notes
      if (!note) {
        return false
      }
      notes = otherNotes
      return true
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
