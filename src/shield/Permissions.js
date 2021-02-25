const rules = require('./Rules')
const { shield, chain, and, or, not } = require('graphql-shield')

const { isAuthenticated } = rules

const Permissions = shield({
  Mutation: {
    createRegion: isAuthenticated,
  },
})

module.exports = Permissions
