const note = (sequelize, DataTypes) => {
  const Note = sequelize.define('note', {
    text: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'A note has to have a text.',
        },
      },
    },
  })

  Note.associate = models => {
    Note.belongsTo(models.User)
  }

  return Note
}

export default note
