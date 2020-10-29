const cookieParser = require("cookie-parser");
const { verify } = require("jsonwebtoken");
const cors = require("cors");
const permissions = require("./utils/hasPermissions")
require("dotenv").config({ path: "./variables.env" });
const createYogaServer = require("./createServer");
const prismaDB = require("./prismaDB");

const server = createYogaServer();
server.express.use(
  cors({
    preflightContinue: true,
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
//todo use middleware to handle cookies (JWT)
server.express.use(cookieParser());
//todo decode the jwt so we can get the userId on every request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    // extract userId from token
    const { userId } = verify(token, process.env.APP_SECRET);
    // send the userId along with every request for easy access of the user id
    req.userId = userId;
  }
  console.log(token);
  next();
});
//todo create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();

  const user = await prismaDB.query.user(
    { where: { id: req.userId } },
    `{id,name,permissions,email}`
  );
  req.user = user;
  console.log(user);
  next();
});

// start the server
server.start(
  {
    // port: process.env.PORT,
    appSecret: process.env.APP_SECRET,
    port: 50000,
    getEndpoint: true,
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
      // origin: "http://localhost:10000",
    },
  },

  (deets) => {
    console.log(deets);
    console.log(`server running on port new http://localhost:${deets.port}`);
  }
);
