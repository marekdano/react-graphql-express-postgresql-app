// import uuidv4 from 'uuid/v4'

export default {
  Query: {
    notes: async (parent, args, { models }) => {
      return await models.Note.findAll()
    },
    note: async (parent, { id }, { models }) => {
      return await models.Note.findById(id)
    },
  },

  Mutation: {
    createNote: async (parent, { text }, { me, models }) => {
      return await models.Note.create({
        // id: uuidv4(),
        text,
        userId: me.id,
      })
    },

    updateNote: async (parent, { id, text }, { me, models }) => {
      await models.Note.update({ text }, { where: { id } })
      return await models.Note.findById(id, { include })
    },

    deleteNote: async (parent, { id }, { models }) => {
      return await models.Note.destroy({ where: { id } })
    },
  },

  Note: {
    user: async (note, args, { models }) => {
      return await models.User.findById(note.userId)
    },
  },
}
