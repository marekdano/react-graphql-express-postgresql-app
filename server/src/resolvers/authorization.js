import { ForbiddenError } from 'apollo-server'
import { skip } from 'graphql-resolvers'

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.')

export const isNoteOwner = async (parent, { id }, { models, me }) => {
  const note = await models.Note.findByPk(id, { raw: true })
  if (note.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.')
  }
  return skip
}
