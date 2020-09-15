const { GraphQLServer } = require("graphql-yoga");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const prismaDB = require("./prismaDB");
const { ApolloServer, makeExecutableSchema } = require("apollo-server");
const { applyMiddleware } = require("graphql-middleware");

//create graphql yoga server
const createServer = () => {
  const schema = applyMiddleware(
    makeExecutableSchema({
      typeDefs: "src/schema.graphql",
      resolvers: {
        Mutation,
        Query,
      },
    }),
    permissions
  );

  // const server = new ApolloServer({
  //   schema,
  //   context: ...,
  // });

  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: {
      Mutation,
      Query,
    },
    schema,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    // always get prisma and the request object from every context
    context: (req) => ({
      ...req,
      prismaDB,
    }),
  });
};

module.exports = createServer;
