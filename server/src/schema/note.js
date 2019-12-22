import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    notes: [Note!]
    note(id: ID!): Note!
  }

  extend type Mutation {
    createNote(text: String!): Note!
    updateNote(id: ID!, text: String!): Note!
    deleteNote(id: ID!): Boolean!
  }

  type Note {
    id: ID!
    text: String!
    user: User!
  }
`
