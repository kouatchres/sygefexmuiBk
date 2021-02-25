const isAuthenticated = async (
  parent,
  args,
  { prismaDB, request: { userId, user } },
  info,
) => {
  if (!userId) {
    throw new Error('Veuillez vous connecter')
  }
}

module.exports = isAuthenticated
