import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated, isNoteOwner } from './authorization'

export default {
  Query: {
    notes: async (parent, args, { models }) => {
      return await models.Note.findAll()
    },
    note: async (parent, { id }, { models }) => {
      return await models.Note.findByPk(id)
    },
  },

  Mutation: {
    createNote: combineResolvers(isAuthenticated, async (parent, { text }, { me, models }) => {
      return await models.Note.create({
        text,
        userId: me.id,
      })
    }),

    updateNote: combineResolvers(
      isAuthenticated,
      isNoteOwner,
      async (parent, { id, text }, { me, models }) => {
        try {
          await models.Note.update({ text }, { where: { id, userId: me.id } })
        } catch (error) {
          throw new Error(error)
        }

        return await models.Note.findByPk(id)
      },
    ),

    deleteNote: combineResolvers(
      isAuthenticated,
      isNoteOwner,
      async (parent, { id }, { models }) => {
        return await models.Note.destroy({ where: { id } })
      },
    ),
  },

  Note: {
    user: async (note, args, { models }) => {
      return await models.User.findByPk(note.userId)
    },
  },
}
