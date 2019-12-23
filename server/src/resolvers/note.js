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
    createNote: async (parent, { text }, { me, models }) => {
      try {
        return await models.Note.create({
          text,
          userId: me.id,
        })
      } catch (error) {
        throw new Error(error)
      }
    },

    updateNote: async (parent, { id, text }, { me, models }) => {
      try {
        await models.Note.update({ text }, { where: { id, userId: me.id } })
      } catch (error) {
        throw new Error(error)
      }

      return await models.Note.findByPk(id)
    },

    deleteNote: async (parent, { id }, { models }) => {
      return await models.Note.destroy({ where: { id } })
    },
  },

  Note: {
    user: async (note, args, { models }) => {
      return await models.User.findByPk(note.userId)
    },
  },
}
