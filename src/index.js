const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./variables.env" });
const createYogaServer = require("./createServer");
const db = require("./db");

const server = createYogaServer();
// use middleware to handle cookies (JWT)
server.express.use(cookieParser());
//decode the jwt so we can get the userId on every request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    // extract userId from token
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // send the userId along with every request for easy access of the user id
    req.userId = userId;
  }
  console.log(token);
  next();
});

// start the server
server.start(
  {
    cors: {
      credentials: true,
      // origin: process.env.FRONTEND_URL
      origin: "http://localhost:10000",
    },
  },
  (deets) => {
    console.log(`server running on port http://localhost:${deets.port}`);
  }
);
