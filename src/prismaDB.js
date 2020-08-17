const { Prisma } = require('prisma-binding');

require("dotenv").config({ path: "./variables.env" });

// connects to the remote prisma DB so we can query with js...
const prismaDB = new Prisma({
     typeDefs: 'src/generated/prisma.graphql',
     debug: true,
     endpoint: process.env.PRISMA_ENDPOINT,
     secret: process.env.PRISMA_SECRET,
     // endpoint: "https://eu1.prisma.sh/kouatchoua/sygefex-back/dev",
     // secret: 'omgplzdonttellanyone',
});
module.exports = prismaDB;