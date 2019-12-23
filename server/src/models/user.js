const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
    },
  })

  User.associate = models => {
    User.hasMany(models.Note, { onDelete: 'CASCADE' })
  }

  return User
}

export default user
