const { Prisma } = require('prisma-binding');

// connects to the remote  prisma db and the ability to query with js...
const db = new Prisma({
     typeDefs: 'src/generated/prisma.graphql',
     endpoint: "https://eu1.prisma.sh/kouatchoua/inex-back/dev",
     //  endpoint: process.env.PRISMA_ENDPOINT,
     secret: process.env.PRISMA_SECRET,
     debug: true,
});
module.exports = db;