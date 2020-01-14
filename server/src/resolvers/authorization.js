import { ForbiddenError } from 'apollo-server'
import { combineResolvers, skip } from 'graphql-resolvers'

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.')

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => {
    return role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin.')
  } 
)

  export const isNoteOwner = async (parent, { id }, { models, me }) => {
  const note = await models.Note.findByPk(id, { raw: true })
  if (note.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.')
  }
  return skip
}
