const isAuthenticated = async (
  parent,
  args,
  { prismaDB, request: { userId, user } },
  info
) => {
  if (!userId) {
    throw new Error("Veuillez vous connecter");
  }
}




      hasPermissions(user, ["USER", "ADMIN", "CENTER_ADMIN"]);


const middleware = {
  Mutation: {
    createRegion: isAuthenticated,
  },
}
module.exports = middleware;
