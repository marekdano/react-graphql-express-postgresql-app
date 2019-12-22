import uuidv4 from 'uuid/v4'

export default {
  Query: {
    notes: (parent, args, { models }) => {
      return Object.values(models.notes)
    },
    note: (parent, { id }, { models }) => {
      return models.notes[id]
    },
  },

  Mutation: {
    createNote: (parent, { text }, { me, models }) => {
      const id = uuidv4()
      const note = {
        id,
        text,
        userId: me.id,
      }

      models.notes[id] = note
      models.users[me.id].noteIds.push(id)
      return note
    },
    updateNote: (parent, { id, text }, { me, models }) => {
      const { [id]: note, _ } = models.notes
      if (!note || note.userId !== me.id) {
        throw new Error(`Note with ID '${id}' cannot be updated.`)
      }
      const updatedNote = {
        ...note,
        text,
      }
      models.notes[id] = updatedNote
      return updatedNote
    },
    deleteNote: (parent, { id }, { models }) => {
      const { [id]: note, ...otherNotes } = models.notes
      if (!note) {
        return false
      }
      models.notes = otherNotes
      return true
    },
  },

  Note: {
    user: (note, args, { models }) => {
      return models.users[note.userId]
    },
  },
}
