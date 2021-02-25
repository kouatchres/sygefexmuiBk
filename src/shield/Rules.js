const { rule } = require('graphql-shield')

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, { prismaDB, request: { userId, user } }, info) => {
    return user !== null
  },
)

const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, { prismaDB, request: { userId, user } }, info) => {
    return user.permissions.includes('ADMIN')
  },
)

// const isAuthenticated = rule({ cache: 'contextual' })(
//   async (parent, args, ctx, info) => {
//     return ctx.user !== null
//   },
// )

// const isAdmin = rule({ cache: 'contextual' })(
//   async (parent, args, ctx, info) => {
//     return ctx.user.role === 'admin'
//   },
// )

// const isEditor = rule({ cache: 'contextual' })(
//   async (parent, args, ctx, info) => {
//     return ctx.user.role === 'editor'
//   },
// )
