const { shield, rule, and, or, not } = require('graphql-shield')

// const isAuthenticated = rule ({ cache: 'contextual' })(
//   async (parent, args, { prismaDB, request: { userId, user } }, info) => {
//     return user !== null
//   },
// )

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, { prismaDB, request: { userId, user } }, info) => {
    return !!userId
  },
)


const middlewareShield = shield({
  Mutation: {
    createRegion: isAuthenticated,
  },
})
module.exports = middlewareShield