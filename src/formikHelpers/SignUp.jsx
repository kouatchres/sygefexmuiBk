const { User } = require('./User')
const { validator, formatYupError } = require('./errorHelpers')

module.exports = async (_, args) => {
  const duplicateEmail = 'email already taken'

  try {
    await validator.validate(args, { abortEarly: false })
  } catch (err) {
    return formatYupError(err)
  }

  const { email, name, password } = args

  const userExists = await User.findOne({
    where: { email },
    select: ['id']
  })

  if (userExists) {
    return [
      {
        path: 'email',
        message: duplicateEmail
      }
    ]
  }

  const user = User.create({ email, name, password })

  await user.save()

  return null
}