const { GraphQLServer } = require('graphql-yoga')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const prismaDB = require('./prismaDB')


const createServer = () => {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    // always get prisma and the request object from every context
    context: req => ({
      ...req,
      prismaDB,
    }),
  })
}

module.exports = createServer
