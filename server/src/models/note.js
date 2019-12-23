const note = (sequelize, DataTypes) => {
  const Note = sequelize.define('note', {
    text: {
      type: DataTypes.STRING,
    },
  })

  Note.associate = models => {
    Note.belongsTo(models.User)
  }

  return Note
}

export default note
